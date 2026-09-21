import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  createSession,
  createUser,
  deleteSession,
  getSessionUser,
  getUserByEmailWithHash,
  type PublicUser,
} from "@/lib/db-turso";

// Sesión guardada en la base de datos (no un JWT sin estado): así una
// contraseña cambiada o una sesión borrada surte efecto al instante, y no
// necesitamos Edge Middleware (node:sqlite no funciona ahí). Cada página o
// ruta protegida llama a requireUser() al principio.

export const SESSION_COOKIE = "nexalya_session";
const SESSION_DAYS = 30;

function sessionExpiry(): string {
  return new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000).toISOString();
}

// ---- contraseñas ----
// scrypt (nativo de Node, sin dependencias nuevas). Formato guardado:
// "saltHex:hashHex".
export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 64);
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [saltHex, hashHex] = stored.split(":");
  if (!saltHex || !hashHex) return false;
  const salt = Buffer.from(saltHex, "hex");
  const expected = Buffer.from(hashHex, "hex");
  const actual = scryptSync(password, salt, expected.length);
  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}

// Genera una contraseña temporal legible (para compartir por chat al crear
// una cuenta nueva) — no confundir con un token de sesión.
export function generateTempPassword(): string {
  return randomBytes(9).toString("base64url");
}

// ---- cuentas ----

export async function registerUser(data: { name: string; email: string; password: string }): Promise<PublicUser> {
  return await createUser({ name: data.name, email: data.email, passwordHash: hashPassword(data.password) });
}

export async function verifyLogin(email: string, password: string): Promise<PublicUser | null> {
  const user = await getUserByEmailWithHash(email);
  if (!user) return null;
  if (!verifyPassword(password, user.passwordHash)) return null;
  const { passwordHash: _passwordHash, ...publicUser } = user;
  return publicUser;
}

// ---- sesiones (cookie HTTP-only) ----
// Solo se puede escribir la cookie desde un Route Handler o Server Action,
// así que startSession/endSession se llaman desde app/api/auth/*.

export async function startSession(userId: string) {
  const session = await createSession(userId, sessionExpiry());
  const store = await cookies();
  store.set(SESSION_COOKIE, session.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(session.expiresAt),
  });
}

export async function endSession() {
  const store = await cookies();
  const sessionId = store.get(SESSION_COOKIE)?.value;
  if (sessionId) await deleteSession(sessionId);
  store.delete(SESSION_COOKIE);
}

// Lee la sesión actual sin redirigir — para páginas que se comportan
// distinto si hay usuario o no (p.ej. el layout, o /login para no volver a
// pedir credenciales si ya hay sesión).
export async function getCurrentUser(): Promise<PublicUser | null> {
  const store = await cookies();
  const sessionId = store.get(SESSION_COOKIE)?.value;
  if (!sessionId) return null;
  return (await getSessionUser(sessionId)) ?? null;
}

// Para usar al principio de cualquier página o ruta protegida: si no hay
// sesión válida, manda a /login.
export async function requireUser(): Promise<PublicUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}
