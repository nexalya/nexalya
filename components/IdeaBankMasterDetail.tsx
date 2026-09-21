"use client";

import { useState } from "react";

// Mismo patrón de lista + detalle que el resto de pestañas del cliente.
// Antes el banco de ideas era una tabla de 6 columnas; ahora la lista de
// la izquierda muestra la prioridad y la idea, y el detalle completo
// (hook, ejecución, cuándo usarla...) aparece a la derecha.

const PRIORITY_DOT: Record<string, string> = {
  Alta: "bg-red-400",
  Media: "bg-amber-400",
  Baja: "bg-slate-300",
};

type IdeaItem = {
  id: string;
  priority: string;
  family: string | null;
  idea: string;
  hook: string | null;
  execution: string | null;
  resources: string | null;
  duration: string | null;
  objective: string | null;
  whenToUse: string | null;
};

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div className="bg-slate-50 rounded-lg p-3">
      <div className="text-xs font-medium text-slate-500 mb-1">{label}</div>
      <div className="text-sm text-slate-700">{value}</div>
    </div>
  );
}

export default function IdeaBankMasterDetail({ items }: { items: IdeaItem[] }) {
  const [selectedId, setSelectedId] = useState(items[0]?.id ?? null);
  const selected = items.find((i) => i.id === selectedId) ?? items[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4 items-start">
      <div className="card divide-y divide-slate-100 lg:max-h-[480px] lg:overflow-y-auto">
        {items.map((item) => {
          const isSelected = item.id === selected?.id;
          return (
            <button
              key={item.id}
              onClick={() => setSelectedId(item.id)}
              className={`w-full text-left p-3 flex items-start gap-2.5 transition-colors ${
                isSelected ? "bg-brand-50" : "hover:bg-slate-50"
              }`}
            >
              <span className={`mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0 ${PRIORITY_DOT[item.priority] ?? "bg-slate-300"}`} />
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className={`text-xs font-medium ${isSelected ? "text-brand-700" : "text-slate-500"}`}>
                    {item.priority}
                  </span>
                  {item.family && <span className="text-[10px] text-slate-400 flex-shrink-0">{item.family}</span>}
                </span>
                <span className={`block text-sm truncate mt-0.5 ${isSelected ? "font-medium text-slate-800" : "text-slate-600"}`}>
                  {item.idea}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="card p-4">
        {selected ? (
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <div className="font-medium">{selected.idea}</div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Prioridad {selected.priority}
                  {selected.family ? ` · ${selected.family}` : ""}
                  {selected.duration ? ` · ${selected.duration}` : ""}
                </div>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Hook" value={selected.hook} />
              <Field label="Objetivo" value={selected.objective} />
              <Field label="Ejecución" value={selected.execution} />
              <Field label="Recursos" value={selected.resources} />
            </div>
            <Field label="Cuándo usarla" value={selected.whenToUse} />
          </div>
        ) : (
          <div className="text-sm text-slate-400 p-4 text-center">Elige una idea de la lista.</div>
        )}
      </div>
    </div>
  );
}
