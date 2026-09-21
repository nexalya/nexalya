"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ContentItemWithClient } from "@/lib/db-turso";

const FIELDS: { key: keyof ContentItemWithClient; label: string }[] = [
  { key: "reach", label: "Alcance" },
  { key: "likes", label: "Likes" },
  { key: "comments", label: "Comentarios" },
  { key: "saves", label: "Guardados" },
  { key: "shares", label: "Compartidos" },
  { key: "profileVisits", label: "Visitas perfil" },
  { key: "followersGained", label: "Seguidores ganados" },
];

export default function MetricsRow({ item }: { item: ContentItemWithClient }) {
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
  // El equipo publica a mano desde el móvil, así que la pieza empieza sin
  // remoteId real. Si el cliente ya tiene Instagram conectado, se puede
  // pegar aquí el enlace de la publicación para vincularla y que las
  // métricas se puedan traer solas (ver /api/content/[id]/link-instagram).
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
    <tr>
      <td className="p-3 align-top">
        <div className="font-medium">{item.title}</div>
        <div className="text-xs text-slate-400">
          {new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "short" }).format(new Date(item.scheduledAt))}
        </div>
      </td>
      {FIELDS.map((f) => (
        <td key={f.key} className="p-2 align-top">
          <input
            type="number"
            className="input text-sm py-1"
            value={values[f.key]}
            onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
          />
        </td>
      ))}
      <td className="p-2 align-top">
        <div className="flex flex-col gap-1 items-start">
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
          {error && <p className="text-xs text-red-600 max-w-[160px]">{error}</p>}
          {canLink && (
            <div className="flex flex-col gap-1 w-[180px]">
              <div className="flex gap-1">
                <input
                  type="text"
                  placeholder="Enlace del post en IG"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="input text-xs py-1 px-1.5 w-full"
                />
                <button
                  onClick={handleLink}
                  disabled={linking || !linkUrl.trim()}
                  title="Vincular esta pieza con la publicación real de Instagram para traer sus métricas"
                  className="btn-secondary text-xs px-2 py-1 flex-shrink-0"
                >
                  {linking ? "…" : "Vincular"}
                </button>
              </div>
              {linkError && <p className="text-xs text-red-600">{linkError}</p>}
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}
