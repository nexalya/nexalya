import { notFound } from "next/navigation";
import { getClient, listContentItems, listClientShares, listUsers, userCanAccessClient } from "@/lib/db-turso";
import { requireUser } from "@/lib/auth";
import NewContentForm from "@/components/NewContentForm";
import CalendarMasterDetail from "@/components/CalendarMasterDetail";
import ClientTabs from "@/components/ClientTabs";
import ClientSharing from "@/components/ClientSharing";
import InstagramConnectionForm from "@/components/InstagramConnectionForm";

export const dynamic = "force-dynamic";

export default async function ClientPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  // "item": id de una pieza concreta a preseleccionar en el calendario
  // (ej. al llegar desde la fecha de "Próximas publicaciones" del
  // Dashboard), para no tener que buscarla a mano en la lista del mes.
  searchParams: Promise<{ item?: string }>;
}) {
  const currentUser = await requireUser();
  const { id } = await params;
  const { item: selectedItemId } = await searchParams;
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

      {/* Lista + panel de detalle (ver CalendarMasterDetail.tsx), igual que
          "Guion y rodaje": la lista de la izquierda barre el mes de un
          vistazo, y al pulsar una pieza su detalle completo (guion, plano
          a plano, stories, copies...) aparece a la derecha, sin salir del
          calendario ni desplegar filas una a una. */}
      {contentItems.length === 0 ? (
        <div className="card p-8 text-center text-slate-500">
          Sin contenido programado todavía para este cliente.
        </div>
      ) : (
        <CalendarMasterDetail items={contentItems} initialSelectedId={selectedItemId ?? null} />
      )}
    </div>
  );
}
