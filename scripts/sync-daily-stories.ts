// Crea, para CUALQUIER cliente (Innovapro, Tulaserclinic, Capelino y
// cualquiera que se añada después), una ficha independiente de tipo
// "Historia" por cada día en el que una pieza de feed (Reel, Carrusel,
// Post) lleva su propia story de apoyo guardada dentro de su guion
// (productionNotes.stories) — hasta ahora esa story solo se veía
// desplegando el guion de la pieza de feed ("Guion y rodaje"), no
// aparecía como una ficha propia en la pestaña "Historias" de ese
// cliente. Este script recorre TODO el contenido de TODOS los clientes,
// y por cada pieza con stories de apoyo embebidas crea (o actualiza) una
// ficha de Historia independiente, para que cada cliente tenga en su
// pestaña "Historias" el día a día completo de sus stories, no solo las
// que ya tenían ficha propia.
//
// No toca las piezas de feed originales (siguen teniendo su guion
// completo igual que antes, con la sección "Stories diarias" al final) —
// solo AÑADE la ficha independiente a partir de esos mismos datos.
//
// Es SEGURO de ejecutar más de una vez: cada ficha de Historia que crea
// este script queda marcada por dentro con el id de la pieza de feed de
// la que viene (productionNotes.sourceItemId); si se vuelve a ejecutar
// (por ejemplo porque se ha actualizado el guion de una pieza), borra
// primero la versión anterior de esa misma ficha de Historia — salvo que
// ya esté marcada como "Publicado", esa nunca se toca — y la sustituye
// por la actualizada. Nunca toca las piezas de feed en sí.
//
// Uso:  npx tsx --env-file=.env.local scripts/sync-daily-stories.ts

import { createClient } from "@libsql/client";
import { randomUUID } from "node:crypto";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;
if (!url) throw new Error("Falta TURSO_DATABASE_URL en .env.local");
const db = createClient({ url, authToken });

type Row = {
  id: string;
  clientId: string;
  title: string;
  scheduledAt: string;
  status: string;
  platform: string;
  productionNotes: string | null;
};

type StoryStep = Record<string, unknown> & {
  function?: string | null;
  onScreenText?: string | null;
  notes?: string | null;
};

function firstNonEmpty(...values: (string | null | undefined)[]): string | null {
  for (const v of values) {
    if (v && v.trim()) return v.trim();
  }
  return null;
}

async function main() {
  const allRs = await db.execute({
    sql: `SELECT id, clientId, title, scheduledAt, status, platform, productionNotes FROM content_items`,
    args: [],
  });
  const allItems = allRs.rows as unknown as Row[];

  // Piezas de feed con stories de apoyo embebidas (candidatas a generar ficha).
  const sources: { item: Row; steps: StoryStep[]; kpi: string | null }[] = [];
  for (const item of allItems) {
    if (!item.productionNotes) continue;
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(item.productionNotes);
    } catch {
      continue;
    }
    if (parsed.format === "STORY") continue; // ya es una ficha de Historia
    const steps = parsed.stories;
    if (!Array.isArray(steps) || steps.length === 0) continue;
    sources.push({ item, steps: steps as StoryStep[], kpi: (parsed.kpi as string | undefined) ?? null });
  }

  console.log(`Encontradas ${sources.length} pieza(s) de feed con stories de apoyo embebidas.`);
  if (sources.length === 0) {
    console.log("Nada que sincronizar.");
    return;
  }

  // Borra las fichas de Historia generadas anteriormente para estas mismas
  // piezas de origen (por sourceItemId), salvo las ya "Publicado".
  const sourceIds = new Set(sources.map((s) => s.item.id));
  let removed = 0;
  for (const item of allItems) {
    if (!item.productionNotes) continue;
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(item.productionNotes);
    } catch {
      continue;
    }
    if (parsed.format !== "STORY") continue;
    const sourceItemId = parsed.sourceItemId as string | undefined;
    if (!sourceItemId || !sourceIds.has(sourceItemId)) continue;
    if (item.status === "PUBLISHED") continue;
    await db.execute({ sql: `DELETE FROM content_items WHERE id = ?`, args: [item.id] });
    removed++;
  }
  if (removed > 0) console.log(`✓ Borradas ${removed} ficha(s) de Historia antiguas para sustituirlas por las actualizadas.`);

  let inserted = 0;
  for (const { item, steps, kpi } of sources) {
    const firstFunction = firstNonEmpty(...steps.map((s) => s.function ?? null));
    const title = firstFunction ?? `${item.title} — Story`;
    const caption = steps
      .map((s) => (s.onScreenText ?? "").toString().trim())
      .filter(Boolean)
      .join(" → ");

    const productionNotes = {
      format: "STORY",
      concept: title,
      kpi,
      approval: "Pendiente",
      steps,
      // Marca interna para poder actualizar/borrar esta ficha si se
      // vuelve a ejecutar el script — no se muestra en ningún sitio.
      sourceItemId: item.id,
    };

    const id = randomUUID();
    const ts = new Date().toISOString();
    await db.execute({
      sql: `INSERT INTO content_items
        (id, clientId, title, caption, mediaUrl, mediaType, platform, scheduledAt, status, publishedAt, errorMessage, productionNotes, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, NULL, ?, ?, ?)`,
      args: [
        id,
        item.clientId,
        title,
        caption || title,
        `https://picsum.photos/seed/story-${item.id}/600/600`,
        "IMAGE",
        item.platform || "INSTAGRAM",
        item.scheduledAt,
        "DRAFT",
        JSON.stringify(productionNotes),
        ts,
        ts,
      ],
    });
    inserted++;
  }

  console.log(`✓ Creadas ${inserted} ficha(s) de Historia nuevas, una por cada día con story de apoyo.`);
  console.log('\nYa deberían verse en la pestaña "Historias" de cada cliente.');
}

main().catch((err) => {
  console.error("✗ ERROR:", err);
  process.exit(1);
});
