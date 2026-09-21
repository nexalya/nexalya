import { NextRequest, NextResponse } from "next/server";
import { listFollowerSnapshots, createFollowerSnapshot, userCanAccessClient } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  const { id } = await params;
  if (!userCanAccessClient(id, user.id)) {
    return NextResponse.json({ error: "No tienes acceso a este cliente." }, { status: 403 });
  }
  return NextResponse.json(listFollowerSnapshots(id));
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  const { id } = await params;
  if (!userCanAccessClient(id, user.id)) {
    return NextResponse.json({ error: "No tienes acceso a este cliente." }, { status: 403 });
  }
  const body = await req.json();
  if (!body.date || body.followers === undefined) {
    return NextResponse.json({ error: "Faltan 'date' y/o 'followers'." }, { status: 400 });
  }
  const snapshot = createFollowerSnapshot({
    clientId: id,
    date: body.date,
    followers: Number(body.followers),
    notes: body.notes || null,
  });
  return NextResponse.json(snapshot, { status: 201 });
}
