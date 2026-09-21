// Los clientes creados antes de tener cuentas de usuario se guardaron sin
// "dueño" (ownerId NULL), y el código los trata como "de todo el equipo":
// los ve cualquier usuario, sin poder restringirlos. Este script asigna
// esos clientes al administrador indicado, para que a partir de ahí pueda
// decidir con quién se comparte cada uno desde la propia app (botón
// "Compartir" en la ficha de cada cliente).
//
// Uso:  npx tsx --env-file=.env.local scripts/claim-clients.ts tu@email.com
import { createClient as createLibsqlClient } from "@libsql/client";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;
if (!url) throw new Error("Falta TURSO_DATABASE_URL en .env.local");

const email = process.argv[2];
if (!email) {
  console.error("Uso: npx tsx --env-file=.env.local scripts/claim-clients.ts tu@email.com");
  process.exit(1);
}

const db = createLibsqlClient({ url, authToken });

async function main() {
  const userRs = await db.execute({
    sql: `SELECT id, name, email FROM users WHERE email = ?`,
    args: [email],
  });
  const user = userRs.rows[0] as unknown as { id: string; name: string; email: string } | undefined;
  if (!user) {
    console.error(`✗ No existe ningún usuario con el email "${email}". Usuarios disponibles:`);
    const all = await db.execute(`SELECT email FROM users`);
    for (const row of all.rows as unknown as { email: string }[]) console.error(`  - ${row.email}`);
    process.exit(1);
  }

  const orphans = await db.execute(`SELECT id, name FROM clients WHERE ownerId IS NULL`);
  const rows = orphans.rows as unknown as { id: string; name: string }[];

  if (rows.length === 0) {
    console.log("No hay clientes sin dueño. No hace falta cambiar nada.");
    return;
  }

  console.log(`Asignando ${rows.length} cliente(s) a ${user.name} (${user.email}):`);
  for (const c of rows) {
    await db.execute({
      sql: `UPDATE clients SET ownerId = ? WHERE id = ?`,
      args: [user.id, c.id],
    });
    console.log(`  ✓ ${c.name}`);
  }

  console.log(
    "\nListo. Esos clientes ya no son visibles para todo el mundo: solo para ti y para" +
      " quien tú decidas compartirlos, desde el botón \"Compartir\" en la ficha de cada cliente."
  );
}

main().catch((err) => {
  console.error("✗ ERROR:", err);
  process.exit(1);
});
