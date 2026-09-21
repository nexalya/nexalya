import { NextRequest, NextResponse } from "next/server";
import {
  getClient,
  updateClient,
  listPlanItems,
  listIdeaBank,
  listContentItems,
  getLatestPlanBatch,
  createPlanBatch,
  createPlanItem,
  updatePlanItem,
  createContentItem,
  createIdeaBankItem,
  deleteIdeaPlanItemsForClient,
  userCanAccessClient,
} from "@/lib/db-turso";
import { generateContentPlan, madridScheduledAt, defaultHourForFormat } from "@/lib/ai";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  const { id } = await params;
  const client = await getClient(id);
  if (!client) {
    return NextResponse.json({ error: "Cliente no encontrado." }, { status: 404 });
  }
  if (!await userCanAccessClient(id, user.id)) {
    return NextResponse.json({ error: "No tienes acceso a este cliente." }, { status: 403 });
  }

  const planItems = await listPlanItems(id);
  const ideaBank = await listIdeaBank(id);
  const latestBatch = await getLatestPlanBatch(id);

  const periodDays = client.planPeriodDays || 30;
  const daysSinceGenerated = client.lastPlanGeneratedAt
    ? Math.floor((Date.now() - new Date(client.lastPlanGeneratedAt).getTime()) / 86400000)
    : null;
  const isDue = daysSinceGenerated === null || daysSinceGenerated >= periodDays;

  return NextResponse.json({ planItems, ideaBank, latestBatch, daysSinceGenerated, isDue, periodDays });
}

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  const { id } = await params;
  const client = await getClient(id);
  if (!client) {
    return NextResponse.json({ error: "Cliente no encontrado." }, { status: 404 });
  }
  if (!await userCanAccessClient(id, user.id)) {
    return NextResponse.json({ error: "No tienes acceso a este cliente." }, { status: 403 });
  }

  try {
    const recentPlanItems = await listPlanItems(id);
    const recentIdeas = await listIdeaBank(id);
    // Publicaciones reales (publicadas de verdad, con o sin métricas ya
    // rellenas) de este cliente, para que el plan nuevo tenga en cuenta
    // qué funcionó y qué no en vez de proponer a ciegas cada vez.
    const recentPublishedItems = (await listContentItems({ clientId: id })).filter((i) => i.status === "PUBLISHED");
    const generated = await generateContentPlan(client, { recentPlanItems, recentIdeas, recentPublishedItems });

    const batch = await createPlanBatch({
      clientId: id,
      periodDays: client.planPeriodDays || 30,
      trendsSummary: generated.trendsSummary,
      model: generated.model,
    });

    await deleteIdeaPlanItemsForClient(id);
    for (const item of generated.plan) {
      const planItem = await createPlanItem({
        clientId: id,
        planBatchId: batch.id,
        date: item.date,
        day: item.day,
        format: item.format,
        family: item.family,
        topic: item.topic,
        objective: item.objective,
        kpi: item.kpi,
        keyword: item.keyword,
        notes: item.notes,
        status: "IDEA",
      });

      // Cada fila del plan se convierte directamente en un borrador real
      // en el calendario (no se queda solo en la tabla de temas), con
      // texto ya redactado por la IA: así cada mes el equipo revisa y
      // pone la foto/vídeo real en vez de crear cada publicación a mano
      // desde cero. La fila del plan queda enlazada al borrador
      // (contentItemId) y pasa de "Idea" a "Programada".
      const isReel = (item.format || "").toLowerCase().includes("reel");
      const caption =
        item.caption ||
        [item.topic, item.objective ? `Objetivo: ${item.objective}` : null, item.notes]
          .filter(Boolean)
          .join("\n\n");

      const contentItem = await createContentItem({
        clientId: id,
        title: item.topic || item.family || "Publicación sin título",
        caption,
        mediaUrl: `https://picsum.photos/seed/plan-${planItem.id}/600/600`,
        mediaType: isReel ? "VIDEO" : "IMAGE",
        platform: "INSTAGRAM",
        scheduledAt: madridScheduledAt(item.date, defaultHourForFormat(item.format)),
        status: "DRAFT",
        productionNotes: item.production ? JSON.stringify({ format: item.format, ...item.production }) : null,
      });

      await updatePlanItem(planItem.id, { status: "SCHEDULED", contentItemId: contentItem.id });
    }
    for (const idea of generated.ideas) {
      await createIdeaBankItem({
        clientId: id,
        planBatchId: batch.id,
        priority: idea.priority,
        family: idea.family,
        idea: idea.idea,
        hook: idea.hook,
        execution: idea.execution,
        resources: idea.resources,
        duration: idea.duration,
        objective: idea.objective,
        whenToUse: idea.whenToUse,
      });
    }

    await updateClient(id, { lastPlanGeneratedAt: new Date().toISOString() });

    return NextResponse.json({ ok: true, batch });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
