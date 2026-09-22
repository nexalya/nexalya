"use client";

import { useState } from "react";
import ProductionDetail from "@/components/ProductionDetail";
import { PLATFORM_LABELS, STATUS_LABELS, type Platform, type Status } from "@/lib/types";
import { FORMAT_LABELS, FORMAT_ICONS, getFormatKey, hasStories, dayLabel, PostIcon } from "@/components/ContentFormatIcons";

// Antes "Guion y rodaje" apilaba el detalle completo (guion, plano a
// plano, stories, copies...) de TODAS las publicaciones una debajo de
// otra en una sola página larguísima — había que hacer scroll sin fin
// para encontrar una pieza en concreto. Ahora es una lista compacta a la
// izquierda (una fila por pieza) y, al pulsar una, su detalle completo
// aparece a la derecha — así se ve de un vistazo qué hay programado y se
// entra directo a la pieza que se busca, sin scroll de por medio.

const STATUS_DOT: Record<string, string> = {
  DRAFT: "bg-slate-300",
  READY: "bg-indigo-400",
  SCHEDULED: "bg-amber-400",
  PUBLISHED: "bg-emerald-400",
  FAILED: "bg-red-400",
};

type Item = {
  id: string;
  title: string;
  caption: string;
  mediaType: string;
  platform: string;
  productionNotes: string | null;
  scheduledAt: string;
  status: string;
};

export default function ProductionMasterDetail({ items }: { items: Item[] }) {
  const [selectedId, setSelectedId] = useState(items[0]?.id ?? null);
  const selected = items.find((i) => i.id === selectedId) ?? items[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4 items-start">
      <div className="card divide-y divide-slate-100 lg:max-h-[calc(100vh-260px)] lg:overflow-y-auto">
        {items.map((item) => {
          const formatKey = getFormatKey(item);
          const Icon = FORMAT_ICONS[formatKey] ?? PostIcon;
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
              <span className={`flex-shrink-0 ${isSelected ? "text-brand-600" : "text-slate-400"}`}>
                <Icon />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className={`text-xs font-medium ${isSelected ? "text-brand-700" : "text-slate-500"}`}>
                    {dayLabel(item.scheduledAt)}
                  </span>
                  <span className="text-[10px] text-slate-400 flex-shrink-0">
                    {PLATFORM_LABELS[item.platform as Platform] ?? item.platform}
                  </span>
                </span>
                <span className={`block text-sm truncate mt-0.5 ${isSelected ? "font-medium text-slate-800" : "text-slate-600"}`}>
                  {item.title}
                </span>
                <span className="text-[11px] text-slate-400">
                  {FORMAT_LABELS[formatKey]}
                  {hasStories(item.productionNotes) ? " + Stories" : ""}
                  {" · "}
                  {STATUS_LABELS[item.status as Status] ?? item.status}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="card p-4">
        {selected ? (
          <ProductionDetail item={selected} />
        ) : (
          <div className="text-sm text-slate-400 p-4 text-center">Elige una publicación de la lista.</div>
        )}
      </div>
    </div>
  );
}
