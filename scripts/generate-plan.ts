// Genera el plan de contenido IA para UN cliente, exactamente con la misma
// lógica que el botón "Generar plan" de la web (app/api/clients/[id]/plan/
// route.ts) — solo que se ejecuta desde tu Terminal en vez de desde el
// navegador, para poder correrlo cuando haga falta sin depender de que la
// sesión esté conectada a esa web.
//
// Crea un plan_batch nuevo, sus plan_items ("Calendario propuesto"), un
// borrador real en el calendario (content_items, en estado DRAFT) por cada
// fila del plan, y el banco de ideas de reserva — igual que si hubieras
// pulsado el botón en la pestaña "Plan de contenido IA".
//
// OJO: si el cliente ya tiene un plan, esto genera uno NUEVO por encima
// (no borra el calendario ya existente, pero sí añade contenido nuevo) —
// úsalo para clientes sin plan todavía, o cuando de verdad quieras
// renovar el plan de uno que ya lo tiene.
//
// Uso:  npx tsx --env-file=.env.local scripts/generate-plan.ts "Tulaserclinic"
// (el nombre puede ser parcial, no distingue mayúsculas/minúsculas; si hay
// más de una coincidencia, el script lista los clientes y para sin tocar
// nada)

import { createClient } from "@libsql/client";
import { generateContentPlan, madridScheduledAt, defaultHourForFormat } from "../lib/ai";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;
if (!url) throw new Error("Falta TURSO_DATABASE_URL en .env.local");
if (!process.env.ANTHROPIC_API_KEY) throw new Error("Falta ANTHROPIC_API_KEY en .env.local");
const db = createClient({ url, authToken });

const nameArg = process.argv[2];
if (!nameArg) {
  console.error('Uso: npx tsx --env-file=.env.local scripts/generate-plan.ts "<nombre del cliente>"');
  process.exit(1);
}

