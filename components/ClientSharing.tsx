"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type PublicUser = { id: string; name: string; email: string };

export default function ClientSharing({
  clientId,
  ownerId,
  isOwner,
  shares,
  teammates,
}: {
  clientId: string;
  ownerId: string | null;
  isOwner: boolean;
  shares: PublicUser[];
  teammates: PublicUser[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [picking, setPicking] = useState(false);

  // Cliente "de nadie en concreto": ya existía antes de tener cuentas, se
  // trata como del equipo entero y no hay nada que gestionar aquí.
  if (ownerId === null) {
    return (
      <div className="text-xs text-slate-500 flex items-center gap-1.5">
        <span className="inline-flex rounded-full px-2 py-0.5 bg-slate-100 text-slate-600 font-medium">
          Compartido con todo el equipo
        </span>
      </div>
    );
  }

  async function addShare(userId: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/clients/${clientId}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) throw new Error("No se pudo compartir.");
      setPicking(false);
      router.refresh();
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function removeShare(userId: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/clients/${clientId}/share`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) throw new Error("No se pudo dejar de compartir.");
      router.refresh();
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  if (!isOwner) {
    return (
      <div className="text-xs text-slate-500">
        {shares.length > 0 ? (
          <span>Compartido contigo{shares.length > 1 ? ` y ${shares.length - 1} más` : ""}.</span>
        ) : (
          <span>Cliente compartido contigo.</span>
        )}
      </div>
    );
  }

  const available = teammates.filter((t) => !shares.some((s) => s.id === t.id));

  return (
    <div className="flex flex-wrap items-center gap-1.5 text-xs">
      <span className="text-slate-500">Compartido con:</span>
      {shares.length === 0 && !picking && <span className="text-slate-400">nadie todavía</span>}
      {shares.map((s) => (
        <span
          key={s.id}
          className="inline-flex items-center gap-1 rounded-full pl-2.5 pr-1.5 py-0.5 bg-brand-50 text-brand-700 font-medium"
        >
          {s.name}
          <button
            onClick={() => removeShare(s.id)}
            disabled={loading}
            className="text-brand-400 hover:text-brand-700"
            title="Dejar de compartir"
          >
            ×
          </button>
        </span>
      ))}
      {picking ? (
        available.length === 0 ? (
          <span className="text-slate-400">No hay más compañeros que añadir.</span>
        ) : (
          <select
            autoFocus
            disabled={loading}
            defaultValue=""
            onChange={(e) => {
              if (e.target.value) addShare(e.target.value);
            }}
            onBlur={() => setPicking(false)}
            className="rounded-md border border-slate-300 px-2 py-1 text-xs"
          >
            <option value="" disabled>
              Elegir persona…
            </option>
            {available.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        )
      ) : (
        <button onClick={() => setPicking(true)} className="text-brand-600 hover:underline">
          + Compartir
        </button>
      )}
    </div>
  );
}
