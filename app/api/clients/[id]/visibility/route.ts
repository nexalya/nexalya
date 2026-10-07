import { NextRequest, NextResponse } from "next/server";
import { getClient, setClientHidden, userCanAccessClient } from "@/lib/db-turso";
import { getCurrentUser } from "@/lib/auth";

// Oculta o vuelve a mostrar un cliente SOLO en la vista del usuario que lo
// pide (lista de clientes, menú lateral, dashboard). No borra ni pausa
// nada: calendario, métricas y sincronización siguen igual.
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  const { id } = await params;
  if (!(await getClient(id)) || !(await userCanAccessClient(id, user.id))) {
    return NextResponse.json({ error: "No tienes acceso a este cliente." }, { status: 403 });
  }
  const body = await req.json().catch(() => ({}));
  const hidden = body.hidden === true;
  await setClientHidden(id, user.id, hidden);
  return NextResponse.json({ ok: true, hidden });
}
