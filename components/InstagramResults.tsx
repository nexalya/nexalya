"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { IgMediaWithItem } from "@/lib/db-turso";
import { FORMAT_ICONS, FORMAT_LABELS, PostIcon, dayLabel, timeLabel, igFormatKey, igTitle } from "@/components/ContentFormatIcons";
import type { ScoredPost, StoryRow, Verdict } from "@/lib/analytics";

// Piezas interactivas de la analítica de Instagram (pestaña Métricas de
// clientes conectados): estado de la sincronización automática, tabla de
// publicaciones con su veredicto, tabla de historias y la ficha de detalle
// de cada publicación. Todo sale de lo publicado DE VERDAD en la cuenta
// (importado cada hora por lib/instagram-sync.ts); si el emparejamiento
// automático con la pieza del calendario se equivoca, se corrige en la
// ficha.

export type CalendarOption = { id: string; title: string; scheduledAt: string; format: string };

type MetricKey =
  | "reach"
  | "views"
  | "likes"
  | "comments"
  | "saves"
  | "shares"
  | "interactions"
  | "follows"
  | "profileVisits"
  | "replies"
  | "navigation";

const METRIC_LABELS: Record<MetricKey, string> = {
  reach: "Alcance",
  views: "Visualizaciones",
  likes: "Likes",
  comments: "Comentarios",
  saves: "Guardados",
  shares: "Compartidos",
  interactions: "Interacciones",
  follows: "Seguidores ganados",
  profileVisits: "Visitas al perfil",
  replies: "Respuestas",
  navigation: "Navegación",
};

// Mismas métricas que pide lib/graph.ts para cada tipo de publicación.
const METRICS_BY_FORMAT: Record<string, MetricKey[]> = {
  REEL: ["reach", "views", "likes", "comments", "saves", "shares", "interactions"],
  POST: ["reach", "views", "likes", "comments", "saves", "shares", "interactions", "follows", "profileVisits"],
  CARRUSEL: ["reach", "views", "likes", "comments", "saves", "shares", "interactions", "follows", "profileVisits"],
  STORY: ["reach", "views", "replies", "shares", "interactions", "follows", "profileVisits", "navigation"],
};

function relativeTime(iso: string | null): string {
  if (!iso) return "nunca";
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutes < 1) return "ahora mismo";
  if (minutes < 60) return `hace ${minutes} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `hace ${hours} h`;
  const days = Math.round(hours / 24);
  return `hace ${days} día${days === 1 ? "" : "s"}`;
}

// ---------- estado de la sincronización ----------

export function SyncStatusBar({
  clientId,
  lastSyncAt,
  lastSyncError,
}: {
  clientId: string;
  lastSyncAt: string | null;
  lastSyncError: string | null;
}) {
  const router = useRouter();
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSync() {
    setSyncing(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch(`/api/clients/${clientId}/instagram-sync`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo sincronizar.");
      setMessage(
        `${data.imported} nueva${data.imported === 1 ? "" : "s"} · ${data.metricsUpdated} con métricas actualizadas · ${data.linked} vinculada${data.linked === 1 ? "" : "s"} al calendario`
      );
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3 text-xs">
      <span className="flex items-center gap-1.5 text-slate-500">
        <span className={`inline-block h-2 w-2 rounded-full ${lastSyncError ? "bg-amber-500" : "bg-emerald-500"}`} />
        Sincronizado con Instagram {relativeTime(lastSyncAt)} · se actualiza solo cada hora
      </span>
      <button onClick={handleSync} disabled={syncing} className="btn-secondary text-xs px-3 py-1.5">
        {syncing ? "Sincronizando…" : "↻ Sincronizar ahora"}
      </button>
      {lastSyncError && !message && <span className="text-amber-700">Último intento con error: {lastSyncError}</span>}
      {message && <span className="text-emerald-700">{message}</span>}
      {error && <span className="text-red-600">{error}</span>}
    </div>
  );
}

// ---------- veredicto ----------

const VERDICT_STYLE: Record<Verdict, { label: string; icon: string; className: string }> = {
  WORKS: { label: "Funciona", icon: "✓", className: "bg-emerald-50 text-emerald-800 border-emerald-200" },
  FAILS: { label: "No funciona", icon: "✕", className: "bg-red-50 text-red-800 border-red-200" },
  AVERAGE: { label: "En la media", icon: "=", className: "bg-slate-50 text-slate-600 border-slate-200" },
  MATURING: { label: "Madurando", icon: "◷", className: "bg-slate-50 text-slate-500 border-slate-200" },
  NO_DATA: { label: "Sin datos", icon: "–", className: "bg-slate-50 text-slate-400 border-slate-200" },
};

export function VerdictBadge({ verdict }: { verdict: Verdict }) {
  const v = VERDICT_STYLE[verdict];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium whitespace-nowrap ${v.className}`}>
      <span aria-hidden>{v.icon}</span>
      {v.label}
    </span>
  );
}

