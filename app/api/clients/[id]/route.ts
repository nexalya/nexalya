import { NextRequest, NextResponse } from "next/server";
import { getClient, updateClient, deleteClient, listContentItems, userCanAccessClient } from "@/lib/db-turso";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  const { id } = await params;
  const client = await getClient(id);
  if (!client) {
    return NextResponse.json({ error: "Cliente no encontrado." }, { status: 404 });
  }
  if (!await userCanAccessClient(id, user.id)) {
    return NextResponse.json({ error: "No tienes acceso a este cliente." }, { status: 403 });
  }
  const contentItems = await listContentItems({ clientId: id });
  return NextResponse.json({ ...client, contentItems });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  const { id } = await params;
  if (!await userCanAccessClient(id, user.id)) {
    return NextResponse.json({ error: "No tienes acceso a este cliente." }, { status: 403 });
  }
  const body = await req.json();
  // El dueño no se cambia por aquí (eso podría usarse para "robar" un
  // cliente compartido); para eso está /api/clients/[id]/share.
  delete body.ownerId;
  const client = await updateClient(id, body);
  return NextResponse.json(client);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  const { id } = await params;
  const client = await getClient(id);
  if (!client) {
    return NextResponse.json({ error: "Cliente no encontrado." }, { status: 404 });
  }
  if (client.ownerId !== user.id) {
    return NextResponse.json(
      { error: "Solo quien creó este cliente puede eliminarlo." },
      { status: 403 }
    );
  }
  await deleteClient(id);
  return NextResponse.json({ ok: true });
}
