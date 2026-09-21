import { NextResponse } from "next/server";
import { countUsers, deleteUser } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado." }, { status: 401 });

  const { id } = await params;
  if (id === user.id) {
    return NextResponse.json({ error: "No puedes eliminar tu propia cuenta." }, { status: 400 });
  }
  if (countUsers() <= 1) {
    return NextResponse.json({ error: "No puede quedar la aplicación sin ninguna cuenta." }, { status: 400 });
  }

  deleteUser(id);
  return NextResponse.json({ ok: true });
}