export function Thumb({ url, formatKey, size = 40 }: { url: string | null; formatKey: string; size?: number }) {
  const [broken, setBroken] = useState(false);
  const Icon = FORMAT_ICONS[formatKey] ?? PostIcon;
  if (!url || broken) {
    return (
      <span className="flex items-center justify-center rounded-md bg-slate-100 text-slate-400 flex-shrink-0" style={{ width: size, height: size }}>
        <Icon />
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={url} alt="" onError={() => setBroken(true)} className="rounded-md object-cover flex-shrink-0 bg-slate-100" style={{ width: size, height: size }} />
  );
}

// ---------- ficha de una publicación en ventana ----------

function DetailModal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 p-0 sm:p-6" onClick={onClose}>
      <div
        className="bg-white w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl shadow-xl p-5"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex justify-end -mt-1 -mr-1 mb-1">
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-sm px-2" aria-label="Cerrar">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ---------- tabla de publicaciones ----------

type SortKey = "timestamp" | "reach" | "views" | "likes" | "comments" | "saves" | "shares" | "engagementRate" | "score";

const COLUMNS: { key: SortKey; label: string; render: (p: ScoredPost) => string }[] = [
  { key: "reach", label: "Alcance", render: (p) => num(p.reach) },
  { key: "views", label: "Visualiz.", render: (p) => num(p.views) },
  { key: "likes", label: "Me gusta", render: (p) => num(p.likes) },
  { key: "comments", label: "Coment.", render: (p) => num(p.comments) },
  { key: "saves", label: "Guardados", render: (p) => num(p.saves) },
  { key: "shares", label: "Compart.", render: (p) => num(p.shares) },
  {
    key: "engagementRate",
    label: "% Interac.",
    render: (p) => (p.engagementRate === null ? "—" : `${(p.engagementRate * 100).toLocaleString("es-ES", { maximumFractionDigits: 1 })}%`),
  },
];

function num(v: number | null): string {
  return v === null ? "—" : v.toLocaleString("es-ES");
}

const TABLE_FILTERS = [
  { key: "ALL", label: "Todo" },
  { key: "REEL", label: "Reels" },
  { key: "CARRUSEL", label: "Carruseles" },
  { key: "POST", label: "Posts" },
];

export function PostsTable({
  posts,
  media,
  calendarOptions,
}: {
  posts: ScoredPost[];
  media: IgMediaWithItem[];
  calendarOptions: CalendarOption[];
}) {
  const [filter, setFilter] = useState("ALL");
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: "timestamp", dir: -1 });
  const [openId, setOpenId] = useState<string | null>(null);

  const rows = (filter === "ALL" ? posts : posts.filter((p) => p.format === filter)).slice().sort((a, b) => {
    const av = a[sort.key];
    const bv = b[sort.key];
    if (av === bv) return 0;
    if (av === null) return 1;
    if (bv === null) return -1;
    return (av < bv ? -1 : 1) * sort.dir;
  });
  const opened = media.find((m) => m.id === openId);

  function toggleSort(key: SortKey) {
    setSort((s) => (s.key === key ? { key, dir: s.dir === 1 ? -1 : 1 } : { key, dir: -1 }));
  }
  const arrow = (key: SortKey) => (sort.key === key ? (sort.dir === -1 ? " ↓" : " ↑") : "");

  return (
    <div className="card">
      <div className="flex flex-wrap gap-1.5 p-3 border-b border-slate-100">
        {TABLE_FILTERS.map((f) => {
          const count = f.key === "ALL" ? posts.length : posts.filter((p) => p.format === f.key).length;
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                filter === f.key ? "bg-brand-600 border-brand-600 text-white" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {f.label} <span className="opacity-70">{count}</span>
            </button>
          );
        })}
      </div>
      {rows.length === 0 ? (
        <div className="p-8 text-center text-sm text-slate-500">No hay publicaciones de este tipo en el periodo.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs text-slate-500">
              <tr>
                <th className="p-2 pl-3 font-medium">Publicación</th>
                <th className="p-2 font-medium cursor-pointer whitespace-nowrap" onClick={() => toggleSort("timestamp")}>
                  Fecha{arrow("timestamp")}
                </th>
                {COLUMNS.map((c) => (
                  <th key={c.key} className="p-2 font-medium text-right cursor-pointer whitespace-nowrap" onClick={() => toggleSort(c.key)}>
                    {c.label}
                    {arrow(c.key)}
                  </th>
                ))}
                <th className="p-2 pr-3 font-medium cursor-pointer whitespace-nowrap" onClick={() => toggleSort("score")}>
                  Resultado{arrow("score")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => setOpenId(p.id)}>
                  <td className="p-2 pl-3">
                    <span className="flex items-center gap-2.5 min-w-[220px] max-w-[320px]">
                      <Thumb url={p.thumbnailUrl} formatKey={p.format} />
                      <span className="min-w-0">
                        <span className="block truncate text-slate-800">{p.title}</span>
                        <span className="text-[11px] text-slate-400">{p.formatLabel}</span>
                      </span>
                    </span>
                  </td>
                  <td className="p-2 text-slate-500 whitespace-nowrap">
                    {dayLabel(p.timestamp)} · {timeLabel(p.timestamp)}
                  </td>
                  {COLUMNS.map((c) => (
                    <td key={c.key} className="p-2 text-right tabular-nums text-slate-700">
                      {c.render(p)}
                    </td>
                  ))}
                  <td className="p-2 pr-3">
                    <VerdictBadge verdict={p.verdict} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <DetailModal open={!!opened} onClose={() => setOpenId(null)}>
        {opened && <IgMediaDetail key={opened.id} media={opened} calendarOptions={calendarOptions} scored={posts.find((p) => p.id === opened.id)} />}
      </DetailModal>
    </div>
  );
}

