import { NextRequest, NextResponse } from "next/server";
import { listIdeaBank, createIdeaBankItem, userCanAccessClient } from "@/lib/db-turso";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  const { id } = await params;
  if (!await userCanAccessClient(id, user.id)) {
    return NextResponse.json({ error: "No tienes acceso a este cliente." }, { status: 403 });
  }
  return NextResponse.json(await listIdeaBank(id));
}

export async function POST(
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
  if (!body.idea) {
    return NextResponse.json({ error: "Falta el campo 'idea'." }, { status: 400 });
  }
  const item = await createIdeaBankItem({ clientId: id, ...body });
  return NextResponse.json(item, { status: 201 });
}
