import Link from "next/link";
import { countClients, countContentByStatus, listContentItems, listClients } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import StatusSelect from "@/components/StatusSelect";
import { PLATFORM_LABELS, type Platform } from "@/lib/types";

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

export default async function DashboardPage() {
  const currentUser = await requireUser();
  const clients = countClients(currentUser.id);
  const counts = countContentByStatus(currentUser.id);
  const upcoming = listContentItems({ fromDaysAgo: 1, userId: currentUser.id }).slice(0, 30);
  const allClients = listClients(currentUser.id);

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
          Lo que está programado o pendiente en todos los clientes de Innovapro.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="card p-4">
          <div className="text-2xl font-semibold">{clients}</div>
          <div className="text-xs text-slate-500">Clientes activos</div>
        </div>
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
            upcoming.map((item) => (
              <div key={item.id} className="p-4 flex items-center gap-4">
                <div className="w-28 flex-shrink-0 text-xs text-slate-500">
                  {formatDateTime(item.scheduledAt)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link href={`/clients/${item.clientId}`} className="font-medium hover:text-brand-700">
                      {item.client.name}
                    </Link>
                    <span className="text-xs text-slate-400">
                      {PLATFORM_LABELS[item.platform as Platform] ?? item.platform}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 truncate">{item.title}</p>
                </div>
                <StatusSelect contentId={item.id} status={item.status} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
