"use client";

import { useState } from "react";
import StatusSelect from "@/components/StatusSelect";
import DeleteButton from "@/components/DeleteButton";
import ProductionDetail from "@/components/ProductionDetail";
import { PLATFORM_LABELS, type Platform } from "@/lib/types";
import {
  FORMAT_LABELS,
  FORMAT_ICONS,
  getFormatKey,
  hasStories,
  dayLabel,
  timeLabel,
  PostIcon,
} from "@/components/ContentFormatIcons";

// Cada fila del calendario, con el detalle completo (guion, plano a plano,
// stories, copies...) plegado por defecto: al pulsar la fila se despliega
// justo debajo, reutilizando el mismo componente que la pestaña "Guion y
// rodaje" — así no hay que ir a otra pestaña ni perder el sitio del
// calendario para ver el detalle de una pieza.
export default function CalendarRow({
  item,
}: {
  item: {
    id: string;
    title: string;
    caption: string;
    mediaType: string;
    platform: string;
    productionNotes: string | null;
    scheduledAt: string;
    status: string;
    errorMessage: string | null;
  };
}) {
  const [open, setOpen] = useState(false);
  const formatKey = getFormatKey(item);
  const Icon = FORMAT_ICONS[formatKey] ?? PostIcon;
  const whatLabel = hasStories(item.productionNotes)
    ? `${FORMAT_LABELS[formatKey]} + Stories`
    : FORMAT_LABELS[formatKey];

  return (
    <>
      <tr
        className="align-top cursor-pointer hover:bg-slate-50"
        onClick={() => setOpen((v) => !v)}
        title="Ver todos los detalles de esta pieza"
      >
        <td className="p-3 whitespace-nowrap font-medium">
          <div className="flex items-center gap-1.5">
            <span className={`text-slate-300 transition-transform ${open ? "rotate-90" : ""}`}>›</span>
            {dayLabel(item.scheduledAt)}
          </div>
        </td>
        <td className="p-3 whitespace-nowrap">
          <div className="flex items-center gap-1.5 font-medium text-slate-700">
            <Icon />
            {whatLabel}
          </div>
        </td>
        <td className="p-3 min-w-[260px]">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium">{item.title}</span>
            <span className="text-xs text-slate-400">
              {PLATFORM_LABELS[item.platform as Platform] ?? item.platform}
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1 line-clamp-2">{item.caption}</p>
          <p className="text-xs text-slate-400 mt-1">Publica aprox. {timeLabel(item.scheduledAt)}</p>
          {item.errorMessage && <p className="text-xs text-red-600 mt-1">Error: {item.errorMessage}</p>}
        </td>
        {/* onClick en <td> en vez de en los controles, para que elegir estado o
            eliminar no despliegue/pliegue la fila sin querer. */}
        <td className="p-3" onClick={(e) => e.stopPropagation()}>
          <div className="flex flex-col gap-2 items-end flex-shrink-0">
            <StatusSelect contentId={item.id} status={item.status} />
            <DeleteButton url={`/api/content/${item.id}`} confirmText="¿Eliminar esta publicación?" />
          </div>
        </td>
      </tr>
      {open && (
        <tr>
          <td colSpan={4} className="p-4 bg-slate-50/60 border-t border-slate-100">
            <ProductionDetail item={item} />
          </td>
        </tr>
      )}
    </>
  );
}