// ---------- tabla de historias ----------

export function StoriesTable({ rows, media, calendarOptions }: { rows: StoryRow[]; media: IgMediaWithItem[]; calendarOptions: CalendarOption[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const opened = media.find((m) => m.id === openId);
  const visible = showAll ? rows : rows.slice(0, 10);
  return (
    <div className="card">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs text-slate-500">
            <tr>
              <th className="p-2 pl-3 font-medium">Historia</th>
              <th className="p-2 font-medium text-right">Alcance</th>
              <th className="p-2 font-medium text-right">Visualiz.</th>
              <th className="p-2 font-medium text-right">Respuestas</th>
              <th className="p-2 font-medium text-right">Compart.</th>
              <th className="p-2 font-medium text-right">Visitas perfil</th>
              <th className="p-2 pr-3 font-medium text-right">Navegación</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visible.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => setOpenId(s.id)}>
                <td className="p-2 pl-3">
                  <span className="flex items-center gap-2.5 whitespace-nowrap">
                    <Thumb url={s.thumbnailUrl} formatKey="STORY" size={32} />
                    <span className="text-slate-700">
                      {dayLabel(s.timestamp)} · {timeLabel(s.timestamp)}
                    </span>
                  </span>
                </td>
                <td className="p-2 text-right tabular-nums">{num(s.reach)}</td>
                <td className="p-2 text-right tabular-nums">{num(s.views)}</td>
                <td className="p-2 text-right tabular-nums">{num(s.replies)}</td>
                <td className="p-2 text-right tabular-nums">{num(s.shares)}</td>
                <td className="p-2 text-right tabular-nums">{num(s.profileVisits)}</td>
                <td className="p-2 pr-3 text-right tabular-nums">{num(s.navigation)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length > 10 && (
        <button onClick={() => setShowAll(!showAll)} className="w-full text-xs text-brand-600 py-2 border-t border-slate-100 hover:bg-slate-50">
          {showAll ? "Ver menos" : `Ver las ${rows.length} historias`}
        </button>
      )}
      <DetailModal open={!!opened} onClose={() => setOpenId(null)}>
        {opened && <IgMediaDetail key={opened.id} media={opened} calendarOptions={calendarOptions} />}
      </DetailModal>
    </div>
  );
}

export function IgMediaDetail({
  media,
  calendarOptions,
  scored,
}: {
  media: IgMediaWithItem;
  calendarOptions: CalendarOption[];
  scored?: ScoredPost;
}) {
  const router = useRouter();
  const formatKey = igFormatKey(media);
  const [linkValue, setLinkValue] = useState(media.contentItemId ?? "");
  const [savingLink, setSavingLink] = useState(false);
  const [linkError, setLinkError] = useState("");

  // Solo se ofrecen piezas de ±10 días alrededor de la publicación, del
  // mismo tipo (historias con historias, el resto con el resto), para que
  // la lista no sea interminable.
  const t = new Date(media.timestamp).getTime();
  const options = calendarOptions
    .filter((o) => Math.abs(new Date(o.scheduledAt).getTime() - t) <= 10 * 86400000)
    .filter((o) => (formatKey === "STORY") === (o.format === "STORY"))
    .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt));
  const current = calendarOptions.find((o) => o.id === media.contentItemId);
  if (current && !options.some((o) => o.id === current.id)) options.unshift(current);

  async function saveLink(value: string) {
    setLinkValue(value);
    setSavingLink(true);
    setLinkError("");
    try {
      const res = await fetch(`/api/ig-media/${media.id}/link`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentItemId: value || null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo guardar.");
      router.refresh();
    } catch (err) {
      setLinkError((err as Error).message);
      setLinkValue(media.contentItemId ?? "");
    } finally {
      setSavingLink(false);
    }
  }

  const metrics = METRICS_BY_FORMAT[formatKey] ?? METRICS_BY_FORMAT.POST;
  // Misma fórmula que la tabla y el análisis (lib/analytics.ts):
  // (me gusta + comentarios + guardados + compartidos) / alcance.
  const ownInteractions = (media.likes ?? 0) + (media.comments ?? 0) + (media.saves ?? 0) + (media.shares ?? 0);
  const engagement =
    media.reach && formatKey !== "STORY"
      ? `${((ownInteractions / media.reach) * 100).toLocaleString("es-ES", { maximumFractionDigits: 1 })}%`
      : null;

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 pb-3 border-b border-slate-100">
        {media.thumbnailUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={media.thumbnailUrl}
            alt=""
            className="h-16 w-16 rounded-lg object-cover flex-shrink-0 bg-slate-100"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        )}
        <div className="min-w-0 flex-1">
          <div className="font-medium text-slate-800">{igTitle(media)}</div>
          <div className="text-xs text-slate-400 mt-0.5">
            {FORMAT_LABELS[formatKey]} · {dayLabel(media.timestamp)} · {timeLabel(media.timestamp)}
            {media.permalink && (
              <>
                {" · "}
                <a href={media.permalink} target="_blank" rel="noreferrer" className="text-brand-600 hover:underline">
                  Ver en Instagram
                </a>
              </>
            )}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Métricas actualizadas {relativeTime(media.metricsUpdatedAt)}
            {formatKey === "STORY" && " · Instagram solo da datos de una historia mientras está activa (24 h)"}
          </div>
        </div>
      </div>

      {scored && scored.verdict !== "NO_DATA" && (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <VerdictBadge verdict={scored.verdict} />
            {scored.score !== null && (
              <span className="text-xs text-slate-500">
                {scored.score.toLocaleString("es-ES", { maximumFractionDigits: 2 })}× el rendimiento medio de la cuenta
              </span>
            )}
          </div>
          {scored.reasons.length > 0 && (
            <ul className="text-xs text-slate-600 list-disc pl-5 space-y-0.5">
              {scored.reasons.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {metrics.map((key) => (
          <div key={key} className="rounded-lg bg-slate-50 border border-slate-100 p-3">
            <div className="text-xs text-slate-500">{METRIC_LABELS[key]}</div>
            <div className="text-lg font-semibold text-slate-800 mt-0.5">
              {media[key] !== null ? media[key]!.toLocaleString("es-ES") : "—"}
            </div>
          </div>
        ))}
        {engagement && (
          <div className="rounded-lg bg-slate-50 border border-slate-100 p-3">
            <div className="text-xs text-slate-500">% Interacción</div>
            <div className="text-lg font-semibold text-slate-800 mt-0.5">{engagement}</div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-slate-50 border border-slate-100">
        <label className="text-xs font-medium text-slate-500">
          Pieza del calendario {media.linkLocked ? "(elegida a mano)" : media.contentItemId ? "(detectada automáticamente)" : ""}
        </label>
        <select
          className="input text-sm py-1.5"
          value={linkValue}
          disabled={savingLink}
          onChange={(e) => saveLink(e.target.value)}
        >
          <option value="">— Sin vincular —</option>
          {options.map((o) => (
            <option key={o.id} value={o.id}>
              {dayLabel(o.scheduledAt)} · {FORMAT_LABELS[o.format] ?? o.format} · {o.title}
            </option>
          ))}
        </select>
        {linkError && <p className="text-xs text-red-600">{linkError}</p>}
      </div>

      {media.caption && (
        <details className="text-sm text-slate-600">
          <summary className="cursor-pointer text-xs text-slate-500">Texto publicado</summary>
          <p className="whitespace-pre-line mt-2">{media.caption}</p>
        </details>
      )}
    </div>
  );
}
