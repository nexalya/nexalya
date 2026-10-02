/**
 * Analítica de Instagram calculada a partir de las publicaciones reales
 * importadas (ig_media, ver lib/instagram-sync.ts) y los registros de
 * seguidores. Funciones puras: no llaman a la API ni a la base de datos,
 * así que valen igual para la pestaña Métricas que para darle contexto a
 * la IA al generar el plan (lib/ai.ts).
 *
 * Lo más importante es `classifyPosts`: decide qué publicaciones
 * FUNCIONAN y cuáles NO comparando cada una con la media de la propia
 * cuenta (y de su mismo formato: un reel no se compara con un post), y
 * explica por qué.
 */

import type { FollowerSnapshot, IgMediaWithItem } from "@/lib/db-turso";
import { FORMAT_LABELS, igFormatKey, igTitle } from "@/components/ContentFormatIcons";

const DAY = 86400000;
const TIME_ZONE = "Europe/Madrid";
// Una publicación necesita un par de días para acumular casi todo su
// alcance: antes de eso compararla con las demás sería injusto.
const MATURE_AFTER_HOURS = 48;
// Para decidir qué funciona se compara con los últimos 90 días, aunque se
// esté mirando un periodo más corto: así el veredicto no cambia según el
// filtro y hay suficientes publicaciones para comparar.
const BASELINE_DAYS = 90;
const MIN_POSTS_FOR_VERDICT = 4;

export type Verdict = "WORKS" | "AVERAGE" | "FAILS" | "MATURING" | "NO_DATA";

export type ScoredPost = {
  id: string;
  title: string;
  caption: string;
  format: string; // REEL | CARRUSEL | POST
  formatLabel: string;
  timestamp: string;
  permalink: string | null;
  thumbnailUrl: string | null;
  family: string | null;
  reach: number | null;
  views: number | null;
  likes: number | null;
  comments: number | null;
  saves: number | null;
  shares: number | null;
  interactions: number;
  engagementRate: number | null; // interacciones / alcance
  score: number | null; // 1 = la media de la cuenta
  verdict: Verdict;
  reasons: string[];
};

export type DailyPoint = { date: string; value: number | null };

export type Pattern = { label: string; detail: string; tone: "good" | "bad" | "neutral" };

export type FormatStat = { format: string; label: string; count: number; avgReach: number | null; avgEngagement: number | null; avgScore: number | null };

export type HashtagStat = { tag: string; posts: number; avgReach: number; avgViews: number; totalInteractions: number; avgScore: number | null };

export type StoryRow = {
  id: string;
  timestamp: string;
  thumbnailUrl: string | null;
  permalink: string | null;
  reach: number | null;
  views: number | null;
  replies: number | null;
  shares: number | null;
  navigation: number | null;
  profileVisits: number | null;
  follows: number | null;
};

export type Analytics = {
  periodDays: number;
  from: string;
  to: string;
  summary: {
    posts: number;
    engagementRate: number | null;
    interactions: number;
    avgReach: number | null;
    views: number;
    likes: number;
    comments: number;
    saves: number;
    shares: number;
    likesPerDay: number;
    likesPerPost: number | null;
    commentsPerPost: number | null;
    savesSharesPerPost: number | null;
  };
  previous: { engagementRate: number | null; interactions: number; avgReach: number | null; views: number; posts: number };
  daily: { reach: DailyPoint[]; views: DailyPoint[]; interactions: DailyPoint[]; posts: DailyPoint[] };
  followers: {
    current: number | null;
    gained: number | null;
    series: DailyPoint[];
    gainedFromPosts: number;
  };
  posts: ScoredPost[]; // feed + reels del periodo, más recientes primero
  works: ScoredPost[];
  fails: ScoredPost[];
  patterns: Pattern[];
  byFormat: FormatStat[];
  hashtags: HashtagStat[];
  stories: {
    count: number;
    views: number;
    avgReach: number | null;
    replies: number;
    profileVisits: number;
    rows: StoryRow[];
    dailyCount: DailyPoint[];
    dailyViews: DailyPoint[];
  };
  verdictReady: boolean;
};

// ---------- utilidades ----------

export function madridDate(iso: string | Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE }).format(new Date(iso));
}

