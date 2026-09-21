import { NextRequest, NextResponse } from "next/server";
import { getContentItem, updateContentItem, deleteContentItem, userCanAccessClient } from "@/lib/db-turso";
import { getCurrentUser } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  const { id } = await params;
  const existing = await getContentItem(id);
  if (!existing) return NextResponse.json({ error: "No encontrado." }, { status: 404 });
  if (!await userCanAccessClient(existing.clientId, user.id)) {
    return NextResponse.json({ error: "No tienes acceso a este cliente." }, { status: 403 });
  }
  const body = await req.json();

  // Solo tocamos scheduledAt cuando el body lo trae: antes esta ruta lo
  // ponía siempre a "undefined" si no venía en la petición, así que un
  // PATCH que solo cambiaba el estado (por ejemplo) borraba la fecha
  // programada sin querer.
  const patch: Record<string, unknown> = { ...body };
  if (body.scheduledAt) {
    patch.scheduledAt = new Date(body.scheduledAt).toISOString();
  } else {
    delete patch.scheduledAt;
  }

  const item = await updateContentItem(id, patch);
  return NextResponse.json(item);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  const { id } = await params;
  const existing = await getContentItem(id);
  if (!existing) return NextResponse.json({ error: "No encontrado." }, { status: 404 });
  if (!await userCanAccessClient(existing.clientId, user.id)) {
    return NextResponse.json({ error: "No tienes acceso a este cliente." }, { status: 403 });
  }
  await deleteContentItem(id);
  return NextResponse.json({ ok: true });
}
