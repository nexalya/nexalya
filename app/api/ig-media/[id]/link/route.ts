import { NextRequest, NextResponse } from "next/server";
import {
  getContentItem,
  getIgMedia,
  setIgMediaLink,
  updateContentItem,
  userCanAccessClient,
} from "@/lib/db-turso";
import { getCurrentUser } from "@/lib/auth";

/**
 * Corrige a mano con qué pieza del calendario está vinculada una
 * publicación real de Instagram (o la desvincula con contentItemId null).
 * Queda "bloqueada": la sincronización automática ya no vuelve a cambiar
 * ese vínculo. Las métricas se copian a la nueva pieza en la siguiente
 * sincronización.
 */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  const { id } = await params;
  const media = await getIgMedia(id);
  if (!media) return NextResponse.json({ error: "Publicación no encontrada." }, { status: 404 });
  if (!await userCanAccessClient(media.clientId, user.id)) {
    return NextResponse.json({ error: "No tienes acceso a este cliente." }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const contentItemId: string | null = typeof body.contentItemId === "string" && body.contentItemId ? body.contentItemId : null;
  if (contentItemId) {
    const item = await getContentItem(contentItemId);
    if (!item || item.clientId !== media.clientId) {
      return NextResponse.json({ error: "Esa pieza no es de este cliente." }, { status: 400 });
    }
  }

  // La pieza anterior deja de apuntar a esta publicación; si no, la
  // sincronización volvería a vincularlas por su remoteId.
  if (media.contentItemId && media.contentItemId !== contentItemId) {
    const previous = await getContentItem(media.contentItemId);
    if (previous?.remoteId === media.id) {
      await updateContentItem(previous.id, { remoteId: null });
    }
  }

  await setIgMediaLink(id, contentItemId, true);
  return NextResponse.json({ ok: true });
}
