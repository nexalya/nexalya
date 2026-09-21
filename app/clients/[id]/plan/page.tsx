import { notFound } from "next/navigation";
import { getClient, listPlanItems, listIdeaBank, getLatestPlanBatch, userCanAccessClient } from "@/lib/db-turso";
import { requireUser } from "@/lib/auth";
import ClientTabs from "@/components/ClientTabs";
import GeneratePlanButton from "@/components/GeneratePlanButton";
import ClientSettingsForm from "@/components/ClientSettingsForm";

export const dynamic = "force-dynamic";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "short" }).format(new Date(iso));
}

type ContentPillar = { name: string; description: string; mixPercent: number };

function parsePillars(raw: string | null): ContentPillar[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

const STATUS_LABEL: Record<string, string> = { IDEA: "Idea", SCHEDULED: "Programada", DONE: "Publicada" };
const STATUS_COLOR: Record<string, string> = {
  IDEA: "bg-slate-100 text-slate-600",
  SCHEDULED: "bg-amber-100 text-amber-700",
  DONE: "bg-emerald-100 text-emerald-700",
};

export default async function ClientPlanPage({ params }: { params: Promise<{ id: string }> }) {
  const currentUser = await requireUser();
  const { id } = await params;
  const client = await getClient(id);
  if (!client || !await userCanAccessClient(id, currentUser.id)) notFound();

  const planItems = await listPlanItems(id);
  const ideaBank = await listIdeaBank(id);
  const latestBatch = await getLatestPlanBatch(id);

  const pillars = parsePillars(client.contentPillars);
  const periodDays = client.planPeriodDays || 30;
  const daysSince = client.lastPlanGeneratedAt
    ? Math.floor((Date.now() - new Date(client.lastPlanGeneratedAt).getTime()) / 86400000)
    : null;
  const isDue = daysSince === null || daysSince >= periodDays;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{client.name}</h1>
          <p className="text-slate-500 text-sm mt-1">Plan de contenido generado por IA</p>
        </div>
        <ClientSettingsForm
          clientId={client.id}
          initialName={client.name}
          initialSector={client.sector || ""}
          initialIgHandle={client.igHandle || ""}
          initialWebsite={client.website || ""}
          initialBrief={client.brandBrief || ""}
          initialPeriodDays={periodDays}
          initialTargetAudience={client.targetAudience || ""}
          initialCompetitors={client.competitors || ""}
          initialToneOfVoice={client.toneOfVoice || ""}
          initialAvoidTopics={client.avoidTopics || ""}
          initialVisualIdentity={client.visualIdentity || ""}
          initialContentPillars={client.contentPillars || ""}
        />
      </div>

      <ClientTabs clientId={client.id} active="plan" />

      <div className={`card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 ${isDue ? "bg-amber-50 border-amber-200" : "bg-emerald-50 border-emerald-200"}`}>
        <div className="text-sm">
          {daysSince === null ? (
            <span>Todavía no se ha generado ningún plan para este cliente.</span>
          ) : (
            <span>
              Último plan generado hace <strong>{daysSince}</strong> día{daysSince === 1 ? "" : "s"} (cada{" "}
              {periodDays} días). {isDue ? "Toca actualizarlo." : "Todavía vigente."}
            </span>
          )}
        </div>
        <GeneratePlanButton clientId={client.id} label={daysSince === null ? "Generar plan" : "Actualizar plan"} />
      </div>

      {latestBatch?.trendsSummary && (
        <div className="card p-4 text-sm text-slate-700 bg-brand-50 border-brand-100">
          <span className="font-medium">Tendencias detectadas: </span>
          {latestBatch.trendsSummary}
        </div>
      )}

      {pillars.length > 0 && (
        <div className="card p-4">
          <h2 className="text-sm font-medium mb-2">
            Universo de marca <span className="text-slate-400 font-normal">— líneas fijas que sigue el plan</span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {pillars.map((p, i) => (
              <div key={i} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-700" title={p.description}>
                <span className="font-medium">{p.name}</span> · {p.mixPercent}%
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-lg font-medium mb-3">Calendario propuesto</h2>
        {planItems.length === 0 ? (
          <div className="card p-8 text-center text-slate-500">
            Todavía no hay plan. Pulsa &quot;Generar plan&quot; para que la IA estudie la marca y proponga contenidos.
          </div>
        ) : (
          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs text-slate-500">
                <tr>
                  <th className="p-3">Fecha</th>
                  <th className="p-3">Formato</th>
                  <th className="p-3">Línea editorial</th>
                  <th className="p-3">Tema / hook</th>
                  <th className="p-3">Objetivo</th>
                  <th className="p-3">KPI</th>
                  <th className="p-3">Stories / notas</th>
                  <th className="p-3">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {planItems.map((p) => (
                  <tr key={p.id}>
                    <td className="p-3 whitespace-nowrap">
                      {formatDate(p.date)}
                      <div className="text-xs text-slate-400 capitalize">{p.day}</div>
                    </td>
                    <td className="p-3">{p.format}</td>
                    <td className="p-3">{p.family}</td>
                    <td className="p-3 max-w-xs">{p.topic}</td>
                    <td className="p-3">{p.objective}</td>
                    <td className="p-3">{p.kpi}</td>
                    <td className="p-3 max-w-xs text-slate-500">{p.notes}</td>
                    <td className="p-3">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLOR[p.status] || STATUS_COLOR.IDEA}`}>
                        {STATUS_LABEL[p.status] || p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-medium mb-3">Banco de ideas de reserva</h2>
        {ideaBank.length === 0 ? (
          <div className="card p-8 text-center text-slate-500">Sin ideas de reserva todavía.</div>
        ) : (
          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs text-slate-500">
                <tr>
                  <th className="p-3">Prioridad</th>
                  <th className="p-3">Línea editorial</th>
                  <th className="p-3">Idea</th>
                  <th className="p-3">Hook</th>
                  <th className="p-3">Ejecución</th>
                  <th className="p-3">Cuándo usarla</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ideaBank.map((i) => (
                  <tr key={i.id}>
                    <td className="p-3">{i.priority}</td>
                    <td className="p-3">{i.family}</td>
                    <td className="p-3 font-medium">{i.idea}</td>
                    <td className="p-3 text-slate-500">{i.hook}</td>
                    <td className="p-3 max-w-xs text-slate-500">{i.execution}</td>
                    <td className="p-3 text-slate-500">{i.whenToUse}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
