"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { dayLabel, timeLabel } from "@/components/ContentFormatIcons";

// Cambia la fecha/hora programada de una pieza sin tener que borrarla y
// crearla de nuevo — pensado para cuando no ha dado tiempo a publicar
// algo en su día y hay que aplazarlo, o simplemente se cambia de fecha.
// Al guardar, la pieza se mueve sola al día correcto en el calendario
// (la lista ya viene ordenada por fecha desde el servidor).

function toDatetimeLocalValue(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function ScheduledAtEditor({
  contentId,
  scheduledAt,
}: {
  contentId: string;
  scheduledAt: string;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(() => toDatetimeLocalValue(scheduledAt));
  const [loading, setLoading] = useState(false);

  function startEditing() {
    setValue(toDatetimeLocalValue(scheduledAt));
    setEditing(true);
  }

  async function handleSave() {
    if (!value) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/content/${contentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scheduledAt: new Date(value).toISOString() }),
      });
      if (!res.ok) throw new Error("No se pudo mover la fecha.");
      setEditing(false);
      router.refresh();
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  if (editing) {
    return (
      <div className="flex items-center gap-1.5">
        <input
          type="datetime-local"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={loading}
          className="text-xs rounded-md border border-slate-200 px-2 py-1 text-slate-700"
          autoFocus
        />
        <button
          onClick={handleSave}
          disabled={loading}
          className="text-xs font-medium text-brand-700 hover:text-brand-800 px-1.5 py-1"
        >
          {loading ? "Guardando…" : "Guardar"}
        </button>
        <button
          onClick={() => setEditing(false)}
          disabled={loading}
          className="text-xs text-slate-400 hover:text-slate-600 px-1"
        >
          Cancelar
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={startEditing}
      className="text-xs text-slate-500 hover:text-brand-600 hover:underline flex items-center gap-1"
      title="Cambiar la fecha/hora programada"
    >
      {dayLabel(scheduledAt)} · {timeLabel(scheduledAt)}
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-50">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    </button>
  );
}
