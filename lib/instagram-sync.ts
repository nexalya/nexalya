/**
 * Sincronización automática con Instagram (al estilo Metricool).
 *
 * En vez de depender de que alguien vincule cada pieza y pulse "↻", esto:
 *   1. Importa lo que se ha publicado de verdad en la cuenta (posts,
 *      carruseles, reels y las historias activas) a la tabla ig_media.
 *   2. Lo empareja solo con la pieza del calendario que corresponde
 *      (mismo formato, fecha cercana y texto parecido; las historias, con
 *      la ficha de Historias de ese día).
 *   3. Trae las métricas de cada publicación y las copia también a la
 *      pieza del calendario, para que el resto de la app (análisis,
 *      calendario) las vea sin cambios.
 *   4. Registra los seguidores del día y renueva el token cada semana.
 *
 * Lo lanza cada hora /api/cron/instagram-sync (programado desde
 * netlify/functions/instagram-sync.mts) y también el botón "Sincronizar
 * ahora" de la pestaña Métricas. Las historias solo dan métricas mientras
 * siguen activas (24 h), por eso hace falta pasar cada hora y no una vez
 * al día.
 */

import {
  getFullMediaInsights,
  getFollowerCount,
  getProfile,
  listActiveStories,
  listRecentMedia,
  refreshLongLivedToken,
  type IgMediaEntry,
} from "@/lib/graph";
import {
  listConnectedClients,
  listContentItems,
  listIgMedia,
  deleteIgMedia,
  setClientSyncState,
  setIgMediaLink,
  updateContentItem,
  updateIgMediaMetrics,
  upsertFollowerSnapshotForDate,
  upsertIgMedia,
  type Client,
  type ContentItem,
  type IgMedia,
} from "@/lib/db-turso";
import { getFormatKey } from "@/components/ContentFormatIcons";

const HOUR = 3600_000;
const DAY = 24 * HOUR;
const TIME_ZONE = "Europe/Madrid";
// Margen entre la fecha del calendario y la real: el equipo a veces
// publica un día antes o después de lo previsto.
const MATCH_WINDOW_DAYS = 4;
const TOKEN_REFRESH_EVERY = 7 * DAY;
const MAX_INSIGHTS_PER_RUN = 35;

export type ClientSyncResult = {
  clientId: string;
  clientName: string;
  ok: boolean;
  imported: number;
  metricsUpdated: number;
  linked: number;
  followers: number | null;
  error?: string;
};

function madridDay(iso: string | Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE }).format(new Date(iso));
}

function normalizeWords(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9ñ\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length >= 4)
  );
}

// Proporción de palabras en común sobre el texto más corto: el caption de
// Instagram suele ser más largo (hashtags, CTA) que el del calendario.
function textSimilarity(a: string, b: string): number {
  const wa = normalizeWords(a);
  const wb = normalizeWords(b);
  const smaller = Math.min(wa.size, wb.size);
  if (smaller < 3) return 0;
  let common = 0;
  for (const w of wa) if (wb.has(w)) common++;
  return common / smaller;
}

// 1 = el formato encaja seguro, 0.5 = encaja pero podría ser otro (un
// carrusel planificado que al final se subió como foto suelta), 0 = no.
function formatFit(media: IgMedia, item: ContentItem): number {
  const format = getFormatKey(item);
  if (media.productType === "STORY") return format === "STORY" ? 1 : 0;
  if (format === "STORY") return 0;
  if (media.productType === "REELS" || media.mediaType === "VIDEO") return format === "REEL" ? 1 : 0;
  if (media.mediaType === "CAROUSEL_ALBUM") return format === "CARRUSEL" ? 1 : format === "POST" ? 0.5 : 0;
  return format === "POST" ? 1 : format === "CARRUSEL" ? 0.5 : 0;
}

/**
 * Empareja las publicaciones reales todavía sin vincular con piezas del
 * calendario. Devuelve los vínculos nuevos (mediaId → contentItemId).
 * Las historias pueden compartir pieza (una ficha de Historias del día
 * agrupa varios frames); el resto, una publicación por pieza.
 */
