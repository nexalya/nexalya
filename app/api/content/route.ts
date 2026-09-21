import { NextRequest, NextResponse } from "next/server";
import { listContentItems, createContentItem, userCanAccessClient } from "@/lib/db-turso";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const clientId = searchParams.get("clientId") || undefined;
  const days = searchParams.get("days");

  if (clientId && !await userCanAccessClient(clientId, user.id)) {
    return NextResponse.json({ error: "No tienes acceso a este cliente." }, { status: 403 });
  }

  const items = await listContentItems({
    clientId,
    fromDaysAgo: days ? -Number(days) : undefined,
    // Solo hace falta filtrar por accesibles cuando no se ha pedido un
    // clientId concreto (ese caso ya se ha comprobado arriba).
    userId: clientId ? undefined : user.id,
  });

  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  const body = await req.json();

  const required = ["clientId", "title", "caption", "mediaUrl", "scheduledAt"];
  for (const field of required) {
    if (!body[field]) {
      return NextResponse.json({ error: `Falta el campo obligatorio: ${field}` }, { status: 400 });
    }
  }

  if (!await userCanAccessClient(body.clientId, user.id)) {
    return NextResponse.json({ error: "No tienes acceso a este cliente." }, { status: 403 });
  }

  const item = await createContentItem({
    clientId: body.clientId,
    title: body.title,
    caption: body.caption,
    mediaUrl: body.mediaUrl,
    mediaType: body.mediaType || "IMAGE",
    platform: body.platform || "INSTAGRAM",
    scheduledAt: body.scheduledAt,
    status: body.status || "SCHEDULED",
  });

  return NextResponse.json(item, { status: 201 });
}
