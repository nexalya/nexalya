"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function FollowerSnapshotForm({
  clientId,
  canSync = false,
}: {
  clientId: string;
  // true si el cliente tiene access token + ID de Instagram conectados —
  // entonces se puede rellenar el registro de hoy solo, sin teclearlo.
  canSync?: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [followers, setFollowers] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!followers) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/clients/${clientId}/followers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, followers }),
      });
      if (!res.ok) throw new Error("No se pudo guardar.");
      setFollowers("");
      router.refresh();
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSync() {
    setSyncing(true);
    setSyncError("");
    try {
      const res = await fetch(`/api/clients/${clientId}/followers/sync`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo sincronizar.");
      router.refresh();
    } catch (err) {
      setSyncError((err as Error).message);
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div className="space-y-2">
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <div>
          <label className="label">Fecha</label>
          <input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div>
          <label className="label">Seguidores totales</label>
          <input
            type="number"
            className="input"
            value={followers}
            onChange={(e) => setFollowers(e.target.value)}
            placeholder="1250"
            required
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Guardando…" : "Registrar"}
        </button>
        {canSync && (
          <button
            type="button"
            onClick={handleSync}
            disabled={syncing}
            className="btn-secondary"
            title="Traer el número de seguidores directamente de Instagram y registrarlo hoy"
          >
            {syncing ? "…" : "↻ Sincronizar desde Instagram"}
          </button>
        )}
      </form>
      {syncError && <p className="text-xs text-red-600">{syncError}</p>}
    </div>
  );
}
