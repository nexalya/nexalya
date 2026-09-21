import { NextRequest, NextResponse } from "next/server";
import { getContentItem, updateContentItem, userCanAccessClient } from "@/lib/db";
import { getPublisher } from "@/lib/publisher";
import { getCurrentUser } from "@/lib/auth";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  const { id } = await params;
  const item = getContentItem(id);

  if (!item) {
    return NextResponse.json({ error: "Contenido no encontrado." }, { status: 404 });
  }
  if (!userCanAccessClient(item.clientId, user.id)) {
    return NextResponse.json({ error: "No tienes acceso a este cliente." }, { status: 403 });
  }

  const publisher = getPublisher(item.client);
  const result = await publisher.publish(item, item.client);

  const updated = updateContentItem(item.id, {
    status: result.ok ? "PUBLISHED" : "FAILED",
    publishedAt: result.ok ? new Date().toISOString() : item.publishedAt,
    errorMessage: result.ok ? null : result.error,
    remoteId: result.ok ? result.remoteId : item.remoteId,
  });

  return NextResponse.json({ result, item: updated });
}
