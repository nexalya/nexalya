import { NextRequest, NextResponse } from "next/server";
import { getClient, createFollowerSnapshot, userCanAccessClient } from "@/lib/db-turso";
import { getFollowerCount } from "@/lib/graph";
import { getCurrentUser } from "@/lib/auth";

// Trae el número de seguidores actual directamente de Instagram y registra
// un follower_snapshot con la fecha de hoy, en vez de teclearlo a mano
// (ver FollowerSnapshotForm.tsx). Requiere access token + ID de cuenta de
// Instagram conectados (ver InstagramConnectionForm.tsx).
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  const { id } = await params;
  const client = await getClient(id);
  if (!client) return NextResponse.json({ error: "Cliente no encontrado." }, { status: 404 });
  if (!await userCanAccessClient(id, user.id)) {
    return NextResponse.json({ error: "No tienes acceso a este cliente." }, { status: 403 });
  }
  if (!client.accessToken || !client.igUserId) {
    return NextResponse.json(
      { error: "Este cliente no tiene Instagram conectado todavía." },
      { status: 400 }
    );
  }

  try {
    const followers = await getFollowerCount(client.igUserId, client.accessToken);
    const snapshot = await createFollowerSnapshot({
      clientId: id,
      date: new Date().toISOString().slice(0, 10),
      followers,
      notes: "Sincronizado desde Instagram",
    });
    return NextResponse.json(snapshot, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 502 });
  }
}
