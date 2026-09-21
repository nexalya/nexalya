import { NextRequest, NextResponse } from "next/server";
import { getContentItem, updateContentItem, userCanAccessClient } from "@/lib/db-turso";
import { getMediaInsights } from "@/lib/graph";
import { getCurrentUser } from "@/lib/auth";

// Trae las métricas de una publicación YA PUBLICADA DE VERDAD directamente
// de Instagram, en vez de teclearlas a mano (ver MetricsRow.tsx). Solo
// tiene sentido si el cliente tiene access token conectado y la pieza se
// publicó con la API real (remoteId real, no el "mock_..." que deja el
// publicador simulado — ver lib/publisher.ts).
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  const { id } = await params;
  const item = await getContentItem(id);
  if (!item) return NextResponse.json({ error: "Contenido no encontrado." }, { status: 404 });
  if (!await userCanAccessClient(item.clientId, user.id)) {
    return NextResponse.json({ error: "No tienes acceso a este cliente." }, { status: 403 });
  }
  if (!item.client.accessToken) {
    return NextResponse.json(
      { error: "Este cliente no tiene Instagram conectado todavía." },
      { status: 400 }
    );
  }
  if (!item.remoteId || item.remoteId.startsWith("mock_")) {
    return NextResponse.json(
      { error: "Esta pieza no se publicó con la API real, no hay métricas que sincronizar." },
      { status: 400 }
    );
  }

  try {
    const insights = await getMediaInsights(item.remoteId, item.client.accessToken);
    const updated = await updateContentItem(item.id, {
      ...insights,
      metricsUpdatedAt: new Date().toISOString(),
    });
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 502 });
  }
}
