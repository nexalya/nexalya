import { notFound } from "next/navigation";
import { getClient, listContentItems, userCanAccessClient } from "@/lib/db-turso";
import { requireUser } from "@/lib/auth";
import ClientTabs from "@/components/ClientTabs";
import ProductionMasterDetail from "@/components/ProductionMasterDetail";
import { getFormatKey } from "@/components/ContentFormatIcons";

export const dynamic = "force-dynamic";

// Antes las historias solo se veían metidas dentro del guion de la
// publicación de feed del mismo día (o ni eso, si ese día no tocaba
// publicación) — para saber qué historia tocaba había que abrir cada
// pieza una a una y buscarla. Esta pestaña reúne TODAS las historias del
// cliente (tengan o no una publicación de feed ese mismo día) en una
// lista aparte, con el texto exacto de cada frame y el hook, para que se
// sepa de un vistazo qué hay que grabar/diseñar cada día.
export default async function ClientStoriesPage({ params }: { params: Promise<{ id: string }> }) {
  const currentUser = await requireUser();
  const { id } = await params;
  const client = await getClient(id);
  if (!client || !(await userCanAccessClient(id, currentUser.id))) notFound();

  const allItems = await listContentItems({ clientId: id });
  const stories = allItems.filter((item) => getFormatKey(item) === "STORY");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{client.name}</h1>
        <p className="text-slate-500 text-sm mt-1">
          Todas las historias del calendario, con el texto exacto de cada frame y el hook — para saber
          justo qué hay que grabar o diseñar cada día, sin tener que buscarlo dentro de cada publicación.
        </p>
      </div>

      <ClientTabs clientId={client.id} active="stories" />

      {stories.length === 0 ? (
        <div className="card p-8 text-center text-slate-500">
          Todavía no hay historias programadas para este cliente.
        </div>
      ) : (
        <ProductionMasterDetail items={stories} />
      )}
    </div>
  );
}