function madridHour(iso: string): number {
  return Number(new Intl.DateTimeFormat("en-GB", { hour: "2-digit", hour12: false, timeZone: TIME_ZONE }).format(new Date(iso)));
}

function madridWeekday(iso: string): number {
  const name = new Intl.DateTimeFormat("en-GB", { weekday: "short", timeZone: TIME_ZONE }).format(new Date(iso));
  return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(name);
}

const WEEKDAYS_PLURAL = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábados", "domingos"];

function median(values: number[]): number | null {
  const v = values.filter((x) => Number.isFinite(x)).sort((a, b) => a - b);
  if (v.length === 0) return null;
  const mid = Math.floor(v.length / 2);
  return v.length % 2 ? v[mid] : (v[mid - 1] + v[mid]) / 2;
}

function mean(values: number[]): number | null {
  return values.length ? values.reduce((a, b) => a + b, 0) / values.length : null;
}

function sum(values: (number | null)[]): number {
  return values.reduce<number>((a, b) => a + (b ?? 0), 0);
}

function interactionsOf(m: { likes: number | null; comments: number | null; saves: number | null; shares: number | null }) {
  return (m.likes ?? 0) + (m.comments ?? 0) + (m.saves ?? 0) + (m.shares ?? 0);
}

function ratio(n: number): string {
  return `${n.toLocaleString("es-ES", { maximumFractionDigits: 1 })}×`;
}

export function pct(n: number | null, digits = 1): string {
  return n === null ? "—" : `${(n * 100).toLocaleString("es-ES", { maximumFractionDigits: digits })}%`;
}

function dayRange(fromMs: number, toMs: number): string[] {
  const days: string[] = [];
  for (let t = fromMs; t <= toMs + 1; t += DAY) days.push(madridDate(new Date(t)));
  return [...new Set(days)];
}

