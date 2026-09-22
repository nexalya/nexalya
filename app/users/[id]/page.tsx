import Link from "next/link";
import { notFound } from "next/navigation";
import { countClients, countContentByStatus, listContentItems, listClients, getUserById } from "@/lib/db-turso";
import { requireUser } from "@/lib/auth";
import { PLATFORM_LABELS, STATUS_LABELS, type Platform, type Status } from "@/lib/types";

export const dynamic = "force-dynamic";

const STATUS_STYLES: Record<string, string> = {
  DRAFT: "bg-slate-100 text-slate-600",
  READY: "bg-indigo-100 text-indigo-700",
  SCHEDULED: "bg-amber-100 text-amber-700",
  PUBLISHED: "bg-emerald-100 text-emerald-700",
  FAILED: "bg-red-100 text-red-700",
};

function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("es-ES", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

// Vista de solo lectura del panel de otra persona del equipo: mismos
// números y listas que su Dashboard, pero sin enlaces ni controles que
// permitan actuar "como ella" — cualquier acción real se sigue haciendo
// siempre desde la propia cuenta de quien mira esto.
export default async function UserPanelPage({ params }: { params: Promise<{ id: string }> }) {
  await requireUser();
  const { id } = await params;
  const targetUser = await getUserById(id);
  if (!targetUser) notFound();

  const clientsCount = await countClients(targetUser.id);
  const counts = await countContentByStatus(targetUser.id);
  const upcoming = (await listContentItems({ fromDaysAgo: 1, userId: targetUser.id })).slice(0, 30);
  const allClients = await listClients(targetUser.id);

  const countFor = (status: string) => counts[status] ?? 0;

  const plansDue = allClients.filter((c) => {
    const period = c.planPeriodDays || 30;
    if (!c.lastPlanGeneratedAt) return true;
    const days = Math.floor((Date.now() - new Date(c.lastPlanGeneratedAt).getTime()) / 86400000);
    return days >= period;
  }).length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Panel de {targetUser.name}</h1>
          <p className="text-slate-500 text-sm mt-1">
            Vista de solo lectura de lo que ve {targetUser.name} al entrar.
          </p>
        </div>
        <Link href="/users" className="text-sm text-brand-600 hover:underline flex-shrink-0">
          ← Volver a usuarios
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="card p-4">
          <div className="text-2xl font-semibold">{clientsCount}</div>
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
            <div className="p-8 text-center text-slate-500">No hay nada programado.</div>
          ) : (
            upcoming.map((item) => (
              <div key={item.id} className="p-4 flex items-center gap-4">
                <div className="w-28 flex-shrink-0 text-xs text-slate-500">
                  {formatDateTime(item.scheduledAt)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium">{item.client.name}</span>
                    <span className="text-xs text-slate-400">
                      {PLATFORM_LABELS[item.platform as Platform] ?? item.platform}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 truncate">{item.title}</p>
                </div>
                <span
                  className={`text-xs rounded-full px-2.5 py-1 font-medium flex-shrink-0 ${
                    STATUS_STYLES[item.status] ?? STATUS_STYLES.DRAFT
                  }`}
                >
                  {STATUS_LABELS[item.status as Status] ?? item.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-medium mb-3">Clientes</h2>
        {allClients.length === 0 ? (
          <div className="card p-8 text-center text-slate-500">Sin clientes todavía.</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {allClients.map((c) => (
              <div key={c.id} className="card p-4">
                <div className="font-medium">{c.name}</div>
                <div className="text-sm text-slate-500">{c.sector || "Sector sin definir"}</div>
                <div className="mt-3 text-xs text-slate-400">{c.contentCount} publicaciones en calendario</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
