"use client";

import { useState } from "react";

// Mismo patrón de lista + detalle que el calendario y "Guion y rodaje":
// antes "Calendario propuesto" era una tabla de 8 columnas que obligaba a
// scroll horizontal para leerla entera. Ahora la lista de la izquierda
// muestra lo justo para identificar cada propuesta (fecha, formato, tema)
// y el detalle completo aparece a la derecha al elegirla.

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "short" }).format(new Date(iso));
}

const STATUS_LABEL: Record<string, string> = { IDEA: "Idea", SCHEDULED: "Programada", DONE: "Publicada" };
const STATUS_COLOR: Record<string, string> = {
  IDEA: "bg-slate-100 text-slate-600",
  SCHEDULED: "bg-amber-100 text-amber-700",
  DONE: "bg-emerald-100 text-emerald-700",
};
const STATUS_DOT: Record<string, string> = {
  IDEA: "bg-slate-300",
  SCHEDULED: "bg-amber-400",
  DONE: "bg-emerald-400",
};

type PlanItem = {
  id: string;
  date: string;
  day: string | null;
  format: string | null;
  family: string | null;
  topic: string | null;
  objective: string | null;
  kpi: string | null;
  keyword: string | null;
  notes: string | null;
  status: string;
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

export default function PlanMasterDetail({ items }: { items: PlanItem[] }) {
  const [selectedId, setSelectedId] = useState(items[0]?.id ?? null);
  const selected = items.find((i) => i.id === selectedId) ?? items[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4 items-start">
      <div className="card divide-y divide-slate-100 lg:max-h-[560px] lg:overflow-y-auto">
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
              <span className={`mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0 ${STATUS_DOT[item.status] ?? "bg-slate-300"}`} />
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className={`text-xs font-medium ${isSelected ? "text-brand-700" : "text-slate-500"}`}>
                    {formatDate(item.date)}
                    {item.day ? ` · ${item.day}` : ""}
                  </span>
                  {item.format && <span className="text-[10px] text-slate-400 flex-shrink-0">{item.format}</span>}
                </span>
                <span className={`block text-sm truncate mt-0.5 ${isSelected ? "font-medium text-slate-800" : "text-slate-600"}`}>
                  {item.topic || item.family || "Sin tema"}
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
                <div className="font-medium">{selected.topic || "Sin tema"}</div>
                <div className="text-xs text-slate-400 mt-0.5 capitalize">
                  {formatDate(selected.date)}
                  {selected.day ? ` · ${selected.day}` : ""}
                  {selected.format ? ` · ${selected.format}` : ""}
                </div>
              </div>
              <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLOR[selected.status] || STATUS_COLOR.IDEA}`}>
                {STATUS_LABEL[selected.status] || selected.status}
              </span>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Línea editorial" value={selected.family} />
              <Field label="Objetivo" value={selected.objective} />
              <Field label="KPI" value={selected.kpi} />
              <Field label="Palabra clave" value={selected.keyword} />
            </div>
            <Field label="Stories / notas" value={selected.notes} />
          </div>
        ) : (
          <div className="text-sm text-slate-400 p-4 text-center">Elige una propuesta de la lista.</div>
        )}
      </div>
    </div>
  );
}
