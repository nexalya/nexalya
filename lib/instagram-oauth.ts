/**
 * Conexión de Instagram con un clic ("Iniciar sesión con Instagram"), en
 * vez de generar el token a mano en Meta for Developers y pegarlo.
 *
 * Flujo: Nexalya manda al cliente a instagram.com/oauth/authorize → el
 * cliente entra con su cuenta profesional y pulsa "Permitir" → Instagram
 * vuelve a /api/instagram/oauth/callback con un `code` → se cambia por un
 * token de larga duración (60 días, la sincronización lo renueva sola) y
 * se guarda en el cliente.
 *
 * Solo se activa si existen INSTAGRAM_APP_ID e INSTAGRAM_APP_SECRET (los de
 * la app de Meta, producto Instagram > "Configuración de la API con el
 * inicio de sesión de Instagram"). Mientras la app esté en modo desarrollo
 * solo pueden conectarse las cuentas añadidas como tester; cuando Meta
 * apruebe la revisión, cualquier cuenta profesional.
 *
 * En Meta hay que dar de alta como "URI de redireccionamiento de OAuth"
 * exactamente: <URL del sitio>/api/instagram/oauth/callback
 */

import { createHmac, timingSafeEqual } from "node:crypto";

const GRAPH_API_VERSION = "v21.0";
// Solo lectura: perfil básico y métricas. No se pide permiso para publicar.
const SCOPES = ["instagram_business_basic", "instagram_business_manage_insights"];
const INVITE_DAYS = 14;
const STATE_MINUTES = 30;

export function isInstagramOAuthConfigured(): boolean {
  return !!process.env.INSTAGRAM_APP_ID && !!process.env.INSTAGRAM_APP_SECRET;
}

function secret(): string {
  const s = process.env.INSTAGRAM_APP_SECRET;
  if (!s) throw new Error("Falta INSTAGRAM_APP_SECRET.");
  return s;
}

// ---------- tokens firmados (enlace de invitación y "state" de OAuth) ----------
// No hace falta guardarlos en la base de datos: llevan dentro el cliente y
// la caducidad, firmados con el App Secret para que nadie pueda fabricar
// uno para otro cliente.

type Signed = { c: string; exp: number; k: "invite" | "state"; from?: "invite" | "app" };

function sign(payload: Signed): string {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const mac = createHmac("sha256", secret()).update(body).digest("base64url");
  return `${body}.${mac}`;
}

function verify(token: string, kind: Signed["k"]): Signed | null {
  const [body, mac] = token.split(".");
  if (!body || !mac) return null;
  const expected = createHmac("sha256", secret()).update(body).digest("base64url");
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString()) as Signed;
    if (payload.k !== kind || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export function createInviteToken(clientId: string): { token: string; expiresAt: string } {
  const exp = Date.now() + INVITE_DAYS * 86400000;
  return { token: sign({ c: clientId, exp, k: "invite" }), expiresAt: new Date(exp).toISOString() };
}

export function readInviteToken(token: string): { clientId: string } | null {
  const p = verify(token, "invite");
  return p ? { clientId: p.c } : null;
}

export function readState(state: string): { clientId: string; from: "invite" | "app" } | null {
  const p = verify(state, "state");
  return p ? { clientId: p.c, from: p.from ?? "app" } : null;
}

// ---------- OAuth ----------

/** URL del sitio: APP_URL si está definida (recomendado en producción), si no la de la petición. */
export function siteUrl(requestOrigin: string): string {
  return (process.env.APP_URL || requestOrigin).replace(/\/$/, "");
}

export function redirectUri(requestOrigin: string): string {
  return `${siteUrl(requestOrigin)}/api/instagram/oauth/callback`;
}

export function buildAuthorizeUrl(clientId: string, from: "invite" | "app", requestOrigin: string): string {
  const state = sign({ c: clientId, exp: Date.now() + STATE_MINUTES * 60000, k: "state", from });
  const params = new URLSearchParams({
    client_id: process.env.INSTAGRAM_APP_ID!,
    redirect_uri: redirectUri(requestOrigin),
    response_type: "code",
    scope: SCOPES.join(","),
    state,
  });
  return `https://www.instagram.com/oauth/authorize?${params}`;
}

export type ConnectedAccount = { accessToken: string; igUserId: string; username: string | null };

/** Cambia el `code` de la vuelta de Instagram por un token de 60 días y los datos de la cuenta. */
export async function exchangeCodeForAccount(code: string, requestOrigin: string): Promise<ConnectedAccount> {
  // 1) code → token corto (1 h)
  const form = new URLSearchParams({
    client_id: process.env.INSTAGRAM_APP_ID!,
    client_secret: secret(),
    grant_type: "authorization_code",
    redirect_uri: redirectUri(requestOrigin),
    // Instagram a veces añade "#_" al final del code en la redirección.
    code: code.replace(/#_$/, ""),
  });
  const shortRes = await fetch("https://api.instagram.com/oauth/access_token", { method: "POST", body: form, cache: "no-store" });
  const shortData = await shortRes.json();
  // Según la versión, la respuesta viene plana o dentro de data[0].
  const short = (Array.isArray(shortData.data) ? shortData.data[0] : shortData) as { access_token?: string };
  if (!shortRes.ok || !short?.access_token) {
    throw new Error(shortData?.error_message ?? shortData?.error?.message ?? "Instagram no aceptó la autorización.");
  }

  // 2) token corto → token largo (60 días)
  const longParams = new URLSearchParams({
    grant_type: "ig_exchange_token",
    client_secret: secret(),
    access_token: short.access_token,
  });
  const longRes = await fetch(`https://graph.instagram.com/access_token?${longParams}`, { cache: "no-store" });
  const longData = await longRes.json();
  if (!longRes.ok || !longData.access_token) {
    throw new Error(longData?.error?.message ?? "No se pudo obtener el token de larga duración.");
  }
  const accessToken = longData.access_token as string;

  // 3) ID de la cuenta profesional (el que usan /media e /insights) y @usuario
  const meRes = await fetch(`https://graph.instagram.com/${GRAPH_API_VERSION}/me?fields=user_id,username`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  const me = await meRes.json();
  if (!meRes.ok || !(me.user_id || me.id)) {
    throw new Error(me?.error?.message ?? "No se pudieron leer los datos de la cuenta de Instagram.");
  }
  return { accessToken, igUserId: String(me.user_id ?? me.id), username: me.username ?? null };
}
