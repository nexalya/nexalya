export const PLATFORMS = ["INSTAGRAM", "FACEBOOK", "TIKTOK"] as const;
export type Platform = (typeof PLATFORMS)[number];

export const MEDIA_TYPES = ["IMAGE", "VIDEO"] as const;
export type MediaType = (typeof MEDIA_TYPES)[number];

export const STATUSES = ["DRAFT", "SCHEDULED", "PUBLISHED", "FAILED"] as const;
export type Status = (typeof STATUSES)[number];

export const PLATFORM_LABELS: Record<Platform, string> = {
  INSTAGRAM: "Instagram",
  FACEBOOK: "Facebook",
  TIKTOK: "TikTok",
};

export const STATUS_LABELS: Record<Status, string> = {
  DRAFT: "Pendiente",
  SCHEDULED: "Programado",
  PUBLISHED: "Publicado",
  FAILED: "Fallido",
};

// Estados que el equipo puede elegir a mano en el desplegable de cada
// publicación (FAILED queda fuera: solo lo pone un intento real de
// publicación automática fallido, no algo que se seleccione manualmente).
export const EDITABLE_STATUSES: Status[] = ["DRAFT", "SCHEDULED", "PUBLISHED"];
