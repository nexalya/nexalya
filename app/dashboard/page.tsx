import Link from "next/link";
import { countClients, countContentByStatus, listContentItems, listClients } from "@/lib/db-turso";
import { requireUser } from "@/lib/auth";
import StatusSelect from "@/components/StatusSelect";
import { PLATFORM_LABELS, type Platform } from "@/lib/types";
import { FORMAT_LABELS, FORMAT_ICONS, getFormatKey, hasStories, PostIcon } from "@/components/ContentFormatIcons";

export const dynamic = "force-dynamic";

function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat("es-ES", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

// "septiembre 2026" — igual que en Calendario, para separar la lista de
// próximas publicaciones por mes y que quede más ordenado de un vistazo.
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

export default async function DashboardPage() {
  const currentUser = await requireUser();
  const clients = await countClients(currentUser.id);
  const counts = await countContentByStatus(currentUser.id);
  const upcoming = (await listContentItems({ fromDaysAgo: 1, userId: currentUser.id })).slice(0, 30);
  const allClients = await listClients(currentUser.id);

  const countFor = (status: string) => counts[status] ?? 0;

  const plansDue = allClients.filter((c) => {
    const period = c.planPeriodDays || 30;
    if (!c.lastPlanGeneratedAt) return true;
    const days = Math.floor((Date.now() - new Date(c.lastPlanGeneratedAt).getTime()) / 86400000);
    return days >= period;
  }).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">
          Panel de trabajo Nexalya.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <Link href="/clients" className="card p-4 hover:border-brand-300 hover:shadow-md transition-shadow">
          <div className="text-2xl font-semibold">{clients}</div>
          <div className="text-xs text-slate-500">Clientes activos</div>
        </Link>
        <div className="card p-4">
          <div className="text-2xl font-semibold text-amber-600">{countFor("SCHEDULED")}</div>
          <div className="text-xs text-slate-500">Programados</div>
        </div>
        <div className="card p-4">
          <div className="text-2xl font-semibold text-emerald-600">{countFor("PUBLISHED")}</div>
          <div className="text-xs text-slate-500">Publicados</div>
        </div>
        <div className="card p-4">
          <div className="text-2xl font-semibold text-red-600">{countFor("FAILED")}</div>
          <div className="text-xs text-slate-500">Fallidos</div>
        </div>
        <div className="card p-4">
          <div className="text-2xl font-semibold text-brand-600">{plansDue}</div>
          <div className="text-xs text-slate-500">Planes IA por actualizar</div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-medium mb-3">Próximas publicaciones</h2>
        <div className="card divide-y divide-slate-100">
          {upcoming.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No hay nada programado.{" "}
              <Link href="/clients" className="text-brand-600 hover:underline">
                Ve a un cliente y programa contenido
              </Link>
              .
            </div>
          ) : (
            upcoming.map((item, idx) => {
              const formatKey = getFormatKey(item);
              const FormatIcon = FORMAT_ICONS[formatKey] ?? PostIcon;
              const showMonthHeader =
                idx === 0 || monthKey(item.scheduledAt) !== monthKey(upcoming[idx - 1].scheduledAt);
              return (
                <div key={item.id}>
                  {showMonthHeader && (
                    <div className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur px-4 py-1.5 text-xs font-semibold text-slate-500 border-b border-slate-100">
                      {monthLabel(item.scheduledAt)}
                    </div>
                  )}
                  <div className="p-4 flex items-center gap-4">
                    <Link
                      href={`/clients/${item.clientId}?item=${item.id}`}
                      className="w-28 flex-shrink-0 text-xs text-slate-500 hover:text-brand-600 hover:underline"
                      title="Ver en el calendario del cliente"
                    >
                      {formatDateTime(item.scheduledAt)}
                    </Link>
                    {/* Antes el nombre del cliente y el título de la publicación no
                        llevaban a la pieza concreta (solo la fecha, a la izquierda, lo
                        hacía) — así que si se pinchaba ahí (lo más intuitivo, por ser el
                        texto grande) siempre caía en la primera publicación del
                        calendario del cliente, no en la que se había pinchado. Ahora todo
                        este bloque es un único enlace a la misma pieza. */}
                    <Link
                      href={`/clients/${item.clientId}?item=${item.id}`}
                      className="flex-1 min-w-0 group"
                      title="Ver esta publicación en el calendario"
                    >
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium group-hover:text-brand-700">{item.client.name}</span>
                        <span className="text-xs text-slate-400">
                          {PLATFORM_LABELS[item.platform as Platform] ?? item.platform}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 truncate group-hover:text-brand-700">{item.title}</p>
                    </Link>
                    <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 flex-shrink-0 w-28 justify-end">
                      <span className="flex-shrink-0">
                        <FormatIcon />
                      </span>
                      <span className="truncate">
                        {FORMAT_LABELS[formatKey]}
                        {hasStories(item.productionNotes) ? " + Stories" : ""}
                      </span>
                    </div>
                    <StatusSelect contentId={item.id} status={item.status} />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