export function hashtagsOf(caption: string | null): string[] {
  return [...new Set((caption ?? "").toLowerCase().match(/#[\p{L}\p{N}_]+/gu) ?? [])];
}

// ---------- veredicto: qué funciona y qué no ----------

/**
 * Puntúa cada publicación frente a la media de la cuenta:
 *  - alcance frente a la mediana de SU formato (40 %),
 *  - % de interacción frente a la mediana de la cuenta (35 %),
 *  - guardados + compartidos por persona alcanzada (25 %): es la señal
 *    de "contenido valioso" que más pesa hoy en el algoritmo.
 * 1 = en la media; ≥ 1,25 funciona; ≤ 0,75 no funciona.
 */
export function classifyPosts(media: IgMediaWithItem[], now = Date.now()): ScoredPost[] {
  const feed = media.filter((m) => m.productType !== "STORY");
  const baseline = feed.filter(
    (m) =>
      m.reach !== null &&
      m.reach > 0 &&
      now - new Date(m.timestamp).getTime() >= MATURE_AFTER_HOURS * 3600000 &&
      now - new Date(m.timestamp).getTime() <= BASELINE_DAYS * DAY
  );

  const reachByFormat = new Map<string, number[]>();
  for (const m of baseline) {
    const f = igFormatKey(m);
    reachByFormat.set(f, [...(reachByFormat.get(f) ?? []), m.reach!]);
  }
  const overallReach = median(baseline.map((m) => m.reach!));
  const medianEr = median(baseline.map((m) => interactionsOf(m) / m.reach!));
  const medianValue = median(baseline.map((m) => ((m.saves ?? 0) + (m.shares ?? 0)) / m.reach!));
  const ready = baseline.length >= MIN_POSTS_FOR_VERDICT;

  return feed.map((m) => {
    const format = igFormatKey(m);
    const interactions = interactionsOf(m);
    const engagementRate = m.reach ? interactions / m.reach : null;
    const base: ScoredPost = {
      id: m.id,
      title: igTitle(m),
      caption: m.caption ?? "",
      format,
      formatLabel: format === "REEL" ? "Reel" : FORMAT_LABELS[format] ?? format,
      timestamp: m.timestamp,
      permalink: m.permalink,
      thumbnailUrl: m.thumbnailUrl,
      family: m.family,
      reach: m.reach,
      views: m.views,
      likes: m.likes,
      comments: m.comments,
      saves: m.saves,
      shares: m.shares,
      interactions,
      engagementRate,
      score: null,
      verdict: "NO_DATA",
      reasons: [],
    };
    if (!m.reach) return base;
    if (now - new Date(m.timestamp).getTime() < MATURE_AFTER_HOURS * 3600000) {
      return { ...base, verdict: "MATURING", reasons: ["Publicada hace menos de 48 h: todavía está sumando alcance."] };
    }
    if (!ready || !overallReach) return base;

    const formatReach = reachByFormat.get(format);
    const refReach = formatReach && formatReach.length >= 3 ? median(formatReach)! : overallReach;
    const reachIdx = m.reach / refReach;
    const erIdx = medianEr ? (engagementRate ?? 0) / medianEr : 1;
    const value = ((m.saves ?? 0) + (m.shares ?? 0)) / m.reach;
    const valueIdx = medianValue ? value / medianValue : 1;
    // Se recorta cada índice para que un solo dato disparado (un post
    // que se hizo viral por compartidos) no tape todo lo demás.
    const cap = (x: number) => Math.min(x, 3);
    const score = 0.4 * cap(reachIdx) + 0.35 * cap(erIdx) + 0.25 * cap(valueIdx);
    const verdict: Verdict = score >= 1.25 ? "WORKS" : score <= 0.75 ? "FAILS" : "AVERAGE";

    const factors = [
      { idx: reachIdx, text: `Alcance ${ratio(reachIdx)} la media de ${PLURAL_FORMAT[format] ?? "publicaciones"}` },
      { idx: erIdx, text: `Interacción ${pct(engagementRate)} (${ratio(erIdx)} la media de la cuenta)` },
      { idx: valueIdx, text: `Guardados + compartidos ${ratio(valueIdx)} la media` },
    ];
    const reasons =
      verdict === "WORKS"
        ? factors.filter((f) => f.idx >= 1.1).sort((a, b) => b.idx - a.idx).map((f) => f.text)
        : verdict === "FAILS"
        ? factors.filter((f) => f.idx <= 0.9).sort((a, b) => a.idx - b.idx).map((f) => f.text)
        : [];

    return { ...base, score, verdict, reasons: reasons.slice(0, 3) };
  });
}

// ---------- patrones: por qué funciona ----------

function groupScores<T extends string>(posts: ScoredPost[], keyOf: (p: ScoredPost) => T | null) {
  const groups = new Map<T, number[]>();
  for (const p of posts) {
    if (p.score === null) continue;
    const key = keyOf(p);
    if (key === null) continue;
    groups.set(key, [...(groups.get(key) ?? []), p.score]);
  }
  return [...groups.entries()]
    .filter(([, scores]) => scores.length >= 2)
    .map(([key, scores]) => ({ key, avg: mean(scores)!, n: scores.length }))
    .sort((a, b) => b.avg - a.avg);
}

const PLURAL_FORMAT: Record<string, string> = { REEL: "reels", CARRUSEL: "carruseles", POST: "posts" };

function hourBand(iso: string): string {
  const h = madridHour(iso);
  if (h < 12) return "mañana (antes de las 12 h)";
  if (h < 16) return "mediodía (12–16 h)";
  if (h < 20) return "tarde (16–20 h)";
  return "noche (desde las 20 h)";
}

function captionBand(caption: string): string {
  const len = caption.replace(/#[\p{L}\p{N}_]+/gu, "").trim().length;
  if (len < 300) return "textos cortos (< 300 caracteres)";
  if (len < 800) return "textos medios (300–800 caracteres)";
  return "textos largos (> 800 caracteres)";
}

/**
 * Busca diferencias claras (≥ 20 %) entre grupos: formato, día, franja
 * horaria, longitud del texto, línea editorial y hashtags. Solo se
 * cuentan grupos con al menos 2 publicaciones puntuadas.
 */
export function detectPatterns(scored: ScoredPost[]): Pattern[] {
  const patterns: Pattern[] = [];
  const describe = (groups: { key: string; avg: number; n: number }[], dimension: string, name: (key: string) => string) => {
    if (groups.length < 2) return;
    const best = groups[0];
    const worst = groups[groups.length - 1];
    if (best.avg / worst.avg < 1.2) return;
    patterns.push({
      label: `${dimension}: ${name(best.key)}`,
      detail: `${ratio(best.avg / worst.avg)} mejor que ${name(worst.key)} (${best.n} vs ${worst.n} publicaciones)`,
      tone: "good",
    });
  };

  describe(groupScores(scored, (p) => p.format), "Mejor formato", (k) => PLURAL_FORMAT[k] ?? k);
  describe(groupScores(scored, (p) => String(madridWeekday(p.timestamp))), "Mejor día", (k) => `los ${WEEKDAYS_PLURAL[Number(k)]}`);
  describe(groupScores(scored, (p) => hourBand(p.timestamp)), "Mejor franja horaria", (k) => k);
  describe(groupScores(scored, (p) => captionBand(p.caption)), "Mejor longitud de texto", (k) => k);
  describe(groupScores(scored, (p) => p.family), "Mejor línea editorial", (k) => `"${k}"`);

  // Hashtags que acompañan a lo que funciona y a lo que no.
  const tagGroups = new Map<string, number[]>();
  for (const p of scored) {
    if (p.score === null) continue;
    for (const tag of hashtagsOf(p.caption)) tagGroups.set(tag, [...(tagGroups.get(tag) ?? []), p.score]);
  }
  const tags = [...tagGroups.entries()]
    .filter(([, s]) => s.length >= 2)
    .map(([tag, s]) => ({ tag, avg: mean(s)!, n: s.length }));
  const goodTags = tags.filter((t) => t.avg >= 1.2).sort((a, b) => b.avg - a.avg).slice(0, 5);
  const badTags = tags.filter((t) => t.avg <= 0.8).sort((a, b) => a.avg - b.avg).slice(0, 5);
  if (goodTags.length) {
    patterns.push({ label: "Hashtags de lo que mejor funciona", detail: goodTags.map((t) => t.tag).join(" "), tone: "good" });
  }
  if (badTags.length) {
    patterns.push({ label: "Hashtags de lo que peor funciona", detail: badTags.map((t) => t.tag).join(" "), tone: "bad" });
  }
  return patterns;
}

// ---------- todo junto, para un periodo ----------

export function buildAnalytics(
  media: IgMediaWithItem[],
  snapshots: FollowerSnapshot[],
  periodDays: number,
  now = Date.now()
): Analytics {
  const fromMs = now - periodDays * DAY;
  const prevFromMs = fromMs - periodDays * DAY;
  const inPeriod = (iso: string) => new Date(iso).getTime() >= fromMs;
  const inPrevious = (iso: string) => {
    const t = new Date(iso).getTime();
    return t >= prevFromMs && t < fromMs;
  };

  const scored = classifyPosts(media, now);
  const posts = scored.filter((p) => inPeriod(p.timestamp)).sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  const withReach = posts.filter((p) => p.reach);
  const prevPosts = scored.filter((p) => inPrevious(p.timestamp) && p.reach);

  const summarize = (list: ScoredPost[]) => {
    const rates = list.filter((p) => p.engagementRate !== null).map((p) => p.engagementRate!);
    return {
      engagementRate: mean(rates),
      interactions: sum(list.map((p) => p.interactions)),
      avgReach: list.length ? sum(list.map((p) => p.reach)) / list.length : null,
      views: sum(list.map((p) => p.views)),
    };
  };
  const cur = summarize(withReach);
  const prev = summarize(prevPosts);

  // Series diarias: cada publicación cuenta el día que se publicó (igual
  // que Metricool), no el día en que se generó cada visualización.
  const days = dayRange(fromMs, now);
  const daily = (pick: (p: ScoredPost) => number | null, list: ScoredPost[] = posts): DailyPoint[] =>
    days.map((date) => {
      const ofDay = list.filter((p) => madridDate(p.timestamp) === date);
      if (ofDay.length === 0) return { date, value: null };
      return { date, value: sum(ofDay.map(pick)) };
    });

  // Seguidores
  const snaps = [...snapshots].sort((a, b) => a.date.localeCompare(b.date));
  const fromDate = madridDate(new Date(fromMs));
  const periodSnaps = snaps.filter((s) => s.date >= fromDate);
  const beforePeriod = [...snaps].reverse().find((s) => s.date < fromDate);
  const first = beforePeriod ?? periodSnaps[0];
  const last = snaps[snaps.length - 1];
  const bySnapDate = new Map(snaps.map((s) => [s.date, s.followers]));

  // Por formato
  const byFormat: FormatStat[] = ["REEL", "CARRUSEL", "POST"]
    .map((format) => {
      const list = withReach.filter((p) => p.format === format);
      const scoredList = list.filter((p) => p.score !== null);
      return {
        format,
        label: format === "REEL" ? "Reel" : FORMAT_LABELS[format],
        count: list.length,
        avgReach: list.length ? sum(list.map((p) => p.reach)) / list.length : null,
        avgEngagement: mean(list.filter((p) => p.engagementRate !== null).map((p) => p.engagementRate!)),
        avgScore: mean(scoredList.map((p) => p.score!)),
      };
    })
    .filter((f) => f.count > 0);

  // Hashtags
  const tagMap = new Map<string, ScoredPost[]>();
  for (const p of posts) for (const tag of hashtagsOf(p.caption)) tagMap.set(tag, [...(tagMap.get(tag) ?? []), p]);
  const hashtags: HashtagStat[] = [...tagMap.entries()]
    .map(([tag, list]) => ({
      tag,
      posts: list.length,
      avgReach: sum(list.map((p) => p.reach)) / list.length,
      avgViews: sum(list.map((p) => p.views)) / list.length,
      totalInteractions: sum(list.map((p) => p.interactions)),
      avgScore: mean(list.filter((p) => p.score !== null).map((p) => p.score!)),
    }))
    .sort((a, b) => b.avgReach - a.avgReach);

  // Historias
  const storyMedia = media
    .filter((m) => m.productType === "STORY" && inPeriod(m.timestamp))
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  const storyRows: StoryRow[] = storyMedia.map((m) => ({
    id: m.id,
    timestamp: m.timestamp,
    thumbnailUrl: m.thumbnailUrl,
    permalink: m.permalink,
    reach: m.reach,
    views: m.views,
    replies: m.replies,
    shares: m.shares,
    navigation: m.navigation,
    profileVisits: m.profileVisits,
    follows: m.follows,
  }));
  const storiesWithReach = storyRows.filter((s) => s.reach !== null);

  const works = posts.filter((p) => p.verdict === "WORKS").sort((a, b) => b.score! - a.score!);
  const fails = posts.filter((p) => p.verdict === "FAILS").sort((a, b) => a.score! - b.score!);
  const baselineScored = scored.filter(
    (p) => p.score !== null && now - new Date(p.timestamp).getTime() <= BASELINE_DAYS * DAY
  );

  const likes = sum(posts.map((p) => p.likes));
  const comments = sum(posts.map((p) => p.comments));
  const saves = sum(posts.map((p) => p.saves));
  const shares = sum(posts.map((p) => p.shares));

  return {
    periodDays,
    from: fromDate,
    to: madridDate(new Date(now)),
    summary: {
      posts: posts.length,
      engagementRate: cur.engagementRate,
      interactions: cur.interactions,
      avgReach: cur.avgReach,
      views: cur.views,
      likes,
      comments,
      saves,
      shares,
      likesPerDay: likes / periodDays,
      likesPerPost: posts.length ? likes / posts.length : null,
      commentsPerPost: posts.length ? comments / posts.length : null,
      savesSharesPerPost: posts.length ? (saves + shares) / posts.length : null,
    },
    previous: { ...prev, posts: prevPosts.length },
    daily: {
      reach: daily((p) => p.reach),
      views: daily((p) => p.views),
      interactions: daily((p) => p.interactions),
      posts: days.map((date) => ({ date, value: posts.filter((p) => madridDate(p.timestamp) === date).length })),
    },
    followers: {
      current: last?.followers ?? null,
      gained: last && first && last !== first ? last.followers - first.followers : null,
      series: days.map((date) => ({ date, value: bySnapDate.get(date) ?? null })),
      gainedFromPosts: sum(media.filter((m) => inPeriod(m.timestamp)).map((m) => m.follows)),
    },
    posts,
    works,
    fails,
    patterns: detectPatterns(baselineScored),
    byFormat,
    hashtags,
    stories: {
      count: storyRows.length,
      views: sum(storyRows.map((s) => s.views)),
      avgReach: storiesWithReach.length ? sum(storiesWithReach.map((s) => s.reach)) / storiesWithReach.length : null,
      replies: sum(storyRows.map((s) => s.replies)),
      profileVisits: sum(storyRows.map((s) => s.profileVisits)),
      rows: storyRows,
      dailyCount: days.map((date) => ({ date, value: storyRows.filter((s) => madridDate(s.timestamp) === date).length })),
      dailyViews: days.map((date) => {
        const ofDay = storyRows.filter((s) => madridDate(s.timestamp) === date);
        return { date, value: ofDay.length ? sum(ofDay.map((s) => s.views)) : null };
      }),
    },
    verdictReady: baselineScored.length >= MIN_POSTS_FOR_VERDICT,
  };
}

// ---------- contexto para la IA ----------

function postLine(p: ScoredPost): string {
  const date = madridDate(p.timestamp);
  const metrics = [
    p.reach !== null ? `alcance ${p.reach}` : null,
    p.views !== null ? `visualizaciones ${p.views}` : null,
    `interacción ${pct(p.engagementRate)}`,
    p.saves !== null ? `guardados ${p.saves}` : null,
    p.shares !== null ? `compartidos ${p.shares}` : null,
    p.comments !== null ? `comentarios ${p.comments}` : null,
  ]
    .filter(Boolean)
    .join(", ");
  const hook = p.caption.split("\n").find((l) => l.trim())?.trim().slice(0, 140) ?? "";
  return `- ${date} · ${p.formatLabel}${p.family ? ` · línea "${p.family}"` : ""} · "${p.title}"\n  Arranque del texto: "${hook}"\n  ${metrics}${p.reasons.length ? `\n  Por qué: ${p.reasons.join("; ")}` : ""}`;
}

/**
 * Resumen en texto de qué funciona y qué no, para el prompt del plan.
 * Usa los últimos 90 días para tener muestra suficiente.
 */
export function buildAiPerformanceContext(media: IgMediaWithItem[], snapshots: FollowerSnapshot[]): string | null {
  const a = buildAnalytics(media, snapshots, BASELINE_DAYS);
  if (!a.verdictReady) return null;

  const works = a.works.slice(0, 6);
  const fails = a.fails.slice(0, 6);
  const formatLines = a.byFormat.map(
    (f) =>
      `- ${f.label}: ${f.count} publicaciones, alcance medio ${Math.round(f.avgReach ?? 0)}, interacción media ${pct(f.avgEngagement)}`
  );

  return `ANÁLISIS DE RENDIMIENTO REAL DE LA CUENTA (Instagram, últimos ${BASELINE_DAYS} días, ${a.summary.posts} publicaciones de feed)
Cada publicación se ha comparado con la media de la propia cuenta y de su mismo formato.

Media de la cuenta: interacción ${pct(a.summary.engagementRate)}, alcance medio por publicación ${Math.round(a.summary.avgReach ?? 0)}.
Seguidores: ${a.followers.current ?? "sin dato"}${a.followers.gained !== null ? ` (${a.followers.gained >= 0 ? "+" : ""}${a.followers.gained} en el periodo)` : ""}.

Por formato:
${formatLines.join("\n") || "- sin datos suficientes"}

PUBLICACIONES QUE SÍ FUNCIONAN (repite el ángulo, el tipo de hook y el formato; escala lo que funcionó):
${works.map(postLine).join("\n") || "- ninguna destaca claramente por encima de la media"}

PUBLICACIONES QUE NO FUNCIONAN (no repitas ese ángulo o enfoque tal cual; si el tema es importante, cámbiale el formato o el hook):
${fails.map(postLine).join("\n") || "- ninguna queda claramente por debajo de la media"}

PATRONES DETECTADOS:
${a.patterns.map((p) => `- ${p.label}: ${p.detail}`).join("\n") || "- no hay diferencias claras todavía entre días, horas o formatos"}

Historias: ${a.stories.count} en el periodo, alcance medio ${Math.round(a.stories.avgReach ?? 0)} por historia, ${a.stories.replies} respuestas.

CÓMO USAR ESTO: el plan nuevo tiene que notarse construido sobre estos datos. Prioriza los formatos,
líneas editoriales, franjas horarias y tipos de hook de lo que SÍ funciona; evita repetir lo que NO
funciona tal cual. En "trendsSummary" explica en 1-2 frases qué has cambiado respecto a lo anterior por
estos datos (con cifras).`;
}