export function matchMediaToItems(media: IgMedia[], items: ContentItem[]): Map<string, string> {
  const result = new Map<string, string>();
  const takenItems = new Set(
    media.filter((m) => m.contentItemId && m.productType !== "STORY").map((m) => m.contentItemId!)
  );
  // Piezas que ya apuntan a otra publicación real por su remoteId.
  const mediaIds = new Set(media.map((m) => m.id));
  for (const item of items) {
    if (item.remoteId && !item.remoteId.startsWith("mock_") && mediaIds.has(item.remoteId)) {
      takenItems.add(item.id);
    }
  }

  const pending = media.filter((m) => !m.contentItemId && !m.linkLocked);

  // Historias: a la ficha de Historias del mismo día (la de hora más
  // cercana si hay varias).
  for (const m of pending.filter((p) => p.productType === "STORY")) {
    const day = madridDay(m.timestamp);
    const candidates = items.filter((i) => getFormatKey(i) === "STORY" && madridDay(i.scheduledAt) === day);
    if (candidates.length === 0) continue;
    const t = new Date(m.timestamp).getTime();
    candidates.sort(
      (a, b) => Math.abs(new Date(a.scheduledAt).getTime() - t) - Math.abs(new Date(b.scheduledAt).getTime() - t)
    );
    result.set(m.id, candidates[0].id);
  }

  // Feed y reels: se puntúan todas las parejas posibles y se asignan de
  // mejor a peor, sin repetir pieza ni publicación.
  type Pair = { mediaId: string; itemId: string; score: number };
  const pairs: Pair[] = [];
  for (const m of pending.filter((p) => p.productType !== "STORY")) {
    const t = new Date(m.timestamp).getTime();
    const sameDayStrong = items.filter(
      (i) => !takenItems.has(i.id) && formatFit(m, i) === 1 && madridDay(i.scheduledAt) === madridDay(m.timestamp)
    );
    for (const item of items) {
      if (takenItems.has(item.id)) continue;
      const fit = formatFit(m, item);
      if (fit === 0) continue;
      const deltaDays = Math.abs(new Date(item.scheduledAt).getTime() - t) / DAY;
      if (deltaDays > MATCH_WINDOW_DAYS) continue;

      const text = textSimilarity(m.caption ?? "", `${item.title} ${item.caption}`);
      const onlyOptionThatDay = sameDayStrong.length === 1 && sameDayStrong[0].id === item.id;
      // Sin texto parecido solo se acepta si es la única pieza de ese
      // formato planificada ese mismo día: evita vincular a ciegas.
      if (text < 0.35 && !onlyOptionThatDay) continue;

      const score = 0.6 * text + 0.25 * (1 - deltaDays / MATCH_WINDOW_DAYS) + 0.15 * fit + (onlyOptionThatDay ? 0.1 : 0);
      pairs.push({ mediaId: m.id, itemId: item.id, score });
    }
  }
  pairs.sort((a, b) => b.score - a.score);
  const usedMedia = new Set<string>();
  for (const p of pairs) {
    if (usedMedia.has(p.mediaId) || takenItems.has(p.itemId)) continue;
    result.set(p.mediaId, p.itemId);
    usedMedia.add(p.mediaId);
    takenItems.add(p.itemId);
  }
  return result;
}

// Cada cuánto vuelve a pedir métricas según la antigüedad: casi todo el
// alcance llega en los primeros días, así que al principio cada hora y
// luego menos para no gastar llamadas a la API.
function needsMetrics(m: IgMedia, activeStoryIds: Set<string>, now: number): boolean {
  if (m.productType === "STORY") return activeStoryIds.has(m.id);
  const age = now - new Date(m.timestamp).getTime();
  const last = m.metricsUpdatedAt ? now - new Date(m.metricsUpdatedAt).getTime() : Infinity;
  if (age <= 3 * DAY) return last >= 50 * 60_000;
  if (age <= 30 * DAY) return last >= 12 * HOUR;
  return m.metricsUpdatedAt === null;
}

async function mapWithLimit<T, R>(list: T[], limit: number, fn: (x: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(list.length);
  let next = 0;
  async function worker() {
    while (next < list.length) {
      const i = next++;
      out[i] = await fn(list[i]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, list.length) }, worker));
  return out;
}

function sumOrNull(values: (number | null)[]): number | null {
  const present = values.filter((v): v is number => v !== null);
  return present.length ? present.reduce((a, b) => a + b, 0) : null;
}

