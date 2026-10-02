import { NextRequest, NextResponse } from "next/server";
import { syncAllClients } from "@/lib/instagram-sync";

// Sincronización automática de TODOS los clientes con Instagram conectado
// (publicaciones, historias, métricas y seguidores — ver
// lib/instagram-sync.ts). No usa la sesión de usuario: la llama cada hora
// netlify/functions/instagram-sync.mts con la cabecera
// "Authorization: Bearer <CRON_SECRET>".
export const dynamic = "force-dynamic";
export const maxDuration = 60;

async function handle(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Falta CRON_SECRET en las variables de entorno." }, { status: 500 });
  }
  if (req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
  const results = await syncAllClients();
  return NextResponse.json({ syncedAt: new Date().toISOString(), results });
}

export const GET = handle;
export const POST = handle;
