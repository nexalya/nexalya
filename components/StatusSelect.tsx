"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { EDITABLE_STATUSES, STATUS_LABELS, type Status } from "@/lib/types";

const STATUS_STYLES: Record<string, string> = {
  DRAFT: "bg-slate-100 text-slate-600",
  READY: "bg-indigo-100 text-indigo-700",
  SCHEDULED: "bg-amber-100 text-amber-700",
  PUBLISHED: "bg-emerald-100 text-emerald-700",
  FAILED: "bg-red-100 text-red-700",
};

/**
 * Antes había un botón "Publicar ahora" que llamaba a la API de
 * publicación (hoy simulada). Como publicar en Instagram lo sigue
 * haciendo el equipo a mano, esto confundía: parecía que el software
 * publicaba de verdad. Ahora es un desplegable de estado que el equipo
 * actualiza según va subiendo el contenido — pendiente, programado o
 * publicado — y punto.
 */
export default function StatusSelect({
  contentId,
  status,
}: {
  contentId: string;
  status: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [loading, setLoading] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value;
    const previous = value;
    setValue(next);
    setLoading(true);
    try {
      const res = await fetch(`/api/content/${contentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: next,
          // Al marcar como publicado registramos cuándo, si no lo tenía ya
          // (por ejemplo, si se marca y luego se corrige por error).
          publishedAt: next === "PUBLISHED" ? new Date().toISOString() : null,
        }),
      });
      if (!res.ok) throw new Error("No se pudo actualizar el estado.");
      router.refresh();
    } catch (err) {
      alert((err as Error).message);
      setValue(previous);
    } finally {
      setLoading(false);
    }
  }

  const options: Status[] =
    status === "FAILED" && !EDITABLE_STATUSES.includes(status as Status)
      ? [...EDITABLE_STATUSES, "FAILED" as Status]
      : EDITABLE_STATUSES;

  // Flecha propia en vez de la nativa del navegador: la nativa quedaba
  // pegada al borde redondeado de la píldora.
  return (
    <span className="relative inline-flex items-center">
      <select
        value={value}
        onChange={handleChange}
        disabled={loading}
        className={`appearance-none text-xs rounded-full pl-2.5 pr-7 py-1 font-medium border-0 cursor-pointer ${
          STATUS_STYLES[value] ?? STATUS_STYLES.DRAFT
        }`}
      >
        {options.map((s) => (
          <option key={s} value={s}>
            {STATUS_LABELS[s]}
          </option>
        ))}
      </select>
      <svg
        aria-hidden
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`pointer-events-none absolute right-2.5 ${(STATUS_STYLES[value] ?? STATUS_STYLES.DRAFT).split(" ").find((c) => c.startsWith("text-"))}`}
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </span>
  );
}
