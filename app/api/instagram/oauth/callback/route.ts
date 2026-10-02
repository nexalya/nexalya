import { NextRequest, NextResponse } from "next/server";
import { getClient, setClientSyncState, updateClient } from "@/lib/db-turso";
import { exchangeCodeForAccount, readState, siteUrl } from "@/lib/instagram-oauth";
import { syncClient } from "@/lib/instagram-sync";

/**
 * Vuelta desde Instagram tras pulsar "Permitir": guarda el token y la
 * cuenta en el cliente y lanza una primera sincronización (con tope de
 * tiempo: lo que no dé tiempo lo completa la sincronización horaria).
 */
export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin;
  const base = siteUrl(origin);
  const params = req.nextUrl.searchParams;
  const state = readState(params.get("state") ?? "");

  const fail = (reason: string) =>
    state?.from === "app"
      ? NextResponse.redirect(`${base}/clients/${state.clientId}?instagram=error&motivo=${encodeURIComponent(reason)}`)
      : NextResponse.redirect(`${base}/conectar/resultado?error=${encodeURIComponent(reason)}`);

  if (!state) return NextResponse.redirect(`${base}/conectar/resultado?error=caducado`);
  // El cliente pulsó "Cancelar" en Instagram.
  if (params.get("error")) return fail("cancelado");
  const code = params.get("code");
  if (!code) return fail("sin-codigo");

  const client = await getClient(state.clientId);
  if (!client) return fail("cliente");

  try {
    const account = await exchangeCodeForAccount(code, origin);
    await updateClient(client.id, {
      accessToken: account.accessToken,
      igUserId: account.igUserId,
      igHandle: account.username ? `@${account.username}` : client.igHandle,
    });
    await setClientSyncState(client.id, { tokenRefreshedAt: new Date().toISOString(), lastSyncError: null });

    const fresh = await getClient(client.id);
    if (fresh) {
      await Promise.race([syncClient(fresh).catch(() => null), new Promise((r) => setTimeout(r, 8000))]);
    }

    if (state.from === "app") return NextResponse.redirect(`${base}/clients/${client.id}/metrics?instagram=conectado`);
    const u = account.username ? `&u=${encodeURIComponent(account.username)}` : "";
    return NextResponse.redirect(`${base}/conectar/resultado?ok=1${u}`);
  } catch (err) {
    console.error("instagram oauth callback", (err as Error).message);
    return fail("instagram");
  }
}
