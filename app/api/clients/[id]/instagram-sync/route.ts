import { NextRequest, NextResponse } from "next/server";
import { getClient, userCanAccessClient } from "@/lib/db-turso";
import { syncClient } from "@/lib/instagram-sync";
import { getCurrentUser } from "@/lib/auth";

// Botón "Sincronizar ahora" de la pestaña Métricas: lo mismo que hace el
// cron cada hora, pero solo para este cliente y al momento.
export const maxDuration = 60;

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  const { id } = await params;
  const client = await getClient(id);
  if (!client) return NextResponse.json({ error: "Cliente no encontrado." }, { status: 404 });
  if (!await userCanAccessClient(id, user.id)) {
    return NextResponse.json({ error: "No tienes acceso a este cliente." }, { status: 403 });
  }

  const result = await syncClient(client);
  if (!result.ok) return NextResponse.json({ error: result.error, result }, { status: 502 });
  return NextResponse.json(result);
}
