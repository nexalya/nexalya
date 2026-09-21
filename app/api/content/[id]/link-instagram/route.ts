import { NextRequest, NextResponse } from "next/server";
import { getContentItem, updateContentItem, userCanAccessClient } from "@/lib/db-turso";
import { findMediaIdByPermalink } from "@/lib/graph";
import { getCurrentUser } from "@/lib/auth";

/**
 * Vincula una pieza de Nexalya con la publicación real en Instagram que el
 * equipo subió a mano desde el móvil, pegando su enlace. A partir de ahí
 * la pieza ya tiene un remoteId real (no "mock_..."), así que el botón
 * "↻ Instagram" de Métricas puede traer los datos solo. No publica nada,
 * solo relaciona algo que ya está publicado.
 */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado." }, { status: 401 });

  const { id } = await params;
  const item = await getContentItem(id);
  if (!item) return NextResponse.json({ error: "Contenido no encontrado." }, { status: 404 });
  if (!await userCanAccessClient(item.clientId, user.id)) {
    return NextResponse.json({ error: "No tienes acceso a este cliente." }, { status: 403 });
  }
  if (!item.client.accessToken || !item.client.igUserId) {
    return NextResponse.json(
      { error: "Este cliente todavía no tiene Instagram conectado." },
      { status: 400 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const pastedUrl = typeof body.url === "string" ? body.url.trim() : "";
  if (!pastedUrl) {
    return NextResponse.json({ error: "Falta el enlace de la publicación." }, { status: 400 });
  }

  try {
    const found = await findMediaIdByPermalink(item.client.igUserId, item.client.accessToken, pastedUrl);
    if (!found) {
      return NextResponse.json(
        {
          error:
            "No he encontrado esa publicación entre las últimas de la cuenta. Comprueba el enlace, o puede que se publicara hace demasiado tiempo.",
        },
        { status: 404 }
      );
    }
    const updated = await updateContentItem(item.id, {
      remoteId: found.id,
      status: "PUBLISHED",
      publishedAt: item.publishedAt ?? found.timestamp,
      errorMessage: null,
    });
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 502 });
  }
}
