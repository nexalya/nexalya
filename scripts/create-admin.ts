// Crea (o resetea la contraseña de) la primera cuenta de Nexalya, sin tocar
// ningún otro dato. A diferencia de db:seed, este script NO borra clientes
// ni contenido — es seguro ejecutarlo en cualquier momento.
//
// Uso:
//   npx tsx scripts/create-admin.ts "Samuel" samuel@innovapro.es
//
// Si el email ya existe, se le asigna una contraseña temporal nueva (por
// si la primera se ha perdido) en vez de fallar.

import { getUserByEmailWithHash, createUser, updateUserPassword } from "../lib/db";
import { hashPassword, generateTempPassword } from "../lib/auth";

const [, , name, email] = process.argv;

if (!name || !email) {
  console.error('Uso: npx tsx scripts/create-admin.ts "Nombre" email@dominio.com');
  process.exit(1);
}

const tempPassword = generateTempPassword();
const existing = getUserByEmailWithHash(email);

if (existing) {
  updateUserPassword(existing.id, hashPassword(tempPassword));
  console.log(`Ya existía una cuenta para ${email}. Contraseña temporal nueva asignada.`);
} else {
  createUser({ name, email, passwordHash: hashPassword(tempPassword) });
  console.log(`Cuenta creada para ${name} <${email}>.`);
}

console.log(`\nEmail: ${email}`);
console.log(`Contraseña temporal: ${tempPassword}`);
console.log(`\nGuárdala ahora: no se puede volver a ver (solo cambiarla, desde "Usuarios" dentro de la app).`);
