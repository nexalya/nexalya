// El estado "Diseño terminado" (READY) se añadió esta sesión, así que
// ningún contenido puede haberlo recibido todavía a propósito desde la
// app — si alguna pieza ya tenía guardado ese valor en la base de datos
// (de antes, con otro significado, o de una importación externa), ahora
// se muestra como "Diseño terminado" aunque en realidad no lo esté.
//
// Este script pone en "Pendiente" (DRAFT) TODAS las piezas que estén en
// READY, de TODOS los clientes, y lista cada una por consola para que el
// equipo pueda revisar y volver a marcar a mano (con el desplegable de
// estado) las que sí estén realmente terminadas. No toca ningún otro
// estado (Programado, Publicado, Fallido se quedan tal cual).
//
// Uso:  npx tsx --env-file=.env.local scripts/reset-ready-status.ts

import { createClient } from "@libsql/client";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;
if (!url) throw new Error("Falta TURSO_DATABASE_URL en .env.local");
const db = createClient({ url, authToken });

async function main() {
  const rs = await db.execute({
    sql: `SELECT ci.id, ci.title, ci.scheduledAt, c.name as clientName
          FROM content_items ci JOIN clients c ON c.id = ci.clientId
          WHERE ci.status = 'READY'
          ORDER BY c.name, ci.scheduledAt`,
    args: [],
  });
  const rows = rs.rows as unknown as { id: string; title: string; scheduledAt: string; clientName: string }[];

  if (rows.length === 0) {
    console.log('No hay ninguna pieza en estado "Diseño terminado". No hace falta cambiar nada.');
    return;
  }

  console.log(`Pasando a "Pendiente" ${rows.length} pieza(s) que estaban en "Diseño terminado":`);
  for (const r of rows) {
    console.log(`  - [${r.clientName}] ${r.scheduledAt.slice(0, 10)} · ${r.title}`);
    await db.execute({ sql: `UPDATE content_items SET status = 'DRAFT' WHERE id = ?`, args: [r.id] });
  }

  console.log(
    '\nListo. Todas han vuelto a "Pendiente". A partir de ahora, márcalas a mano como "Diseño terminado" ' +
      "desde el desplegable de cada pieza según se vaya terminando el diseño de verdad."
  );
}

main().catch((err) => {
  console.error("✗ ERROR:", err);
  process.exit(1);
});
