/**
 * Adaptador de publicación.
 *
 * getPublisher(client) decide POR CLIENTE: si el cliente tiene access
 * token e ID de cuenta de Instagram conectados (ver el formulario de
 * conexión en la página del cliente), usa la API real; si no, usa
 * MockPublisher (simula la publicación y deja todo listo — estados,
 * timestamps, mensajes de error — para que la UI funcione de principio a
 * fin sin depender de credenciales reales). Así un cliente puede publicar
 * de verdad mientras otro sigue en modo simulado, sin tocar código.
 *
 * Para las MÉTRICAS de lo ya publicado (en vez de para publicar), ver
 * lib/graph.ts — usa el mismo access token guardado en cada cliente.
 */

import type { ContentItem, Client } from "@/lib/db-turso";

export type PublishResult =
  | { ok: true; remoteId: string }
  | { ok: false; error: string };

export interface Publisher {
  publish(item: ContentItem, client: Client): Promise<PublishResult>;
}

/**
 * Publisher de pruebas: no llama a ninguna API externa. Útil para
 * demostrar el flujo completo (calendario → publicación → estado)
 * antes de conectar cuentas reales.
 */
export class MockPublisher implements Publisher {
  async publish(item: ContentItem, client: Client): Promise<PublishResult> {
    // Simula una pequeña latencia de red.
    await new Promise((r) => setTimeout(r, 400));

    if (!item.mediaUrl) {
      return { ok: false, error: "Falta el archivo de contenido (mediaUrl)." };
    }

    return { ok: true, remoteId: `mock_${item.id}` };
  }
}

/**
 * Implementación real contra la Instagram Graph API (Content Publishing).
 * Requiere:
 *  1. Una app en Meta for Developers con el producto "Instagram" (flujo
 *     "Instagram API with Instagram Login" — es el que expone permisos
 *     de publicación en 2026, ver Instagram > Configuración de la API
 *     con el inicio de sesión de Instagram).
 *  2. Una cuenta de Instagram Business/Creator añadida como tester de la
 *     app y con la invitación aceptada desde el móvil.
 *  3. Un access token (empieza por "IGAA...") generado desde esa misma
 *     pantalla, con permisos instagram_business_basic e
 *     instagram_business_content_publish.
 *
 * Usa graph.instagram.com (no graph.facebook.com) porque este tipo de
 * token es de "Instagram Login", no de una Página de Facebook vinculada.
 *
 * IMPORTANTE: usa client.igUserId (el ID numérico de la cuenta de
 * Instagram Business, ej. "17841400..."), NO client.igHandle (que es solo
 * el @usuario para mostrar en la UI) — la Graph API exige el ID numérico
 * en la ruta, un @usuario ahí devuelve error.
 *
 * Flujo (resumen): 1) crear un "media container" con la imagen/vídeo y el
 * caption (POST /{ig-user-id}/media), 2) publicarlo
 * (POST /{ig-user-id}/media_publish) con el creation_id devuelto en el paso 1.
 */
export class InstagramGraphPublisher implements Publisher {
  private apiVersion = "v21.0";

  async publish(item: ContentItem, client: Client): Promise<PublishResult> {
    if (!client.accessToken || !client.igUserId) {
      return {
        ok: false,
        error:
          "Este cliente no tiene access token o cuenta de Instagram configurados todavía.",
      };
    }

    try {
      // 1) Crear el contenedor de media.
      const createRes = await fetch(
        `https://graph.instagram.com/${this.apiVersion}/${client.igUserId}/media`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image_url: item.mediaType === "IMAGE" ? item.mediaUrl : undefined,
            video_url: item.mediaType === "VIDEO" ? item.mediaUrl : undefined,
            caption: item.caption,
            access_token: client.accessToken,
          }),
        }
      );
      const createData = await createRes.json();
      if (!createRes.ok || !createData.id) {
        return {
          ok: false,
          error: createData?.error?.message ?? "Error creando el contenedor de media.",
        };
      }

      // 2) Publicar el contenedor.
      const publishRes = await fetch(
        `https://graph.instagram.com/${this.apiVersion}/${client.igUserId}/media_publish`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            creation_id: createData.id,
            access_token: client.accessToken,
          }),
        }
      );
      const publishData = await publishRes.json();
      if (!publishRes.ok || !publishData.id) {
        return {
          ok: false,
          error: publishData?.error?.message ?? "Error publicando el contenido.",
        };
      }

      return { ok: true, remoteId: publishData.id };
    } catch (err) {
      return { ok: false, error: (err as Error).message };
    }
  }
}

/**
 * Un cliente concreto puede tener la API real conectada mientras otro
 * sigue en modo simulado — por eso esto depende del cliente en vez de ser
 * un interruptor global fijo en el código.
 */
export function getPublisher(client: Client): Publisher {
  if (client.accessToken && client.igUserId) {
    return new InstagramGraphPublisher();
  }
  return new MockPublisher();
}
