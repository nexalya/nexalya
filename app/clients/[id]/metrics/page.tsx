import { notFound } from "next/navigation";
import { getClient, listContentItems, listFollowerSnapshots, userCanAccessClient } from "@/lib/db-turso";
import { requireUser } from "@/lib/auth";
import ClientTabs from "@/components/ClientTabs";
import MetricsRow from "@/components/MetricsRow";
import FollowerSnapshotForm from "@/components/FollowerSnapshotForm";
import PerformanceAnalysis from "@/components/PerformanceAnalysis";

export const dynamic = "force-dynamic";

export default async function ClientMetricsPage({ params }: { params: Promise<{ id: string }> }) {
  const currentUser = await requireUser();
  const { id } = await params;
  const client = await getClient(id);
  if (!client || !await userCanAccessClient(id, currentUser.id)) notFound();

  const items = (await listContentItems({ clientId: id })).filter((i) => i.status === "PUBLISHED");
  const snapshots = await listFollowerSnapshots(id);
  const last = snapshots[snapshots.length - 1];
  const prev = snapshots[snapshots.length - 2];
  const delta = last && prev ? last.followers - prev.followers : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{client.name}</h1>
        <p className="text-slate-500 text-sm mt-1">Seguidores y resultados por publicación</p>
      </div>

      <ClientTabs clientId={client.id} active="metrics" />

      <div>
        <h2 className="text-lg font-medium mb-3">Seguidores</h2>
        <div className="card p-4 space-y-4">
          <div className="flex flex-wrap items-center gap-6">
            <div>
              <div className="text-2xl font-semibold">{last ? last.followers.toLocaleString("es-ES") : "—"}</div>
              <div className="text-xs text-slate-500">Último registro{last ? ` · ${last.date}` : ""}</div>
            </div>
            {delta !== null && (
              <div>
                <div className={`text-2xl font-semibold ${delta >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                  {delta >= 0 ? "+" : ""}
                  {delta}
                </div>
                <div className="text-xs text-slate-500">Desde el registro anterior</div>
              </div>
            )}
          </div>
          <FollowerSnapshotForm clientId={client.id} canSync={!!client.accessToken && !!client.igUserId} />
          {snapshots.length > 0 && (
            <div className="text-xs text-slate-400">
              Histórico: {snapshots.map((s) => `${s.date}: ${s.followers}`).join(" · ")}
            </div>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-medium mb-3">Qué ha funcionado</h2>
        <PerformanceAnalysis items={items} />
      </div>

      <div>
        <h2 className="text-lg font-medium mb-3">Resultados por publicación</h2>
        {items.length === 0 ? (
          <div className="card p-8 text-center text-slate-500">Todavía no hay publicaciones publicadas.</div>
        ) : (
          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs text-slate-500">
                <tr>
                  <th className="p-3">Publicación</th>
                  <th className="p-2">Alcance</th>
                  <th className="p-2">Likes</th>
                  <th className="p-2">Coment.</th>
                  <th className="p-2">Guard.</th>
                  <th className="p-2">Compart.</th>
                  <th className="p-2">Visitas perfil</th>
                  <th className="p-2">Seguidores +</th>
                  <th className="p-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => (
                  <MetricsRow key={item.id} item={item} />
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="text-xs text-slate-400 mt-2">
          {client.accessToken
            ? "Para las piezas publicadas con la API real, el botón \"↻ Instagram\" trae los datos directamente. Para el resto (o si prefieres verificarlo a mano), se puede seguir rellenando la fila."
            : "Sin conexión a Instagram todavía, estos datos se rellenan a mano (igual que en vuestra plantilla de control de resultados): a las 24h y de nuevo a los 7 días de publicar."}
        </p>
      </div>
    </div>
  );
}
