"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";

// En móvil, la lista y el detalle no caben lado a lado (se apilan en una
// sola columna), así que antes al pinchar una publicación el detalle
// aparecía metros más abajo, después de toda la lista — parecía que no
// pasaba nada. Esto muestra el detalle en una hoja que sube desde abajo
// y tapa la pantalla, como un modal, solo en móvil/tablet (en escritorio
// no se usa: ahí el detalle ya se ve al lado de la lista).
export default function MobileDetailSheet({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  // Evita que el fondo haga scroll por detrás mientras la hoja está abierta.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="lg:hidden fixed inset-0 z-50">
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />
      <div className="absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto rounded-t-2xl bg-white shadow-xl">
        <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-slate-100 pt-2">
          <div className="h-1 w-10 bg-slate-200 rounded-full mx-auto" />
          <div className="flex items-center justify-between px-4 py-2">
            <span className="text-xs font-medium text-slate-400">Detalle</span>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1 -mr-1"
              aria-label="Cerrar"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
