import { NextResponse } from "next/server";
import { getClient, userCanAccessClient } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

/**
 * Comprobación de solo lectura de la conexión de Instagram: no publica ni
 * modifica nada, solo confirma que el access_token + igUserId guardados
 * son válidos pidiendo el username de la cuenta a graph.instagram.com.
 * Pensado para el botón "Probar conexión" del formulario de Instagram.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado." }, { status: 401 });

  const { id } = await params;
  const client = getClient(id);
  if (!client || !userCanAccessClient(id, user.id)) {
    return NextResponse.json({ error: "No tienes acceso a este cliente." }, { status: 403 });
  }
  if (!client.accessToken || !client.igUserId) {
    return NextResponse.json(
      { ok: false, error: "Este cliente todavía no tiene Instagram conectado." },
      { status: 400 }
    );
  }

  try {
    const url = `https://graph.instagram.com/v21.0/${client.igUserId}?fields=id,username,account_type,name`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${client.accessToken}` },
    });
    const data = await res.json();
    if (!res.ok || data.error) {
      return NextResponse.json(
        { ok: false, error: data?.error?.message ?? "La API de Instagram rechazó la petición." },
        { status: 200 }
      );
    }
    return NextResponse.json({
      ok: true,
      username: data.username,
      accountType: data.account_type,
      name: data.name,
    });
  } catch (err) {
    return NextResponse.json({ ok: false, error: (err as Error).message }, { status: 200 });
  }
}
