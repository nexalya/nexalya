import { NextRequest, NextResponse } from "next/server";
import { verifyLogin, startSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const email = typeof body.email === "string" ? body.email : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json({ error: "Introduce email y contraseña." }, { status: 400 });
  }

  const user = verifyLogin(email, password);
  if (!user) {
    return NextResponse.json({ error: "Email o contraseña incorrectos." }, { status: 401 });
  }

  await startSession(user.id);
  return NextResponse.json({ ok: true, user });
}
