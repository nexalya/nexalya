/**
 * Cliente de la Instagram Graph API para MÉTRICAS (Insights).
 *
 * Lo usa sobre todo la sincronización automática (lib/instagram-sync.ts),
 * que cada hora importa publicaciones e historias de cada cliente con
 * `accessToken` + `igUserId` guardados y rellena sus métricas solas.
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

export type FullMediaInsights = {
  reach: number | null;
  views: number | null;
  likes: number | null;
  comments: number | null;
  saves: number | null;
  shares: number | null;
  interactions: number | null;
  follows: number | null;
  profileVisits: number | null;
  replies: number | null;
  navigation: number | null;
};

type GraphInsightValue = { name: string; values?: { value: number }[]; total_value?: { value: number } };

// Meta rechaza la petición ENTERA si se pide una métrica que no aplica a
// ese tipo de publicación (ej. profile_visits en un Reel), así que cada
// formato pide solo las suyas. Comprobado contra la API real (oct 2026).
const METRICS_BY_PRODUCT: Record<string, string[]> = {
  FEED: ["reach", "views", "likes", "comments", "saved", "shares", "total_interactions", "follows", "profile_visits"],
  REELS: ["reach", "views", "likes", "comments", "saved", "shares", "total_interactions"],
  STORY: ["reach", "views", "replies", "shares", "total_interactions", "follows", "profile_visits", "navigation"],
};

async function graphGet(path: string, accessToken: string) {
  const res = await fetch(`https://graph.instagram.com/${GRAPH_API_VERSION}/${path}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error?.message ?? `Error de la API de Instagram (${res.status}).`);
  }
  return data;
}

/**
 * Pide todas las métricas que Instagram da para una publicación, según su
 * tipo (FEED = post o carrusel, REELS, STORY). Las historias solo tienen
 * métricas mientras siguen activas (24 h), después Meta deja de darlas.
 */
export async function getFullMediaInsights(
  mediaId: string,
  productType: string,
  accessToken: string
): Promise<FullMediaInsights> {
  const metrics = METRICS_BY_PRODUCT[productType] ?? METRICS_BY_PRODUCT.FEED;
  const data = await graphGet(`${mediaId}/insights?metric=${metrics.join(",")}`, accessToken);

  const byName: Record<string, number | null> = {};
  for (const entry of (data.data ?? []) as GraphInsightValue[]) {
    byName[entry.name] = entry.values?.[0]?.value ?? entry.total_value?.value ?? null;
  }

  return {
    reach: byName.reach ?? null,
    views: byName.views ?? null,
    likes: byName.likes ?? null,
    comments: byName.comments ?? null,
    saves: byName.saved ?? null,
    shares: byName.shares ?? null,
    interactions: byName.total_interactions ?? null,
    follows: byName.follows ?? null,
    profileVisits: byName.profile_visits ?? null,
    replies: byName.replies ?? null,
    navigation: byName.navigation ?? null,
  };
}

/**
 * Pide las métricas de una publicación ya publicada en Instagram.
 * `mediaId` es el remoteId que guarda content_items tras publicar de verdad
 * o tras vincularla. Averigua primero el tipo de publicación para pedir
 * solo las métricas que admite.
 */
export async function getMediaInsights(
  mediaId: string,
  accessToken: string
): Promise<MediaInsights> {
  const meta = await graphGet(`${mediaId}?fields=media_product_type`, accessToken);
  const full = await getFullMediaInsights(mediaId, meta.media_product_type ?? "FEED", accessToken);
  return {
    reach: full.reach,
    likes: full.likes,
    comments: full.comments,
    saves: full.saves,
    shares: full.shares,
    profileVisits: full.profileVisits,
  };
}

export type IgMediaEntry = {
  id: string;
  caption?: string;
  media_type?: string;
  media_product_type?: string;
  permalink?: string;
  thumbnail_url?: string;
  media_url?: string;
  timestamp: string;
};

const MEDIA_FIELDS = "id,caption,media_type,media_product_type,permalink,thumbnail_url,media_url,timestamp";

/**
 * Publicaciones del feed (posts, carruseles y reels) de los últimos
 * `sinceDays` días, paginando hasta llegar a esa fecha o a `maxItems`.
 * El histórico es lo que permite a la analítica comparar periodos y a la
 * IA detectar qué funciona desde el primer día, sin esperar meses.
 */
export async function listRecentMedia(
  igUserId: string,
  accessToken: string,
  sinceDays = 90,
  maxItems = 150
): Promise<IgMediaEntry[]> {
  const since = Date.now() - sinceDays * 86400000;
  const out: IgMediaEntry[] = [];
  let path: string | null = `${igUserId}/media?fields=${MEDIA_FIELDS}&limit=50`;
  while (path && out.length < maxItems) {
    const data = await graphGet(path, accessToken);
    const page = (data.data ?? []) as IgMediaEntry[];
    for (const entry of page) {
      if (new Date(entry.timestamp).getTime() < since) return out;
      out.push(entry);
    }
    const after: string | undefined = data.paging?.cursors?.after;
    path = data.paging?.next && after ? `${igUserId}/media?fields=${MEDIA_FIELDS}&limit=50&after=${after}` : null;
  }
  return out;
}

/** Las historias que siguen activas ahora mismo (últimas 24 h). */
export async function listActiveStories(igUserId: string, accessToken: string): Promise<IgMediaEntry[]> {
  const data = await graphGet(`${igUserId}/stories?fields=${MEDIA_FIELDS}`, accessToken);
  return (data.data ?? []) as IgMediaEntry[];
}

/** @usuario y foto de perfil de la cuenta (para mostrarla en la ficha del cliente). */
export async function getProfile(
  igUserId: string,
  accessToken: string
): Promise<{ username: string | null; profilePictureUrl: string | null }> {
  const data = await graphGet(`${igUserId}?fields=username,profile_picture_url`, accessToken);
  return { username: data.username ?? null, profilePictureUrl: data.profile_picture_url ?? null };
}

/**
 * Los tokens de "Instagram Login" caducan a los 60 días. Se pueden
 * renovar (otros 60 días) siempre que tengan más de 24 h y no hayan
 * caducado aún — la sincronización automática lo hace una vez por semana
 * para que nadie tenga que volver a generarlo a mano.
 */
export async function refreshLongLivedToken(accessToken: string): Promise<string> {
  const res = await fetch(
    `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${encodeURIComponent(accessToken)}`,
    { cache: "no-store" }
  );
  const data = await res.json();
  if (!res.ok || !data.access_token) {
    throw new Error(data?.error?.message ?? "No se pudo renovar el token de Instagram.");
  }
  return data.access_token as string;
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
