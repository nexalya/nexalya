// Diagnóstico de solo lectura: no modifica nada en la base de datos.
// Recorre TODOS los clientes y, para cada uno, comprueba:
//   - si tiene algún plan de contenido IA generado (plan_batches/plan_items)
//   - qué fechas cubre ese plan, y si hay huecos (días sueltos que faltan)
//     dentro del rango que el propio plan dice cubrir
//   - qué fechas tiene realmente en el calendario (content_items), y si
//     hay huecos ahí también
//   - fichas del plan que deberían tener una publicación real enlazada
//     (contentItemId) y no la tienen, o que apuntan a una publicación que
//     ya no existe (borrada a mano después)
//
// Guarda el resultado en data/diagnostico-plan.json (esa carpeta ya está
// excluida de git) y también lo imprime por pantalla.
//
// Uso:  npx tsx --env-file=.env.local scripts/diagnose-plan-gaps.ts

import { createClient } from "@libsql/client";
import { writeFileSync, mkdirSync } from "node:fs";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;
if (!url) throw new Error("Falta TURSO_DATABASE_URL en .env.local");
const db = createClient({ url, authToken });

const madridDateFmt = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/Madrid",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

function toMadridDateKey(iso: string): string {
  return madridDateFmt.format(new Date(iso));
}

function dateRangeGaps(sortedDateKeys: string[]): string[] {
  if (sortedDateKeys.length < 2) return [];
  const have = new Set(sortedDateKeys);
  const start = new Date(sortedDateKeys[0] + "T00:00:00Z");
  const end = new Date(sortedDateKeys[sortedDateKeys.length - 1] + "T00:00:00Z");
  const gaps: string[] = [];
  for (let d = new Date(start); d.getTime() <= end.getTime(); d.setUTCDate(d.getUTCDate() + 1)) {
    const key = d.toISOString().slice(0, 10);
    if (!have.has(key)) gaps.push(key);
  }
  return gaps;
}

async function main() {
  const clientsRs = await db.execute(`SELECT id, name, planPeriodDays, lastPlanGeneratedAt FROM clients ORDER BY name`);
  const clients = clientsRs.rows as unknown as {
    id: string;
    name: string;
    planPeriodDays: number | null;
    lastPlanGeneratedAt: string | null;
  }[];

  const report: Record<string, unknown> = { generatedAt: new Date().toISOString(), clients: [] as unknown[] };
  const clientsOut = report.clients as unknown[];

  for (const client of clients) {
    const batchesRs = await db.execute({
      sql: `SELECT id, periodDays, trendsSummary, createdAt FROM plan_batches WHERE clientId = ? ORDER BY createdAt DESC`,
      args: [client.id],
    });
    const batches = batchesRs.rows as unknown as { id: string; periodDays: number; trendsSummary: string | null; createdAt: string }[];

    const planItemsRs = await db.execute({
      sql: `SELECT id, planBatchId, date, day, format, topic, status, contentItemId FROM plan_items WHERE clientId = ? ORDER BY date ASC`,
      args: [client.id],
    });
    const planItems = planItemsRs.rows as unknown as {
      id: string;
      planBatchId: string | null;
      date: string;
      day: string | null;
      format: string | null;
      topic: string | null;
      status: string;
      contentItemId: string | null;
    }[];

    const contentRs = await db.execute({
      sql: `SELECT id, title, scheduledAt, status FROM content_items WHERE clientId = ? ORDER BY scheduledAt ASC`,
      args: [client.id],
    });
    const contentItems = contentRs.rows as unknown as { id: string; title: string; scheduledAt: string; status: string }[];

    const contentIds = new Set(contentItems.map((c) => c.id));

    const planDateKeys = Array.from(new Set(planItems.map((p) => p.date))).sort();
    const planGaps = dateRangeGaps(planDateKeys);

    const contentDateKeys = Array.from(new Set(contentItems.map((c) => toMadridDateKey(c.scheduledAt)))).sort();
    const contentGaps = dateRangeGaps(contentDateKeys);

    const planItemsMissingContent = planItems
      .filter((p) => p.status === "SCHEDULED" && !p.contentItemId)
      .map((p) => ({ id: p.id, date: p.date, format: p.format, topic: p.topic }));

    const planItemsWithBrokenLink = planItems
      .filter((p) => p.contentItemId && !contentIds.has(p.contentItemId))
      .map((p) => ({ id: p.id, date: p.date, format: p.format, topic: p.topic, contentItemId: p.contentItemId }));

    clientsOut.push({
      clientId: client.id,
      name: client.name,
      planPeriodDays: client.planPeriodDays,
      lastPlanGeneratedAt: client.lastPlanGeneratedAt,
      planBatches: batches.map((b) => ({ id: b.id, createdAt: b.createdAt, periodDays: b.periodDays, trendsSummary: b.trendsSummary })),
      planItemsCount: planItems.length,
      planDateRange: planDateKeys.length ? { first: planDateKeys[0], last: planDateKeys[planDateKeys.length - 1] } : null,
      planDateKeys,
      planGaps,
      planItemsMissingContent,
      planItemsWithBrokenLink,
      contentItemsCount: contentItems.length,
      contentDateRange: contentDateKeys.length ? { first: contentDateKeys[0], last: contentDateKeys[contentDateKeys.length - 1] } : null,
      contentUniqueDaysCount: contentDateKeys.length,
      contentDateKeys,
      contentGaps,
    });
  }

  mkdirSync("data", { recursive: true });
  const outPath = "data/diagnostico-plan.json";
  writeFileSync(outPath, JSON.stringify(report, null, 2));
  console.log(`\n✓ Diagnóstico guardado en ${outPath}\n`);
  console.log(JSON.stringify(report, null, 2));
}

main().catch((err) => {
  console.error("✗ ERROR:", err);
  process.exit(1);
});