/**
 * Copia las métricas de las publicaciones reales a su pieza del
 * calendario. Si una ficha de Historias agrupa varios frames, se suman
 * (el alcance se toma del frame que más llegó, para no contar dos veces a
 * la misma persona).
 */
async function writeBackToContentItems(media: IgMedia[], items: ContentItem[]) {
  const byItem = new Map<string, IgMedia[]>();
  for (const m of media) {
    if (!m.contentItemId) continue;
    byItem.set(m.contentItemId, [...(byItem.get(m.contentItemId) ?? []), m]);
  }
  for (const [itemId, linked] of byItem) {
    const item = items.find((i) => i.id === itemId);
    if (!item) continue;
    const withMetrics = linked.filter((m) => m.metricsUpdatedAt);
    const earliest = [...linked].sort((a, b) => a.timestamp.localeCompare(b.timestamp))[0];
    const reachValues = withMetrics.map((m) => m.reach).filter((v): v is number => v !== null);
    const hasRealRemote = !!item.remoteId && !item.remoteId.startsWith("mock_");
    await updateContentItem(itemId, {
      status: "PUBLISHED",
      publishedAt: item.publishedAt ?? earliest.timestamp,
      errorMessage: null,
      remoteId: hasRealRemote ? item.remoteId : earliest.id,
      ...(withMetrics.length > 0 && {
        reach: reachValues.length ? Math.max(...reachValues) : null,
        likes: sumOrNull(withMetrics.map((m) => m.likes)),
        comments: sumOrNull(withMetrics.map((m) => m.comments ?? m.replies)),
        saves: sumOrNull(withMetrics.map((m) => m.saves)),
        shares: sumOrNull(withMetrics.map((m) => m.shares)),
        profileVisits: sumOrNull(withMetrics.map((m) => m.profileVisits)),
        followersGained: sumOrNull(withMetrics.map((m) => m.follows)),
        metricsUpdatedAt: withMetrics.map((m) => m.metricsUpdatedAt!).sort().at(-1)!,
      }),
    });
  }
}

function toMediaRow(clientId: string, entry: IgMediaEntry) {
  return {
    id: entry.id,
    clientId,
    mediaType: entry.media_type ?? null,
    productType: entry.media_product_type ?? null,
    caption: entry.caption ?? null,
    permalink: entry.permalink ?? null,
    // Los vídeos traen miniatura aparte; las imágenes se ven con media_url.
    thumbnailUrl: entry.thumbnail_url ?? (entry.media_type === "IMAGE" ? entry.media_url ?? null : null),
    timestamp: new Date(entry.timestamp).toISOString(),
  };
}

