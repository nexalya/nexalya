import Link from "next/link";
import { listClients } from "@/lib/db-turso";
import { requireUser } from "@/lib/auth";
import NewClientForm from "@/components/NewClientForm";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const currentUser = await requireUser();
  const clients = await listClients(currentUser.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Clientes</h1>
          <p className="text-slate-500 text-sm mt-1">
            Todas las marcas que gestiona el equipo de Innovapro.
          </p>
        </div>
        <NewClientForm />
      </div>

      {clients.length === 0 ? (
        <div className="card p-8 text-center text-slate-500">
          Todavía no hay clientes. Añade el primero para empezar a programar contenido.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((c) => {
            const period = c.planPeriodDays || 30;
            const daysSince = c.lastPlanGeneratedAt
              ? Math.floor((Date.now() - new Date(c.lastPlanGeneratedAt).getTime()) / 86400000)
              : null;
            const planDue = daysSince === null || daysSince >= period;

            return (
              <Link key={c.id} href={`/clients/${c.id}`} className="card p-4 hover:border-brand-400 transition-colors">
                <div className="font-medium">{c.name}</div>
                <div className="text-sm text-slate-500">{c.sector || "Sector sin definir"}</div>
                <div className="mt-3 text-xs text-slate-400">
                  {c.contentCount} publicaciones en calendario
                </div>
                {c.igHandle && <div className="mt-1 text-xs text-brand-600">{c.igHandle}</div>}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      planDue ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {planDue ? "Plan IA por actualizar" : "Plan IA al día"}
                  </span>
                  {c.ownerId === null ? (
                    <span className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium bg-slate-100 text-slate-500">
                      Todo el equipo
                    </span>
                  ) : c.ownerId === currentUser.id ? (
                    <span className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium bg-brand-50 text-brand-700">
                      Tuyo
                    </span>
                  ) : (
                    <span className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium bg-slate-100 text-slate-500">
                      Compartido contigo
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
