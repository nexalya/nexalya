import { notFound } from "next/navigation";
import { getClient, listContentItems, userCanAccessClient } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import ClientTabs from "@/components/ClientTabs";
import ProductionDetail from "@/components/ProductionDetail";

export const dynamic = "force-dynamic";

export default async function ClientProductionPage({ params }: { params: Promise<{ id: string }> }) {
  const currentUser = await requireUser();
  const { id } = await params;
  const client = getClient(id);
  if (!client || !userCanAccessClient(id, currentUser.id)) notFound();
  const contentItems = listContentItems({ clientId: id });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{client.name}</h1>
        <p className="text-slate-500 text-sm mt-1">
          Guion y rodaje: las mismas cuatro secciones de tu Excel — reels plano a plano, post
          diapositiva, stories diarias y copies y rodaje — pero dentro de cada publicación.
        </p>
      </div>

      <ClientTabs clientId={client.id} active="production" />

      {contentItems.length === 0 ? (
        <div className="card p-8 text-center text-slate-500">
          Todavía no hay publicaciones programadas para este cliente.
        </div>
      ) : (
        <div className="space-y-6">
          {contentItems.map((item) => (
            <div key={item.id} className="card p-4">
              <ProductionDetail item={item} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
