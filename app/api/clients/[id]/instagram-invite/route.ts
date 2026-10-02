import { NextRequest, NextResponse } from "next/server";
import { getClient, userCanAccessClient } from "@/lib/db-turso";
import { getCurrentUser } from "@/lib/auth";
import { createInviteToken, isInstagramOAuthConfigured, siteUrl } from "@/lib/instagram-oauth";

// Genera el enlace que se manda al cliente (WhatsApp, email...) para que
// conecte su Instagram él mismo desde el móvil, sin cuenta en Nexalya.
// Caduca a los 14 días; se puede generar otro cuando haga falta.
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  const { id } = await params;
  if (!(await getClient(id)) || !(await userCanAccessClient(id, user.id))) {
    return NextResponse.json({ error: "No tienes acceso a este cliente." }, { status: 403 });
  }
  if (!isInstagramOAuthConfigured()) {
    return NextResponse.json({ error: "La conexión con Instagram todavía no está configurada." }, { status: 503 });
  }
  const { token, expiresAt } = createInviteToken(id);
  return NextResponse.json({ url: `${siteUrl(req.nextUrl.origin)}/conectar/${token}`, expiresAt });
}
