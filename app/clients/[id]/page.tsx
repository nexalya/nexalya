import { notFound } from "next/navigation";
import { getClient, listContentItems, listClientShares, listUsers, userCanAccessClient } from "@/lib/db-turso";
import { requireUser } from "@/lib/auth";
import NewContentForm from "@/components/NewContentForm";
import CalendarRow from "@/components/CalendarRow";
import ClientTabs from "@/components/ClientTabs";
import ClientSharing from "@/components/ClientSharing";
import InstagramConnectionForm from "@/components/InstagramConnectionForm";

export const dynamic = "force-dynamic";

export default async function ClientPage({ params }: { params: Promise<{ id: string }> }) {
  const currentUser = await requireUser();
  const { id } = await params;
  const client = await getClient(id);
  if (!client || !await userCanAccessClient(id, currentUser.id)) notFound();
  const contentItems = await listContentItems({ clientId: id });
  const isOwner = client.ownerId === currentUser.id;
  const shares = client.ownerId ? await listClientShares(id) : [];
  const teammates = isOwner ? (await listUsers()).filter((u) => u.id !== currentUser.id) : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{client.name}</h1>
          <p className="text-slate-500 text-sm mt-1">
            {client.sector || "Sector sin definir"}
            {client.igHandle ? ` · ${client.igHandle}` : ""}
          </p>
        </div>
        <NewContentForm clientId={client.id} />
      </div>

      <ClientSharing
        clientId={client.id}
        ownerId={client.ownerId}
        isOwner={isOwner}
        shares={shares}
        teammates={teammates}
      />

      <ClientTabs clientId={client.id} active="calendar" />

      <InstagramConnectionForm
        clientId={client.id}
        hasAccessToken={!!client.accessToken}
        igUserId={client.igUserId}
      />

      {/* Tabla en vez de tarjetas, para poder barrer el mes de un vistazo
          (Día / Qué haces / Detalle / Estado). Cada fila es pulsable y
          despliega justo debajo el detalle completo de esa pieza (guion,
          plano a plano, stories, copies...) — el mismo contenido que antes
          solo se veía yendo a la pestaña "Guion y rodaje" (ver
          CalendarRow.tsx / ProductionDetail.tsx), así no hace falta salir
          del calendario para verlo. */}
      <div className="card overflow-x-auto">
        {contentItems.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            Sin contenido programado todavía para este cliente.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs text-slate-500">
              <tr>
                <th className="p-3 whitespace-nowrap">Día</th>
                <th className="p-3">Qué haces</th>
                <th className="p-3">Detalle</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {contentItems.map((item) => (
                <CalendarRow key={item.id} item={item} />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
