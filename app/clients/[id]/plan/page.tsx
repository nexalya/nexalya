import { notFound } from "next/navigation";
import { getClient, listPlanItems, listIdeaBank, getLatestPlanBatch, userCanAccessClient } from "@/lib/db-turso";
import { requireUser } from "@/lib/auth";
import ClientTabs from "@/components/ClientTabs";
import GeneratePlanButton from "@/components/GeneratePlanButton";
import ClientSettingsForm from "@/components/ClientSettingsForm";
import PlanMasterDetail from "@/components/PlanMasterDetail";
import IdeaBankMasterDetail from "@/components/IdeaBankMasterDetail";

export const dynamic = "force-dynamic";

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
          <PlanMasterDetail items={planItems} />
        )}
      </div>

      <div>
        <h2 className="text-lg font-medium mb-3">Banco de ideas de reserva</h2>
        {ideaBank.length === 0 ? (
          <div className="card p-8 text-center text-slate-500">Sin ideas de reserva todavía.</div>
        ) : (
          <IdeaBankMasterDetail items={ideaBank} />
        )}
      </div>
    </div>
  );
}
