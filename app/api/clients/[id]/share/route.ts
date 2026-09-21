import { NextRequest, NextResponse } from "next/server";
import {
  getClient,
  listClientShares,
  shareClientWithUser,
  unshareClientFromUser,
  getUserById,
} from "@/lib/db-turso";
import { getCurrentUser } from "@/lib/auth";

// Solo quien creó el cliente puede decidir con quién se comparte. Los
// clientes "de todo el equipo" (ownerId NULL, los que ya existían antes de
// las cuentas) no se gestionan aquí: ya son visibles para todos.
async function requireOwner(clientId: string) {
  const user = await getCurrentUser();
  if (!user) return { error: NextResponse.json({ error: "No autenticado." }, { status: 401 }) };
  const client = await getClient(clientId);
  if (!client) return { error: NextResponse.json({ error: "Cliente no encontrado." }, { status: 404 }) };
  if (client.ownerId !== user.id) {
    return {
      error: NextResponse.json(
        { error: "Solo quien creó este cliente puede gestionar con quién se comparte." },
        { status: 403 }
      ),
    };
  }
  return { user, client };
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await requireOwner(id);
  if ("error" in result) return result.error;
  return NextResponse.json(await listClientShares(id));
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await requireOwner(id);
  if ("error" in result) return result.error;

  const body = await req.json().catch(() => ({}));
  const userId = typeof body.userId === "string" ? body.userId : "";
  if (!userId) return NextResponse.json({ error: "Falta 'userId'." }, { status: 400 });
  if (!await getUserById(userId)) return NextResponse.json({ error: "Usuario no encontrado." }, { status: 404 });

  await shareClientWithUser(id, userId);
  return NextResponse.json(await listClientShares(id), { status: 201 });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await requireOwner(id);
  if ("error" in result) return result.error;

  const body = await req.json().catch(() => ({}));
  const userId = typeof body.userId === "string" ? body.userId : "";
  if (!userId) return NextResponse.json({ error: "Falta 'userId'." }, { status: 400 });

  await unshareClientFromUser(id, userId);
  return NextResponse.json(await listClientShares(id));
}
