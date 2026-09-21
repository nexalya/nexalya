import { NextRequest, NextResponse } from "next/server";
import { getUserByEmailWithHash, updateUserPassword } from "@/lib/db";
import { getCurrentUser, hashPassword, verifyPassword } from "@/lib/auth";

export async function PATCH(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado." }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const currentPassword = typeof body.currentPassword === "string" ? body.currentPassword : "";
  const newPassword = typeof body.newPassword === "string" ? body.newPassword : "";

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: "Rellena la contraseña actual y la nueva." }, { status: 400 });
  }
  if (newPassword.length < 8) {
    return NextResponse.json({ error: "La contraseña nueva debe tener al menos 8 caracteres." }, { status: 400 });
  }

  const full = getUserByEmailWithHash(user.email);
  if (!full || !verifyPassword(currentPassword, full.passwordHash)) {
    return NextResponse.json({ error: "La contraseña actual no es correcta." }, { status: 401 });
  }

  updateUserPassword(user.id, hashPassword(newPassword));
  return NextResponse.json({ ok: true });
}
