// Migración de datos: copia todo lo que ya existe en la base de datos local
// (data/growth-os.db, node:sqlite) a Turso, preservando los IDs originales
// tal cual (para que las referencias entre tablas — content_items.clientId,
// plan_items.contentItemId, etc. — sigan siendo válidas). No modifica ni
// borra nada del archivo local: es una copia, no un "mover".
//
// No migra la tabla `sessions` a propósito: son sesiones de login vivas,
// no tiene sentido copiarlas — todo el mundo iniciará sesión de nuevo en
// la versión desplegada.
//
// Uso:  npx tsx --env-file=.env.local scripts/migrate-to-turso.ts
import { DatabaseSync } from "node:sqlite";
import { createClient } from "@libsql/client";
import path from "node:path";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;
if (!url) throw new Error("Falta TURSO_DATABASE_URL en .env.local");

const turso = createClient({ url, authToken });
const localDbPath = path.join(process.cwd(), "data", "growth-os.db");
const local = new DatabaseSync(localDbPath, { readOnly: true });

// Orden importante: cada tabla se inserta después de las que referencia
// por clave foránea (clients y users primero, sessions se omite).
const TABLES_IN_ORDER = [
  "users",
  "clients",
  "content_items",
  "plan_batches",
  "plan_items",
  "idea_bank",
  "follower_snapshots",
  "client_shares",
] as const;

async function migrateTable(table: string) {
  const columnsInfo = local.prepare(`PRAGMA table_info(${table})`).all() as unknown as { name: string }[];
  const columns = columnsInfo.map((c) => c.name);
  const rows = local.prepare(`SELECT * FROM ${table}`).all() as unknown as Record<string, unknown>[];

  if (rows.length === 0) {
    console.log(`  ${table}: 0 filas (nada que copiar)`);
    return;
  }

  const placeholders = columns.map(() => "?").join(", ");
  const sql = `INSERT OR IGNORE INTO ${table} (${columns.join(", ")}) VALUES (${placeholders})`;

  for (const row of rows) {
    const args = columns.map((c) => row[c] as string | number | null);
    await turso.execute({ sql, args });
  }
  console.log(`  ${table}: ${rows.length} filas copiadas`);
}

async function main() {
  console.log(`Leyendo base de datos local: ${localDbPath}`);
  console.log(`Copiando a Turso: ${url}\n`);

  for (const table of TABLES_IN_ORDER) {
    await migrateTable(table);
  }

  console.log("\n✓ Migración completada. La base de datos local NO se ha tocado.");
}

main()
  .catch((err) => {
    console.error("✗ ERROR durante la migración:", err);
    process.exit(1);
  })
  .finally(() => {
    local.close();
  });
