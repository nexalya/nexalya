/**
 * Cliente de la Instagram Graph API para MÉTRICAS (Insights).
 *
 * Todavía no está activo: hace falta completar la guía "Conectar Instagram
 * Insights" del documento de estrategia (Meta for Developers, permisos,
 * Business Verification / App Review para cuentas de clientes). En cuanto
 * cada cliente tenga su `accessToken` guardado, estas funciones ya pueden
 * usarse desde una ruta de la API para rellenar las métricas solas en vez
 * de a mano.
 *
 * Producto usado: "Instagram API with Instagram Login" (graph.instagram.com).
 * El access token (IGAA...) se genera desde el propio dashboard de Meta,
 * en la sección Instagram > "Configuración de la API con el inicio de
 * sesión de Instagram" > Generar identificadores de acceso — no requiere
 * pasar por una Página de Facebook vinculada.
 *
 * Métricas vigentes en 2026 (Meta retiró impressions/plays/video_views en
 * 2024-2025): a nivel de publicación reach, likes, comments, saved, shares,
 * views, total_interactions, follows, profile_visits, profile_activity;
 * a nivel de cuenta follower_count.
 */

const GRAPH_API_VERSION = "v21.0";

export type MediaInsights = {
  reach: number | null;
  likes: number | null;
  comments: number | null;
  saves: number | null;
  shares: number | null;
  profileVisits: number | null;
};

type GraphInsightValue = { name: string; values?: { value: number }[]; total_value?: { value: number } };

/**
 * Pide las métricas de una publicación ya publicada en Instagram.
 * `mediaId` es el remoteId que guarda content_items tras publicar de verdad
 * (no el mock actual). `mediaType` distingue qué métricas tienen sentido:
 * "saves"/"shares" no aplican igual a todos los formatos.
 */
export async function getMediaInsights(
  mediaId: string,
  accessToken: string
): Promise<MediaInsights> {
  const metrics = ["reach", "likes", "comments", "saved", "shares", "profile_visits"].join(",");
  const url = `https://graph.instagram.com/${GRAPH_API_VERSION}/${mediaId}/insights?metric=${metrics}&access_token=${accessToken}`;

  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error?.message ?? "Error pidiendo métricas de la publicación.");
  }

  const byName: Record<string, number | null> = {};
  for (const entry of (data.data ?? []) as GraphInsightValue[]) {
    const value = entry.values?.[0]?.value ?? entry.total_value?.value ?? null;
    byName[entry.name] = value;
  }

  return {
    reach: byName.reach ?? null,
    likes: byName.likes ?? null,
    comments: byName.comments ?? null,
    saves: byName.saved ?? null,
    shares: byName.shares ?? null,
    profileVisits: byName.profile_visits ?? null,
  };
}

/**
 * Pide el número de seguidores actual de la cuenta de Instagram (para
 * registrar un follower_snapshot sin tener que mirarlo a mano).
 * `igUserId` es el id de la cuenta de Instagram Business (no el @handle).
 */
export async function getFollowerCount(igUserId: string, accessToken: string): Promise<number> {
  const url = `https://graph.instagram.com/${GRAPH_API_VERSION}/${igUserId}?fields=followers_count&access_token=${accessToken}`;
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok || typeof data.followers_count !== "number") {
    throw new Error(data?.error?.message ?? "Error pidiendo el número de seguidores.");
  }
  return data.followers_count;
}


/**
 * Extrae el "shortcode" (el código de la URL, ej. "Cx1Ab2YnZ") de un
 * enlace de publicación de Instagram (post, reel o IGTV), para poder
 * comparar dos enlaces aunque tengan distinto protocolo, barra final o
 * parámetros de query.
 */
function shortcodeFromPermalink(url: string): string | null {
  const match = url.match(/instagram\.com\/(?:p|reel|tv)\/([A-Za-z0-9_-]+)/i);
  return match ? match[1] : null;
}

/**
 * Busca, entre las publicaciones recientes de la cuenta, la que
 * corresponde al enlace que ha pegado el equipo (tras publicar a mano
 * desde el móvil) y devuelve su ID real de Instagram — el mismo tipo de
 * ID que deja `lib/publisher.ts` cuando publica de verdad, así que a
 * partir de ahí ya se puede usar `getMediaInsights` para traer métricas.
 * Solo mira las últimas `limit` publicaciones: si no aparece, lo más
 * probable es que se haya publicado hace demasiado o el enlace esté mal.
 */
export async function findMediaIdByPermalink(
  igUserId: string,
  accessToken: string,
  pastedUrl: string,
  limit = 50
): Promise<{ id: string; timestamp: string } | null> {
  const targetCode = shortcodeFromPermalink(pastedUrl);
  if (!targetCode) return null;

  const url = `https://graph.instagram.com/${GRAPH_API_VERSION}/${igUserId}/media?fields=id,permalink,timestamp&limit=${limit}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error?.message ?? "Error consultando las publicaciones de Instagram.");
  }

  type MediaEntry = { id: string; permalink?: string; timestamp?: string };
  const found = ((data.data ?? []) as MediaEntry[]).find(
    (m) => m.permalink && shortcodeFromPermalink(m.permalink) === targetCode
  );
  return found ? { id: found.id, timestamp: found.timestamp ?? new Date().toISOString() } : null;
}
