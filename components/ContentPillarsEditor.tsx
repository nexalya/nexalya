"use client";

import type { ContentPillarResult } from "@/components/BrandAnalyzeButton";

// Editor reutilizable del "universo de marca": una lista de series de
// contenido recurrentes (nombre + de qué trata + % de la mezcla total).
// Lo usan tanto el alta de cliente como la edición del brief. Se guarda
// como JSON en clients.contentPillars (ver lib/db.ts) — este componente
// solo trabaja con el array ya parseado; quien lo usa se encarga de
// serializarlo al guardar.
export default function ContentPillarsEditor({
  pillars,
  onChange,
}: {
  pillars: ContentPillarResult[];
  onChange: (pillars: ContentPillarResult[]) => void;
}) {
  function update(i: number, patch: Partial<ContentPillarResult>) {
    onChange(pillars.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));
  }
  function remove(i: number) {
    onChange(pillars.filter((_, idx) => idx !== i));
  }
  function add() {
    onChange([...pillars, { name: "", description: "", mixPercent: 0 }]);
  }

  const totalPercent = pillars.reduce((sum, p) => sum + (Number(p.mixPercent) || 0), 0);

  return (
    <div className="space-y-2">
      {pillars.map((p, i) => (
        <div key={i} className="flex gap-2 items-start border border-slate-200 rounded-md p-2">
          <div className="flex-1 space-y-1">
            <input
              className="input"
              placeholder="Nombre de la serie (ej. Mitos vs. Realidad)"
              value={p.name}
              onChange={(e) => update(i, { name: e.target.value })}
            />
            <textarea
              className="input"
              rows={2}
              placeholder="De qué trata en una frase"
              value={p.description}
              onChange={(e) => update(i, { description: e.target.value })}
            />
          </div>
          <div className="w-16">
            <input
              type="number"
              className="input"
              min={0}
              max={100}
              value={p.mixPercent}
              onChange={(e) => update(i, { mixPercent: Number(e.target.value) })}
            />
            <span className="text-xs text-slate-400 block text-center">%</span>
          </div>
          <button
            type="button"
            className="text-slate-400 hover:text-red-600 text-sm px-1"
            onClick={() => remove(i)}
            aria-label="Quitar serie"
          >
            ✕
          </button>
        </div>
      ))}
      <div className="flex items-center justify-between">
        <button type="button" className="btn-secondary text-xs" onClick={add}>
          + Añadir serie
        </button>
        {pillars.length > 0 && (
          <span className={`text-xs ${totalPercent === 100 ? "text-slate-400" : "text-amber-600"}`}>
            Suma: {totalPercent}%{totalPercent !== 100 ? " — debería rondar 100%" : ""}
          </span>
        )}
      </div>
    </div>
  );
}
