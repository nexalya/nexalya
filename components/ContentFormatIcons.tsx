// Iconos y helpers de formato compartidos entre el calendario
// (app/clients/[id]/page.tsx, vía CalendarRow) y cualquier otro sitio que
// necesite mostrar de un vistazo qué es una pieza (Reel/Carrusel/Post/
// Historia). Sin "use client": son funciones y JSX puros, así que sirven
// igual desde un Server Component que desde uno de cliente.

// El "formato" real de la pieza viene en productionNotes.format cuando el
// contenido se importó con ese dato; si no está disponible, se cae al
// mediaType (Vídeo/Imagen) para no dejar la pieza sin etiqueta.
export const FORMAT_LABELS: Record<string, string> = {
  REEL: "Vídeo",
  CARRUSEL: "Carrusel",
  POST: "Post",
  STORY: "Historia",
};

export function getFormatKey(item: { mediaType: string; productionNotes: string | null }): string {
  if (item.productionNotes) {
    try {
      const parsed = JSON.parse(item.productionNotes) as { format?: string | null };
      if (parsed.format && FORMAT_LABELS[parsed.format]) {
        return parsed.format;
      }
    } catch {
      // productionNotes no es JSON válido; seguimos con el fallback de abajo.
    }
  }
  return item.mediaType === "VIDEO" ? "REEL" : "POST";
}

// Si la pieza trae stories de apoyo ese mismo día (productionNotes.stories),
// se anota junto al formato (ej. "Reel + Stories") para no tener que abrir
// el detalle solo para saber si ese día también toca story.
export function hasStories(productionNotes: string | null): boolean {
  if (!productionNotes) return false;
  try {
    const parsed = JSON.parse(productionNotes) as { stories?: unknown[] };
    return Array.isArray(parsed.stories) && parsed.stories.length > 0;
  } catch {
    return false;
  }
}

export function VideoIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2.5" y="5.5" width="13" height="13" rx="2" />
      <path d="M15.5 9.5l5-3v11l-5-3" />
    </svg>
  );
}

export function CarouselIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="7" y="7" width="14" height="14" rx="2" />
      <rect x="3" y="3" width="14" height="14" rx="2" />
    </svg>
  );
}

export function PostIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5-4 4-3-3-6 6" />
    </svg>
  );
}

export function StoryIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export const FORMAT_ICONS: Record<string, () => JSX.Element> = {
  REEL: VideoIcon,
  CARRUSEL: CarouselIcon,
  POST: PostIcon,
  STORY: StoryIcon,
};

// "Lun 21" — día de la semana abreviado (sin punto) + número de día, en
// hora de Madrid.
export function dayLabel(iso: string): string {
  const date = new Date(iso);
  const weekday = new Intl.DateTimeFormat("es-ES", { weekday: "short", timeZone: "Europe/Madrid" })
    .format(date)
    .replace(/\.$/, "");
  const day = new Intl.DateTimeFormat("es-ES", { day: "2-digit", timeZone: "Europe/Madrid" }).format(date);
  return `${weekday.charAt(0).toUpperCase()}${weekday.slice(1)} ${day}`;
}

export function timeLabel(iso: string): string {
  return new Intl.DateTimeFormat("es-ES", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Madrid" }).format(
    new Date(iso)
  );
}