async function main() {
  const clientsRs = await db.execute(`SELECT * FROM clients`);
  const clients = clientsRs.rows as unknown as Record<string, unknown>[];
  const matches = clients.filter((c) => String(c.name).toLowerCase().includes(nameArg.toLowerCase()));

  if (matches.length === 0) {
    console.error(`No se encontró ningún cliente que contenga "${nameArg}". Clientes disponibles:`);
    for (const c of clients) console.error(` - ${c.name}`);
    process.exit(1);
  }
  if (matches.length > 1) {
    console.error(`Hay más de un cliente que coincide con "${nameArg}":`);
    for (const c of matches) console.error(` - ${c.name}`);
    console.error("Sé más específico.");
    process.exit(1);
  }

  const client = matches[0] as {
    id: string;
    name: string;
    planPeriodDays: number | null;
    sector: string | null;
    igHandle: string | null;
    website: string | null;
    brandBrief: string | null;
    targetAudience: string | null;
    competitors: string | null;
    avoidTopics: string | null;
    toneOfVoice: string | null;
    visualIdentity: string | null;
    contentPillars: string | null;
    notes: string | null;
  };

  console.log(`Generando plan para "${client.name}" (${client.id})…`);
  console.log("Esto llama a la IA y puede tardar 1-2 minutos.\n");

  const recentPlanItemsRs = await db.execute({
    sql: `SELECT * FROM plan_items WHERE clientId = ? ORDER BY date ASC`,
    args: [client.id],
  });
  const recentPlanItems = recentPlanItemsRs.rows as unknown[];

  const recentIdeasRs = await db.execute({
    sql: `SELECT * FROM idea_bank WHERE clientId = ? ORDER BY createdAt DESC`,
    args: [client.id],
  });
  const recentIdeas = recentIdeasRs.rows as unknown[];

  const recentPublishedRs = await db.execute({
    sql: `SELECT * FROM content_items WHERE clientId = ? AND status = 'PUBLISHED'`,
    args: [client.id],
  });
  const recentPublishedItems = recentPublishedRs.rows as unknown[];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const generated = await generateContentPlan(client as any, {
    recentPlanItems: recentPlanItems as any,
    recentIdeas: recentIdeas as any,
    recentPublishedItems: recentPublishedItems as any,
  });

  const batchId = crypto.randomUUID();
  const nowIso = new Date().toISOString();
  await db.execute({
    sql: `INSERT INTO plan_batches (id, clientId, periodDays, trendsSummary, model, createdAt) VALUES (?, ?, ?, ?, ?, ?)`,
    args: [batchId, client.id, client.planPeriodDays || 30, generated.trendsSummary ?? null, generated.model ?? null, nowIso],
  });

  // Igual que la ruta API: solo borra las filas de plan todavía en estado
  // "IDEA" (nunca las ya programadas/publicadas) antes de insertar las
  // nuevas.
  await db.execute({ sql: `DELETE FROM plan_items WHERE clientId = ? AND status = 'IDEA'`, args: [client.id] });

  let created = 0;
  for (const item of generated.plan) {
    const planItemId = crypto.randomUUID();
    await db.execute({
      sql: `INSERT INTO plan_items (id, clientId, planBatchId, date, day, format, family, topic, objective, kpi, keyword, notes, status, contentItemId, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'IDEA', NULL, ?, ?)`,
      args: [
        planItemId,
        client.id,
        batchId,
        item.date,
        item.day ?? null,
        item.format ?? null,
        item.family ?? null,
        item.topic ?? null,
        item.objective ?? null,
        item.kpi ?? null,
        item.keyword ?? null,
        item.notes ?? null,
        nowIso,
        nowIso,
      ],
    });

    const isReel = (item.format || "").toLowerCase().includes("reel");
    const caption =
      item.caption ||
      [item.topic, item.objective ? `Objetivo: ${item.objective}` : null, item.notes].filter(Boolean).join("\n\n");

    const contentItemId = crypto.randomUUID();
    await db.execute({
      sql: `INSERT INTO content_items
        (id, clientId, title, caption, mediaUrl, mediaType, platform, scheduledAt, status, publishedAt, errorMessage, productionNotes, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'DRAFT', NULL, NULL, ?, ?, ?)`,
      args: [
        contentItemId,
        client.id,
        item.topic || item.family || "Publicación sin título",
        caption || item.topic || "",
        `https://picsum.photos/seed/plan-${planItemId}/600/600`,
        isReel ? "VIDEO" : "IMAGE",
        "INSTAGRAM",
        madridScheduledAt(item.date, defaultHourForFormat(item.format)),
        item.production ? JSON.stringify({ format: item.format, ...item.production }) : null,
        nowIso,
        nowIso,
      ],
    });

    await db.execute({
      sql: `UPDATE plan_items SET status = 'SCHEDULED', contentItemId = ?, updatedAt = ? WHERE id = ?`,
      args: [contentItemId, new Date().toISOString(), planItemId],
    });
    created++;
  }

  for (const idea of generated.ideas) {
    await db.execute({
      sql: `INSERT INTO idea_bank (id, clientId, planBatchId, priority, family, idea, hook, execution, resources, duration, objective, whenToUse, createdAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        crypto.randomUUID(),
        client.id,
        batchId,
        idea.priority ?? null,
        idea.family ?? null,
        idea.idea ?? null,
        idea.hook ?? null,
        idea.execution ?? null,
        idea.resources ?? null,
        idea.duration ?? null,
        idea.objective ?? null,
        idea.whenToUse ?? null,
        nowIso,
      ],
    });
  }

  await db.execute({
    sql: `UPDATE clients SET lastPlanGeneratedAt = ?, updatedAt = ? WHERE id = ?`,
    args: [nowIso, nowIso, client.id],
  });

  console.log(`✓ Plan generado: ${created} publicación(es) propuesta(s) y ${generated.ideas.length} idea(s) de reserva.`);
  console.log(`✓ Ya deberían verse en "Plan de contenido IA" de ${client.name}.`);
}

main().catch((err) => {
  console.error("✗ ERROR:", err);
  process.exit(1);
});
