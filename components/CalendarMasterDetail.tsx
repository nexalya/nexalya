"use client";

import { useEffect, useRef, useState } from "react";
import StatusSelect from "@/components/StatusSelect";
import DeleteButton from "@/components/DeleteButton";
import ProductionDetail from "@/components/ProductionDetail";
import ScheduledAtEditor from "@/components/ScheduledAtEditor";
import MobileDetailSheet from "@/components/MobileDetailSheet";
import { PLATFORM_LABELS, STATUS_LABELS, type Platform, type Status } from "@/lib/types";
import { FORMAT_LABELS, FORMAT_ICONS, getFormatKey, hasStories, dayLabel, timeLabel, PostIcon } from "@/components/ContentFormatIcons";

// "septiembre 2026" — para separar la lista por mes. La cabecera de cada
// mes queda pegada arriba (sticky) mientras se hace scroll dentro de ese
// tramo, así siempre se sabe en qué mes se está aunque la lista sea larga.
function monthLabel(iso: string): string {
  const label = new Intl.DateTimeFormat("es-ES", { month: "long", year: "numeric", timeZone: "Europe/Madrid" }).format(
    new Date(iso)
  );
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function monthKey(iso: string): string {
  const d = new Date(iso);
  return `${d.getUTCFullYear()}-${d.getUTCMonth()}`;
}

// Mismo patrón que "Guion y rodaje" (ver ProductionMasterDetail): lista
// compacta a la izquierda, detalle completo a la derecha. Antes esta
// pestaña era una tabla ancha con una fila desplegable por pieza —
// funcionaba, pero obligaba a hacer scroll horizontal en móvil/tablet y a
// desplegar una por una para comparar. Ahora se ve toda la lista del mes
// de un vistazo y se cambia de pieza con un clic, sin perder el sitio.

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
  errorMessage: string | null;
};

export default function CalendarMasterDetail({
  items,
  initialSelectedId,
}: {
  items: Item[];
  // Id de la pieza a preseleccionar (y hacer scroll hasta ella) al entrar
  // desde un enlace externo, ej. la fecha de una publicación en el
  // Dashboard — así no hay que buscarla a mano en la lista del mes.
  initialSelectedId?: string | null;
}) {
  const [selectedId, setSelectedId] = useState(
    () => items.find((i) => i.id === initialSelectedId)?.id ?? items[0]?.id ?? null
  );
  const selected = items.find((i) => i.id === selectedId) ?? items[0];
  // En escritorio el detalle ya se ve al lado de la lista (segunda
  // columna); en móvil/tablet se apilan, así que ahí el detalle se
  // muestra en una hoja aparte que sube desde abajo al pinchar una
  // publicación (ver MobileDetailSheet). mobileSheetOpen solo controla
  // esa hoja — en escritorio no tiene ningún efecto.
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

  function selectItem(id: string) {
    setSelectedId(id);
    setMobileSheetOpen(true);
  }

  // Al pulsar la fecha de OTRA pieza en el Dashboard mientras ya se estaba
  // viendo el calendario de este mismo cliente, Next.js no desmonta este
  // componente (solo cambia el parámetro ?item= de la URL) — así que un
  // useState inicial no bastaba: se quedaba con la primera pieza que se
  // hubiera seleccionado en esta pestaña y ya no reaccionaba a los
  // siguientes enlaces ("siempre lleva a la primera de Tulaser/Innova").
  // Este efecto vuelve a aplicar la selección cada vez que initialSelectedId
  // cambia a una pieza todavía no aplicada, sin pisar una elección manual
  // posterior del usuario (que no toca la URL).
  const appliedIdRef = useRef<string | null>(null);
  useEffect(() => {
    if (!initialSelectedId || appliedIdRef.current === initialSelectedId) return;
    const match = items.find((i) => i.id === initialSelectedId);
    if (!match) return;
    appliedIdRef.current = initialSelectedId;
    setSelectedId(match.id);
    setMobileSheetOpen(true);
    document.getElementById(`content-item-${match.id}`)?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [initialSelectedId, items]);

  const detailContent = selected ? (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100 flex-wrap">
        <div className="flex items-center gap-3 flex-wrap">
          <StatusSelect contentId={selected.id} status={selected.status} />
          <ScheduledAtEditor contentId={selected.id} scheduledAt={selected.scheduledAt} />
        </div>
        <DeleteButton url={`/api/content/${selected.id}`} confirmText="¿Eliminar esta publicación?" />
      </div>
      <ProductionDetail item={selected} />
    </div>
  ) : (
    <div className="text-sm text-slate-400 p-4 text-center">Elige una publicación de la lista.</div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-4 items-start">
      <div className="card divide-y divide-slate-100 lg:max-h-[calc(100vh-260px)] lg:overflow-y-auto">
        {items.map((item, idx) => {
          const formatKey = getFormatKey(item);
          const Icon = FORMAT_ICONS[formatKey] ?? PostIcon;
          const isSelected = item.id === selected?.id;
          const showMonthHeader = idx === 0 || monthKey(item.scheduledAt) !== monthKey(items[idx - 1].scheduledAt);
          return (
            <div key={item.id} id={`content-item-${item.id}`}>
              {showMonthHeader && (
                <div className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur px-3 py-1.5 text-xs font-semibold text-slate-500 border-b border-slate-100">
                  {monthLabel(item.scheduledAt)}
                </div>
              )}
              <button
                onClick={() => selectItem(item.id)}
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
                      {dayLabel(item.scheduledAt)} · {timeLabel(item.scheduledAt)}
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
            </div>
          );
        })}
      </div>

      <div className="hidden lg:block card p-4">{detailContent}</div>

      <MobileDetailSheet open={mobileSheetOpen} onClose={() => setMobileSheetOpen(false)}>
        {detailContent}
      </MobileDetailSheet>
    </div>
  );
}
