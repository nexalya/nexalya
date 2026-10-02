import { notFound } from "next/navigation";
import { getClient, listContentItems, listFollowerSnapshots, listIgMedia, userCanAccessClient } from "@/lib/db-turso";
import { requireUser } from "@/lib/auth";
import ClientTabs from "@/components/ClientTabs";
import MetricsMasterDetail from "@/components/MetricsMasterDetail";
import FollowerSnapshotForm from "@/components/FollowerSnapshotForm";
import PerformanceAnalysis, { rowsFromContentItems } from "@/components/PerformanceAnalysis";
import InstagramAnalytics, { PERIODS } from "@/components/analytics/InstagramAnalytics";
import { getFormatKey } from "@/components/ContentFormatIcons";

export const dynamic = "force-dynamic";

export default async function ClientMetricsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ d?: string }>;
}) {
  const currentUser = await requireUser();
  const { id } = await params;
  const client = await getClient(id);
  if (!client || !await userCanAccessClient(id, currentUser.id)) notFound();

  // Con Instagram conectado, todo sale de lo publicado de verdad
  // (importado solo cada hora, ver lib/instagram-sync.ts); sin conexión,
  // de las piezas del calendario con métricas puestas a mano.
  const connected = !!client.accessToken && !!client.igUserId;
  const allItems = await listContentItems({ clientId: id });
  const items = allItems.filter((i) => i.status === "PUBLISHED");
  const igMedia = connected ? await listIgMedia(id) : [];
  const calendarOptions = allItems.map((i) => ({
    id: i.id,
    title: i.title,
    scheduledAt: i.scheduledAt,
    format: getFormatKey(i),
  }));
  const snapshots = await listFollowerSnapshots(id);

  if (connected) {
    const requested = Number((await searchParams).d);
    const periodDays = (PERIODS as readonly number[]).includes(requested) ? requested : 30;
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">{client.name}</h1>
          <p className="text-slate-500 text-sm mt-1">Analítica de Instagram{client.igHandle ? ` · ${client.igHandle}` : ""}</p>
        </div>
        <ClientTabs clientId={client.id} active="metrics" />
        <InstagramAnalytics
          client={client}
          media={igMedia}
          snapshots={snapshots}
          calendarOptions={calendarOptions}
          periodDays={periodDays}
        />
      </div>
    );
  }

  // Sin Instagram conectado: seguimiento manual, como hasta ahora.
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
          <FollowerSnapshotForm clientId={client.id} />
          {snapshots.length > 0 && (
            <div className="text-xs text-slate-400">
              Histórico: {snapshots.map((s) => `${s.date}: ${s.followers}`).join(" · ")}
            </div>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-medium mb-3">Qué ha funcionado</h2>
        <PerformanceAnalysis rows={rowsFromContentItems(items)} />
      </div>

      <div>
        <h2 className="text-lg font-medium mb-3">Resultados por publicación</h2>
          <>
            {items.length === 0 ? (
              <div className="card p-8 text-center text-slate-500">Todavía no hay publicaciones publicadas.</div>
            ) : (
              <MetricsMasterDetail items={items} />
            )}
            <p className="text-xs text-slate-400 mt-2">
              Sin conexión a Instagram todavía, estos datos se rellenan a mano (igual que en vuestra plantilla de control
              de resultados): a las 24h y de nuevo a los 7 días de publicar. Al conectar Instagram en la ficha del
              cliente, esta sección se rellena sola cada hora.
            </p>
          </>
      </div>
    </div>
  );
}
