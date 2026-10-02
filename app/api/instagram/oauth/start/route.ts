import { NextRequest, NextResponse } from "next/server";
import { getClient, userCanAccessClient } from "@/lib/db-turso";
import { getCurrentUser } from "@/lib/auth";
import { buildAuthorizeUrl, isInstagramOAuthConfigured, readInviteToken, siteUrl } from "@/lib/instagram-oauth";

/**
 * Empieza la conexión con Instagram y redirige a la pantalla de "Permitir"
 * de Instagram. Dos formas de llegar:
 *  - ?invite=<token>: desde el enlace de invitación que se manda al
 *    cliente (no necesita sesión en Nexalya).
 *  - ?clientId=<id>: desde el botón de la ficha del cliente (equipo con
 *    sesión iniciada).
 */
export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin;
  if (!isInstagramOAuthConfigured()) {
    return NextResponse.json({ error: "La conexión con Instagram todavía no está configurada." }, { status: 503 });
  }

  const invite = req.nextUrl.searchParams.get("invite");
  if (invite) {
    const parsed = readInviteToken(invite);
    if (!parsed || !(await getClient(parsed.clientId))) {
      return NextResponse.redirect(`${siteUrl(origin)}/conectar/resultado?error=enlace`);
    }
    return NextResponse.redirect(buildAuthorizeUrl(parsed.clientId, "invite", origin));
  }

  const clientId = req.nextUrl.searchParams.get("clientId");
  const user = await getCurrentUser();
  if (!user) return NextResponse.redirect(`${siteUrl(origin)}/login`);
  if (!clientId || !(await userCanAccessClient(clientId, user.id))) {
    return NextResponse.json({ error: "No tienes acceso a este cliente." }, { status: 403 });
  }
  return NextResponse.redirect(buildAuthorizeUrl(clientId, "app", origin));
}
