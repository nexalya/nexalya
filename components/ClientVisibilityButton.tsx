"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

// Ocultar / mostrar un cliente en la vista de quien lo pulsa (ver
// /api/clients/[id]/visibility). "compact" es el icono pequeño de las
// tarjetas de la lista de clientes; el normal, el botón de la ficha.
export default function ClientVisibilityButton({
  clientId,
  hidden,
  compact = false,
}: {
  clientId: string;
  hidden: boolean;
  compact?: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    try {
      const res = await fetch(`/api/clients/${clientId}/visibility`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hidden: !hidden }),
      });
      if (!res.ok) throw new Error("No se pudo cambiar la visibilidad.");
      router.refresh();
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  const label = hidden ? "Mostrar cliente" : "Ocultar cliente";
  const title = hidden
    ? "Volver a mostrarlo en tu lista, menú y dashboard"
    : "Quitarlo de tu lista, menú y dashboard (no borra nada y tus compañeros lo siguen viendo)";

  if (compact) {
    return (
      <button
        onClick={toggle}
        disabled={loading}
        title={title}
        aria-label={label}
        className="rounded-md p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
      >
        {hidden ? <EyeIcon /> : <EyeOffIcon />}
      </button>
    );
  }

  return (
    <button onClick={toggle} disabled={loading} title={title} className="btn-secondary text-xs inline-flex items-center gap-1.5">
      {hidden ? <EyeIcon /> : <EyeOffIcon />}
      {loading ? "…" : label}
    </button>
  );
}

function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 19c-6.5 0-10-7-10-7a18.5 18.5 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c6.5 0 10 7 10 7a18.5 18.5 0 0 1-2.16 3.19" />
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
      <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
  );
}
