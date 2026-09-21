import { NextRequest, NextResponse } from "next/server";
import { listClients, createClient } from "@/lib/db-turso";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  const clients = await listClients(user.id);
  return NextResponse.json(clients);
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  const body = await req.json();

  if (!body.name || typeof body.name !== "string") {
    return NextResponse.json({ error: "El nombre del cliente es obligatorio." }, { status: 400 });
  }

  const client = await createClient({
    name: body.name,
    sector: body.sector || null,
    igHandle: body.igHandle || null,
    fbPageId: body.fbPageId || null,
    notes: body.notes || null,
    ownerId: user.id,
    website: body.website || null,
    targetAudience: body.targetAudience || null,
    competitors: body.competitors || null,
    avoidTopics: body.avoidTopics || null,
    toneOfVoice: body.toneOfVoice || null,
    visualIdentity: body.visualIdentity || null,
    contentPillars: body.contentPillars || null,
  });

  return NextResponse.json(client, { status: 201 });
}
