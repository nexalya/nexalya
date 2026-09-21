"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ContentItemWithClient } from "@/lib/db-turso";
import { PLATFORM_LABELS, type Platform } from "@/lib/types";
import { FORMAT_ICONS, getFormatKey, dayLabel, timeLabel, PostIcon } from "@/components/ContentFormatIcons";

const FIELDS: { key: keyof ContentItemWithClient; label: string }[] = [
  { key: "reach", label: "Alcance" },
  { key: "likes", label: "Likes" },
  { key: "comments", label: "Comentarios" },
  { key: "saves", label: "Guardados" },
  { key: "shares", label: "Compartidos" },
  { key: "profileVisits", label: "Visitas perfil" },
  { key: "followersGained", label: "Seguidores ganados" },
];

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "short" }).format(new Date(iso));
}

export default function MetricsMasterDetail({ items }: { items: ContentItemWithClient[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(items[0]?.id ?? null);
  const selected = items.find((i) => i.id === selectedId) ?? items[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-4 items-start">
      <div className="card divide-y divide-slate-100 lg:max-h-[calc(100vh-260px)] lg:overflow-y-auto">
        {items.map((item) => {
          const formatKey = getFormatKey(item);
          const Icon = FORMAT_ICONS[formatKey] ?? PostIcon;
          const isSelected = item.id === selected?.id;
          const reach = item.reach as number | null | undefined;
          return (
            <button
              key={item.id}
              onClick={() => setSelectedId(item.id)}
              className={`w-full text-left p-3 flex items-start gap-2.5 transition-colors ${isSelected ? "bg-brand-50" : "hover:bg-slate-50"}`}
            >
              <span className={`flex-shrink-0 mt-0.5 ${isSelected ? "text-brand-600" : "text-slate-400"}`}>
                <Icon />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className={`text-xs font-medium ${isSelected ? "text-brand-700" : "text-slate-500"}`}>
                    {dayLabel(item.scheduledAt)} · {timeLabel(item.scheduledAt)}
                  </span>
                  <span className="text-[10px] text-slate-400 flex-shrink-0">
                    {PLATFORM_LABELS[item.platform as Platform] ?? item.platform}
                  </span>
                </span>
                <span className={`block text-sm truncate mt-0.5 ${isSelected ? "font-medium text-slate-800" : "text-slate-600"}`}>
                  {item.title}
                </span>
                <span className="text-[11px] text-slate-400">
                  {reach !== null && reach !== undefined ? `Alcance: ${reach.toLocaleString("es-ES")}` : "Sin datos todavía"}
                </span>
              </span>
            </button>
          );
        })}
      </div>
      <div className="card p-4">
        {selected ? (
          <MetricsDetailPanel key={selected.id} item={selected} />
        ) : (
          <div className="text-sm text-slate-400 p-4 text-center">Elige una publicación de la lista.</div>
        )}
      </div>
    </div>
  );
}

function MetricsDetailPanel({ item }: { item: ContentItemWithClient }) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(
      FIELDS.map((f) => [f.key, item[f.key] === null || item[f.key] === undefined ? "" : String(item[f.key])])
    )
  );
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linking, setLinking] = useState(false);
  const [linkError, setLinkError] = useState("");

  // Solo se puede sincronizar desde Instagram si el cliente tiene access
  // token conectado Y esta pieza se publicó de verdad (remoteId real, no
  // el "mock_..." que deja el publicador simulado).
  const hasRealRemoteId = !!item.remoteId && !item.remoteId.startsWith("mock_");
  const canSync = !!item.client?.accessToken && hasRealRemoteId;
  const canLink = !!item.client?.accessToken && !hasRealRemoteId;

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`/api/content/${item.id}/metrics`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("No se pudo guardar.");
      router.refresh();
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function handleLink() {
    if (!linkUrl.trim()) return;
    setLinking(true);
    setLinkError("");
    try {
      const res = await fetch(`/api/content/${item.id}/link-instagram`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: linkUrl.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo vincular la publicación.");
      setLinkUrl("");
      router.refresh();
    } catch (err) {
      setLinkError((err as Error).message);
    } finally {
      setLinking(false);
    }
  }

  async function handleSync() {
    setSyncing(true);
    setError("");
    try {
      const res = await fetch(`/api/content/${item.id}/metrics/sync`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo sincronizar.");
      setValues(
        Object.fromEntries(
          FIELDS.map((f) => [f.key, data[f.key] === null || data[f.key] === undefined ? "" : String(data[f.key])])
        )
      );
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="font-medium text-slate-800">{item.title}</div>
          <div className="text-xs text-slate-400 mt-0.5">{formatDate(item.scheduledAt)}</div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex gap-1.5">
            <button onClick={handleSave} disabled={saving} className="btn-secondary text-xs px-3 py-1.5">
              {saving ? "…" : "Guardar"}
            </button>
            {canSync && (
              <button
                onClick={handleSync}
                disabled={syncing}
                title="Traer estos datos directamente de Instagram"
                className="btn-secondary text-xs px-3 py-1.5"
              >
                {syncing ? "…" : "↻ Instagram"}
              </button>
            )}
          </div>
          {error && <p className="text-xs text-red-600 max-w-[220px] text-right">{error}</p>}
        </div>
      </div>

      {canLink && (
        <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-slate-50 border border-slate-100">
          <label className="text-xs font-medium text-slate-500">Vincular con la publicación real de Instagram</label>
          <div className="flex gap-1.5">
            <input
              type="text"
              placeholder="Enlace del post en IG"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="input text-xs py-1.5 px-2 flex-1"
            />
            <button
              onClick={handleLink}
              disabled={linking || !linkUrl.trim()}
              className="btn-secondary text-xs px-3 py-1.5 flex-shrink-0"
            >
              {linking ? "…" : "Vincular"}
            </button>
          </div>
          {linkError && <p className="text-xs text-red-600">{linkError}</p>}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {FIELDS.map((f) => (
          <div key={f.key}>
            <label className="text-xs text-slate-500">{f.label}</label>
            <input
              type="number"
              className="input text-sm py-1.5 mt-1 w-full"
              value={values[f.key]}
              onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