export async function syncClient(client: Client): Promise<ClientSyncResult> {
  const result: ClientSyncResult = {
    clientId: client.id,
    clientName: client.name,
    ok: false,
    imported: 0,
    metricsUpdated: 0,
    linked: 0,
    followers: null,
  };
  if (!client.accessToken || !client.igUserId) {
    return { ...result, error: "Este cliente no tiene Instagram conectado." };
  }

  let token = client.accessToken;
  const igUserId = client.igUserId;
  const now = Date.now();

  try {
    // 0) Renovar el token antes de que caduque (no bloquea si falla: el
    //    token actual puede seguir valiendo semanas).
    if (!client.tokenRefreshedAt || now - new Date(client.tokenRefreshedAt).getTime() > TOKEN_REFRESH_EVERY) {
      try {
        token = await refreshLongLivedToken(token);
        await setClientSyncState(client.id, { accessToken: token, tokenRefreshedAt: new Date().toISOString() });
      } catch {
        token = client.accessToken;
      }
    }

    // 1) Importar lo publicado.
    const [feed, stories] = await Promise.all([
      listRecentMedia(igUserId, token),
      listActiveStories(igUserId, token).catch(() => [] as IgMediaEntry[]),
    ]);
    const known = new Set((await listIgMedia(client.id)).map((m) => m.id));
    for (const entry of [...feed, ...stories]) {
      const isNew = !known.has(entry.id);
      if (isNew) result.imported++;
      // Las ya conocidas solo se refrescan la primera semana (por si se
      // edita el texto): así cada pasada no reescribe 90 días enteros.
      if (isNew || now - new Date(entry.timestamp).getTime() <= 7 * DAY) {
        await upsertIgMedia(toMediaRow(client.id, entry));
      }
    }
    const activeStoryIds = new Set(stories.map((s) => s.id));

    // Lo que ya no sale en la cuenta dentro del periodo que cubre el
    // listado se ha borrado o archivado en Instagram: fuera de Nexalya.
    // (Las historias no: desaparecen solas a las 24 h y se conservan.)
    if (feed.length > 0) {
      const feedIds = new Set(feed.map((f) => f.id));
      const oldestListed = feed.map((f) => new Date(f.timestamp).getTime()).reduce((a, b) => Math.min(a, b));
      const gone = (await listIgMedia(client.id)).filter(
        (m) => m.productType !== "STORY" && !feedIds.has(m.id) && new Date(m.timestamp).getTime() >= oldestListed
      );
      if (gone.length) await deleteIgMedia(gone.map((m) => m.id));
    }

    // 2) Emparejar con el calendario.
    let media: IgMedia[] = await listIgMedia(client.id);
    const items = await listContentItems({ clientId: client.id });
    const mediaIds = new Set(media.map((m) => m.id));
    // Vínculos que el equipo ya hizo a mano pegando el enlace (remoteId).
    for (const item of items) {
      if (!item.remoteId || !mediaIds.has(item.remoteId)) continue;
      const m = media.find((x) => x.id === item.remoteId)!;
      if (!m.contentItemId && !m.linkLocked) {
        await setIgMediaLink(m.id, item.id, false);
        m.contentItemId = item.id;
      }
    }
    const newLinks = matchMediaToItems(media, items);
    for (const [mediaId, itemId] of newLinks) {
      await setIgMediaLink(mediaId, itemId, false);
      result.linked++;
    }

    // 3) Métricas.
    media = await listIgMedia(client.id);
    // Tope por pasada para no pasarse del tiempo máximo de la función en
    // la primera sincronización (90 días de golpe): primero historias y
    // lo más reciente; lo que no quepa se completa en la hora siguiente.
    const due = media
      .filter((m) => needsMetrics(m, activeStoryIds, now))
      .sort((a, b) => Number(b.productType === "STORY") - Number(a.productType === "STORY") || b.timestamp.localeCompare(a.timestamp))
      .slice(0, MAX_INSIGHTS_PER_RUN);
    const updated = await mapWithLimit(due, 5, async (m) => {
      try {
        const insights = await getFullMediaInsights(m.id, m.productType ?? "FEED", token);
        await updateIgMediaMetrics(m.id, insights);
        return true;
      } catch {
        // Una historia que acaba de caducar o un post borrado no deben
        // tumbar el resto de la sincronización.
        return false;
      }
    });
    result.metricsUpdated = updated.filter(Boolean).length;

    media = await listIgMedia(client.id);
    await writeBackToContentItems(media, items);

    // 4) @usuario y foto de perfil (la URL de la foto caduca a los pocos
    //    días, por eso se refresca en cada pasada).
    try {
      const profile = await getProfile(igUserId, token);
      if (profile.username) {
        await setClientSyncState(client.id, {
          igHandle: `@${profile.username}`,
          igProfilePictureUrl: profile.profilePictureUrl,
        });
      }
    } catch {
      // No es imprescindible.
    }

    // 5) Seguidores del día.
    try {
      const followers = await getFollowerCount(igUserId, token);
      await upsertFollowerSnapshotForDate(client.id, madridDay(new Date()), followers, "Sincronizado automáticamente");
      result.followers = followers;
    } catch {
      // Si falla solo esto, el resto de datos ya está guardado.
    }

    await setClientSyncState(client.id, { lastSyncAt: new Date().toISOString(), lastSyncError: null });
    return { ...result, ok: true };
  } catch (err) {
    const message = (err as Error).message;
    await setClientSyncState(client.id, { lastSyncAt: new Date().toISOString(), lastSyncError: message });
    return { ...result, error: message };
  }
}

export async function syncAllClients(): Promise<ClientSyncResult[]> {
  const clients = await listConnectedClients();
  return Promise.all(clients.map((client) => syncClient(client)));
}
