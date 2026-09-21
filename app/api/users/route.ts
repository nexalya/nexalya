import { NextRequest, NextResponse } from "next/server";
import { listUsers } from "@/lib/db-turso";
import { getCurrentUser, registerUser, generateTempPassword } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  return NextResponse.json(await listUsers());
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado." }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";

  if (!name || !email) {
    return NextResponse.json({ error: "Nombre y email son obligatorios." }, { status: 400 });
  }

  const tempPassword = generateTempPassword();
  try {
    const newUser = await registerUser({ name, email, password: tempPassword });
    // La contraseña temporal solo se devuelve aquí, en texto plano, para
    // que quien crea la cuenta se la pase a la persona; no se guarda en
    // ningún sitio (solo su hash queda en la base de datos).
    return NextResponse.json({ user: newUser, tempPassword }, { status: 201 });
  } catch (err) {
    const msg = (err as Error).message || "";
    if (/UNIQUE constraint/i.test(msg)) {
      return NextResponse.json({ error: "Ya existe una cuenta con ese email." }, { status: 409 });
    }
    return NextResponse.json({ error: "No se pudo crear la cuenta." }, { status: 500 });
  }
}
