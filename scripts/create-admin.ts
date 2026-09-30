// Crea (o resetea la contraseña de) una cuenta de Nexalya, sin tocar
// ningún otro dato. Es seguro ejecutarlo en cualquier momento: si el email
// ya existe, solo le asigna una contraseña temporal nueva (por si la
// primera se ha perdido o no llegó bien) en vez de fallar.
//
// Uso:
//   npx tsx --env-file=.env.local scripts/create-admin.ts "Conchi" conchi@innovapro.es
//
// (antes este script usaba lib/db.ts, la base de datos SQLite local que se
// dejó de usar al migrar a Turso — así que un reset con la versión antigua
// no tenía ningún efecto en la web real. Corregido para usar lib/db-turso,
// la misma base de datos que usa nexalya.es.)

import { createUser, getUserByEmailWithHash, updateUserPassword } from "../lib/db-turso";
import { hashPassword, generateTempPassword } from "../lib/auth";

const [, , name, email] = process.argv;

if (!email) {
  console.error('Uso: npx tsx --env-file=.env.local scripts/create-admin.ts "Nombre" email@dominio.com');
  process.exit(1);
}

async function main() {
  const tempPassword = generateTempPassword();
  const existing = await getUserByEmailWithHash(email);

  if (existing) {
    await updateUserPassword(existing.id, hashPassword(tempPassword));
    console.log(`Ya existía una cuenta para ${email}. Contraseña temporal nueva asignada.`);
  } else {
    if (!name) {
      console.error('Esa cuenta no existe todavía — para crearla hace falta también el nombre:');
      console.error('  npx tsx --env-file=.env.local scripts/create-admin.ts "Nombre" email@dominio.com');
      process.exit(1);
    }
    await createUser({ name, email, passwordHash: hashPassword(tempPassword) });
    console.log(`Cuenta creada para ${name} <${email}>.`);
  }

  console.log(`\nEmail: ${email}`);
  console.log(`Contraseña temporal: ${tempPassword}`);
  console.log(`\nGuárdala ahora: no se puede volver a ver (solo cambiarla, desde "Usuarios" dentro de la app).`);
}

main().catch((err) => {
  console.error("✗ ERROR:", err);
  process.exit(1);
});
