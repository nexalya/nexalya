// Datos reales de Innovapro y Capelino, extraídos tal cual de los Excel que
// aportó el equipo (Sistema_Innovapro_30_dias, Capelino_Calendario_21Sept_31Oct_2026).
// No son ejemplos ni contenido generado por IA: son el plan editorial ya
// definido internamente, a la espera de validación y programación real.
//
// El campo "hour" de RealContentRow ya incluye segundos y offset horario de
// Madrid (Europe/Madrid, con su cambio de horario de invierno el 25/10/2026),
// para que la hora de publicación mostrada coincida con la hora local
// pensada por el equipo, sin depender de en qué zona horaria se ejecute el
// script de siembra.

export type RealPlanRow = {
  date: string;
  day?: string | null;
  format: string;
  family: string | null;
  topic: string | null;
  objective: string | null;
  kpi: string | null;
  keyword: string | null;
  notes: string | null;
};

export type RealContentRow = {
  idfeed: string;
  title: string;
  caption: string;
  mediaType: "IMAGE" | "VIDEO";
  date: string;
  hour: string;
};

export type RealIdeaRow = {
  priority: string;
  family: string;
  idea: string;
  hook: string;
  execution: string;
  resources: string;
  duration: string;
  objective: string;
  whenToUse: string;
};

export const INNOVAPRO_PLAN: RealPlanRow[] = [
  {
    date: "2026-09-21", format: "Reel", family: "Aparatología",
    topic: "¿Tu equipo solo trabaja para un servicio? (SHR X Ultra)", objective: "Ayudar a elegir y solicitar una demo", kpi: "DMs con palabra clave ULTRA",
    keyword: "ULTRA", notes: "Responder DMs y registrar origen. Guion: Reels plano a plano (ID A01). Stories de apoyo: S01-1 a -3.",
  },
  {
    date: "2026-09-22", format: "Stories", family: "Stories / conversación",
    topic: "Una máquina no sustituye una carta de servicios bien pensada. (SHR X Ultra)", objective: "Conversación e investigación con la audiencia", kpi: "DMs con palabra clave ULTRA",
    keyword: "ULTRA", notes: "Responder DMs y registrar origen. Guion: Stories diarias (ID S02). Stories de apoyo: S02-1 a -3.",
  },
  {
    date: "2026-09-23", format: "Reel", family: "Aparatología",
    topic: "Depilación y una segunda línea de servicios (SHR Xn)", objective: "Ayudar a elegir y solicitar una demo", kpi: "DMs con palabra clave XN",
    keyword: "XN", notes: "Responder DMs y registrar origen. Guion: Reels plano a plano (ID A02). Stories de apoyo: S03-1 a -3.",
  },
  {
    date: "2026-09-24", format: "Stories", family: "Stories / conversación",
    topic: "¿Qué necesitas comprobar antes de cambiar de equipo? (SHR Xn)", objective: "Conversación e investigación con la audiencia", kpi: "DMs con palabra clave XN",
    keyword: "XN", notes: "Responder DMs y registrar origen. Guion: Stories diarias (ID S04). Stories de apoyo: S04-1 a -3.",
  },
  {
    date: "2026-09-25", format: "Carrusel", family: "Aparatología",
    topic: "¿Depilación y facial en tu próximo equipo? (SHR Xe)", objective: "Ayudar a elegir y solicitar una demo", kpi: "DMs con palabra clave XE",
    keyword: "XE", notes: "Responder DMs y registrar origen. Guion: Posts diapositiva (ID A03). Stories de apoyo: S05-1 a -3.",
  },
  {
    date: "2026-09-26", format: "Reel", family: "Tratamientos",
    topic: "Hollywood Peel: del vídeo a la valoración (Tratamientos)", objective: "Educar y atraer profesionales", kpi: "DMs con palabra clave PEEL",
    keyword: "PEEL", notes: "Responder DMs y registrar origen. Guion: Reels plano a plano (ID T01). Stories de apoyo: S06-1 a -3.",
  },
  {
    date: "2026-09-27", format: "Carrusel", family: "Servicio técnico",
    topic: "Tu inversión también se decide después de la compra (Servicio técnico)", objective: "Respaldo y reducción de objeciones", kpi: "DMs con palabra clave RESPALDO",
    keyword: "RESPALDO", notes: "Revisión del embudo y registro comercial. Guion: Posts diapositiva (ID ST01). Stories de apoyo: S07-1 a -3.",
  },
  {
    date: "2026-09-28", format: "Carrusel", family: "Aparatología",
    topic: "SHR X Ultra: decide qué vas a utilizar (SHR X Ultra)", objective: "Ayudar a elegir y solicitar una demo", kpi: "DMs con palabra clave ULTRA",
    keyword: "ULTRA", notes: "Responder DMs y registrar origen. Guion: Posts diapositiva (ID A04). Stories de apoyo: S08-1 a -3.",
  },
  {
    date: "2026-09-29", format: "Stories", family: "Stories / conversación",
    topic: "Tres preguntas para tu próxima reunión de compra. (SHR X Ultra)", objective: "Conversación e investigación con la audiencia", kpi: "DMs con palabra clave ULTRA",
    keyword: "ULTRA", notes: "Responder DMs y registrar origen. Guion: Stories diarias (ID S09). Stories de apoyo: S09-1 a -3.",
  },
  {
    date: "2026-09-30", format: "Carrusel", family: "Aparatología",
    topic: "Xn: tres preguntas antes de ampliar servicios (SHR Xn)", objective: "Ayudar a elegir y solicitar una demo", kpi: "DMs con palabra clave XN",
    keyword: "XN", notes: "Responder DMs y registrar origen. Guion: Posts diapositiva (ID A05). Stories de apoyo: S10-1 a -3.",
  },
  {
    date: "2026-10-01", format: "Stories", family: "Stories / conversación",
    topic: "¿Quién utilizará tu próximo equipo? (SHR Xn)", objective: "Conversación e investigación con la audiencia", kpi: "DMs con palabra clave XN",
    keyword: "XN", notes: "Responder DMs y registrar origen. Guion: Stories diarias (ID S11). Stories de apoyo: S11-1 a -3.",
  },
  {
    date: "2026-10-02", format: "Reel", family: "Aparatología",
    topic: "Antes de ofrecer reafirmación, mira esto (HIFU V-10 MAX)", objective: "Ayudar a elegir y solicitar una demo", kpi: "DMs con palabra clave HIFU",
    keyword: "HIFU", notes: "Responder DMs y registrar origen. Guion: Reels plano a plano (ID A06). Stories de apoyo: S12-1 a -3.",
  },
  {
    date: "2026-10-03", format: "Reel", family: "Personas / modelos",
    topic: "La primera pregunta que te hacemos (Personas / modelos)", objective: "Confianza y experiencia real", kpi: "DMs con palabra clave CENTRO",
    keyword: "CENTRO", notes: "Responder DMs y registrar origen. Guion: Reels plano a plano (ID M01). Stories de apoyo: S13-1 a -3.",
  },
  {
    date: "2026-10-04", format: "Reel", family: "Servicio técnico",
    topic: "La pregunta que falta cuando comparas máquinas (Servicio técnico)", objective: "Respaldo y reducción de objeciones", kpi: "DMs con palabra clave RESPALDO",
    keyword: "RESPALDO", notes: "Revisión del embudo y registro comercial. Guion: Reels plano a plano (ID ST02). Stories de apoyo: S14-1 a -3.",
  },
  {
    date: "2026-10-05", format: "Reel", family: "Aparatología",
    topic: "Dos áreas de tu carta, una decisión de equipo (Diatermia C-10 Max)", objective: "Ayudar a elegir y solicitar una demo", kpi: "DMs con palabra clave C10",
    keyword: "C10", notes: "Responder DMs y registrar origen. Guion: Reels plano a plano (ID A07). Stories de apoyo: S15-1 a -3.",
  },
  {
    date: "2026-10-06", format: "Stories", family: "Stories / conversación",
    topic: "Elegir tecnología empieza por definir el servicio. (HIFU V-10 MAX)", objective: "Conversación e investigación con la audiencia", kpi: "DMs con palabra clave HIFU",
    keyword: "HIFU", notes: "Responder DMs y registrar origen. Guion: Stories diarias (ID S16). Stories de apoyo: S16-1 a -3.",
  },
  {
    date: "2026-10-07", format: "Reel", family: "Aparatología",
    topic: "¿Cuántas sesiones necesitas para cubrir tu inversión? (SHR X Ultra)", objective: "Ayudar a elegir y solicitar una demo", kpi: "DMs con palabra clave ULTRA",
    keyword: "ULTRA", notes: "Responder DMs y registrar origen. Guion: Reels plano a plano (ID A08). Stories de apoyo: S17-1 a -3.",
  },
  {
    date: "2026-10-08", format: "Stories", family: "Stories / conversación",
    topic: "El servicio técnico también se pregunta antes de comprar. (Sin equipo protagonista)", objective: "Conversación e investigación con la audiencia", kpi: "DMs con palabra clave RESPALDO",
    keyword: "RESPALDO", notes: "Responder DMs y registrar origen. Guion: Stories diarias (ID S18). Stories de apoyo: S18-1 a -3.",
  },
  {
    date: "2026-10-09", format: "Carrusel", family: "Aparatología",
    topic: "Grasa localizada y músculo no son lo mismo (ColdSculptor M40 Ultra)", objective: "Ayudar a elegir y solicitar una demo", kpi: "DMs con palabra clave M40",
    keyword: "M40", notes: "Responder DMs y registrar origen. Guion: Posts diapositiva (ID A09). Stories de apoyo: S19-1 a -3.",
  },
  {
    date: "2026-10-10", format: "Carrusel", family: "Tratamientos",
    topic: "No todo lo que llamamos glow es el mismo tratamiento (Tratamientos)", objective: "Educar y atraer profesionales", kpi: "DMs con palabra clave FACIAL",
    keyword: "FACIAL", notes: "Responder DMs y registrar origen. Guion: Posts diapositiva (ID T02). Stories de apoyo: S20-1 a -3.",
  },
  {
    date: "2026-10-11", format: "Stories", family: "Stories / conversación",
    topic: "¿Qué quieres reforzar antes: depilación o facial? (SHR Xe)", objective: "Conversación e investigación con la audiencia", kpi: "DMs con palabra clave XE",
    keyword: "XE", notes: "Revisión del embudo y registro comercial. Guion: Stories diarias (ID S21). Stories de apoyo: S21-1 a -3.",
  },
  {
    date: "2026-10-12", format: "Reel", family: "Aparatología",
    topic: "La higiene facial también necesita criterio (Hidrapro H-20)", objective: "Ayudar a elegir y solicitar una demo", kpi: "DMs con palabra clave HIDRA",
    keyword: "HIDRA", notes: "Responder DMs y registrar origen. Guion: Reels plano a plano (ID A10). Stories de apoyo: S22-1 a -3.",
  },
  {
    date: "2026-10-13", format: "Stories", family: "Stories / conversación",
    topic: "Dos aplicadores diferentes no cuentan la misma historia. (ColdSculptor M40 Ultra)", objective: "Conversación e investigación con la audiencia", kpi: "DMs con palabra clave M40",
    keyword: "M40", notes: "Responder DMs y registrar origen. Guion: Stories diarias (ID S23). Stories de apoyo: S23-1 a -3.",
  },
  {
    date: "2026-10-14", format: "Carrusel", family: "Aparatología",
    topic: "Conoce T-4 Pro por cómo se trabaja (Diatermia T-4 Pro)", objective: "Ayudar a elegir y solicitar una demo", kpi: "DMs con palabra clave T4",
    keyword: "T4", notes: "Responder DMs y registrar origen. Guion: Posts diapositiva (ID A11). Stories de apoyo: S24-1 a -3.",
  },
  {
    date: "2026-10-15", format: "Stories", family: "Stories / conversación",
    topic: "¿Qué servicio quieres reforzar con diatermia? (Diatermia C-10 Max)", objective: "Conversación e investigación con la audiencia", kpi: "DMs con palabra clave C10",
    keyword: "C10", notes: "Responder DMs y registrar origen. Guion: Stories diarias (ID S25). Stories de apoyo: S25-1 a -3.",
  },
  {
    date: "2026-10-16", format: "Reel", family: "Aparatología",
    topic: "Tu carta marca la elección del equipo (SHR Xe)", objective: "Ayudar a elegir y solicitar una demo", kpi: "DMs con palabra clave XE",
    keyword: "XE", notes: "Responder DMs y registrar origen. Guion: Reels plano a plano (ID A12). Stories de apoyo: S26-1 a -3.",
  },
  {
    date: "2026-10-17", format: "Reel", family: "Personas / modelos",
    topic: "Lo que la cámara no suele enseñar (Personas / modelos)", objective: "Confianza y experiencia real", kpi: "DMs con palabra clave CABINA",
    keyword: "CABINA", notes: "Responder DMs y registrar origen. Guion: Reels plano a plano (ID M02). Stories de apoyo: S27-1 a -3.",
  },
  {
    date: "2026-10-18", format: "Stories", family: "Stories / conversación",
    topic: "¿Te queda alguna duda sobre el respaldo a tu equipo? (Sin equipo protagonista)", objective: "Conversación e investigación con la audiencia", kpi: "DMs con palabra clave RESPALDO",
    keyword: "RESPALDO", notes: "Responder DMs y registrar origen. Guion: Stories diarias (ID S28). Stories de apoyo: S28-1 a -3.",
  },
  {
    date: "2026-10-19", format: "Reel", family: "Aparatología",
    topic: "Qué mirar en una demo de SHR Xn (SHR Xn)", objective: "Ayudar a elegir y solicitar una demo", kpi: "DMs con palabra clave XN",
    keyword: "XN", notes: "Responder DMs y registrar origen. Guion: Reels plano a plano (ID A13). Stories de apoyo: S29-1 a -3.",
  },
  {
    date: "2026-10-20", format: "Carrusel", family: "Aparatología",
    topic: "Tu siguiente paso con SHR X Ultra (SHR X Ultra)", objective: "Ayudar a elegir y solicitar una demo", kpi: "DMs con palabra clave ULTRA",
    keyword: "ULTRA", notes: "Revisión del embudo y registro comercial. Guion: Posts diapositiva (ID A14). Stories de apoyo: S30-1 a -3.",
  },
];

export const INNOVAPRO_CONTENT: RealContentRow[] = [
  {
    idfeed: "A01", title: "¿Tu equipo solo trabaja para un servicio?", caption: "¿Tu equipo solo trabaja para un servicio? Escribe ULTRA en comentarios o por DM y te contamos más.",
    mediaType: "VIDEO", date: "2026-09-21", hour: "13:00:00+02:00",
  },
  {
    idfeed: "A02", title: "Depilación y una segunda línea de servicios", caption: "Depilación y una segunda línea de servicios Escribe XN en comentarios o por DM y te contamos más.",
    mediaType: "VIDEO", date: "2026-09-23", hour: "13:00:00+02:00",
  },
  {
    idfeed: "A03", title: "¿Depilación y facial en tu próximo equipo?", caption: "¿Depilación y facial en tu próximo equipo? Escribe XE en comentarios o por DM y te contamos más.",
    mediaType: "IMAGE", date: "2026-09-25", hour: "13:00:00+02:00",
  },
  {
    idfeed: "T01", title: "Hollywood Peel: del vídeo a la valoración", caption: "Hollywood Peel: del vídeo a la valoración Escribe PEEL en comentarios o por DM y te contamos más.",
    mediaType: "VIDEO", date: "2026-09-26", hour: "13:00:00+02:00",
  },
  {
    idfeed: "ST01", title: "Tu inversión también se decide después de la compra", caption: "Tu inversión también se decide después de la compra Escribe RESPALDO en comentarios o por DM y te contamos más.",
    mediaType: "IMAGE", date: "2026-09-27", hour: "13:00:00+02:00",
  },
  {
    idfeed: "A04", title: "SHR X Ultra: decide qué vas a utilizar", caption: "SHR X Ultra: decide qué vas a utilizar Escribe ULTRA en comentarios o por DM y te contamos más.",
    mediaType: "IMAGE", date: "2026-09-28", hour: "13:00:00+02:00",
  },
  {
    idfeed: "A05", title: "Xn: tres preguntas antes de ampliar servicios", caption: "Xn: tres preguntas antes de ampliar servicios Escribe XN en comentarios o por DM y te contamos más.",
    mediaType: "IMAGE", date: "2026-09-30", hour: "13:00:00+02:00",
  },
  {
    idfeed: "A06", title: "Antes de ofrecer reafirmación, mira esto", caption: "Antes de ofrecer reafirmación, mira esto Escribe HIFU en comentarios o por DM y te contamos más.",
    mediaType: "VIDEO", date: "2026-10-02", hour: "13:00:00+02:00",
  },
  {
    idfeed: "M01", title: "La primera pregunta que te hacemos", caption: "La primera pregunta que te hacemos Escribe CENTRO en comentarios o por DM y te contamos más.",
    mediaType: "VIDEO", date: "2026-10-03", hour: "13:00:00+02:00",
  },
  {
    idfeed: "ST02", title: "La pregunta que falta cuando comparas máquinas", caption: "La pregunta que falta cuando comparas máquinas Escribe RESPALDO en comentarios o por DM y te contamos más.",
    mediaType: "VIDEO", date: "2026-10-04", hour: "13:00:00+02:00",
  },
  {
    idfeed: "A07", title: "Dos áreas de tu carta, una decisión de equipo", caption: "Dos áreas de tu carta, una decisión de equipo Escribe C10 en comentarios o por DM y te contamos más.",
    mediaType: "VIDEO", date: "2026-10-05", hour: "13:00:00+02:00",
  },
  {
    idfeed: "A08", title: "¿Cuántas sesiones necesitas para cubrir tu inversión?", caption: "¿Cuántas sesiones necesitas para cubrir tu inversión? Escribe ULTRA en comentarios o por DM y te contamos más.",
    mediaType: "VIDEO", date: "2026-10-07", hour: "13:00:00+02:00",
  },
  {
    idfeed: "A09", title: "Grasa localizada y músculo no son lo mismo", caption: "Grasa localizada y músculo no son lo mismo Escribe M40 en comentarios o por DM y te contamos más.",
    mediaType: "IMAGE", date: "2026-10-09", hour: "13:00:00+02:00",
  },
  {
    idfeed: "T02", title: "No todo lo que llamamos glow es el mismo tratamiento", caption: "No todo lo que llamamos glow es el mismo tratamiento Escribe FACIAL en comentarios o por DM y te contamos más.",
    mediaType: "IMAGE", date: "2026-10-10", hour: "13:00:00+02:00",
  },
  {
    idfeed: "A10", title: "La higiene facial también necesita criterio", caption: "La higiene facial también necesita criterio Escribe HIDRA en comentarios o por DM y te contamos más.",
    mediaType: "VIDEO", date: "2026-10-12", hour: "13:00:00+02:00",
  },
  {
    idfeed: "A11", title: "Conoce T-4 Pro por cómo se trabaja", caption: "Conoce T-4 Pro por cómo se trabaja Escribe T4 en comentarios o por DM y te contamos más.",
    mediaType: "IMAGE", date: "2026-10-14", hour: "13:00:00+02:00",
  },
  {
    idfeed: "A12", title: "Tu carta marca la elección del equipo", caption: "Tu carta marca la elección del equipo Escribe XE en comentarios o por DM y te contamos más.",
    mediaType: "VIDEO", date: "2026-10-16", hour: "13:00:00+02:00",
  },
  {
    idfeed: "M02", title: "Lo que la cámara no suele enseñar", caption: "Lo que la cámara no suele enseñar Escribe CABINA en comentarios o por DM y te contamos más.",
    mediaType: "VIDEO", date: "2026-10-17", hour: "13:00:00+02:00",
  },
  {
    idfeed: "A13", title: "Qué mirar en una demo de SHR Xn", caption: "Qué mirar en una demo de SHR Xn Escribe XN en comentarios o por DM y te contamos más.",
    mediaType: "VIDEO", date: "2026-10-19", hour: "13:00:00+02:00",
  },
  {
    idfeed: "A14", title: "Tu siguiente paso con SHR X Ultra", caption: "Tu siguiente paso con SHR X Ultra Escribe ULTRA en comentarios o por DM y te contamos más.",
    mediaType: "IMAGE", date: "2026-10-20", hour: "13:00:00+02:00",
  },
];

export const CAPELINO_PLAN: RealPlanRow[] = [
  {
    date: "2026-09-21", day: "lunes", format: "Stories", family: "Stories",
    topic: "Arranque de nueva fase: F1 «NEW WEEK. NEW RULES.» F2 «What stops your scroll?» POV / Unexpected scene", objective: null, kpi: null,
    keyword: null, notes: "Sticker: Encuesta. Frames: 2. Hora: 19:30.",
  },
  {
    date: "2026-09-22", day: "martes", format: "Reel", family: "Immediate Capelino",
    topic: "DON'T BLINK — ORANGE POUR | 0.0s vertido directo + splash naranja; producto legible antes del segundo 1.", objective: "Captación", kpi: "Retención + % no seguidores + replays",
    keyword: "S01", notes: "Test: Producto inmediato vs apertura gráfica. Story de apoyo: F1 macro de botella/copa 90 min antes. F2 repost Reel + slider 🍊",
  },
  {
    date: "2026-09-23", day: "miércoles", format: "Stories", family: "Stories",
    topic: "Lectura S01: F1 frame del Reel + «Fast or cinematic?» F2 Fast / Cinematic", objective: null, kpi: null,
    keyword: null, notes: "Sticker: Encuesta. Frames: 2. Hora: 19:30.",
  },
  {
    date: "2026-09-24", day: "jueves", format: "Stories", family: "Stories",
    topic: "Teaser S02: Plano real de manos montando una mesa. «Tomorrow: real people. No pose.»", objective: null, kpi: null,
    keyword: null, notes: "Sticker: Cuenta atrás. Frames: 1. Hora: 20:30.",
  },
  {
    date: "2026-09-25", day: "viernes", format: "Reel", family: "Capelino Moment",
    topic: "POV: THE TABLE WAS WAITING | Mano deja llaves/gafas → otra entra con copa Capelino → mesa de aperitivo real.", objective: "Captación", kpi: "Compartidos + follows / 1.000 + visitas perfil",
    keyword: "S02", notes: "Test: Humano real/POV vs producto solo. Story de apoyo: F1 «Who starts the plan?» F2 Me / The group. F3 repost Reel.",
  },
  {
    date: "2026-09-26", day: "sábado", format: "Stories", family: "Stories",
    topic: "Capelino IRL: F1 foto real casual de copa/producto. F2 «Where would you take it?»", objective: null, kpi: null,
    keyword: null, notes: "Sticker: Caja de preguntas. Frames: 2. Hora: 19:30.",
  },
  {
    date: "2026-09-27", day: "domingo", format: "Stories", family: "Stories",
    topic: "Research S03: F1 «Next interruption?» F2 Orange door / Vending machine", objective: null, kpi: null,
    keyword: null, notes: "Sticker: Encuesta. Frames: 2. Hora: 20:30.",
  },
  {
    date: "2026-09-28", day: "lunes", format: "Stories", family: "Stories",
    topic: "BTS S03: Resultado de encuesta + detalle del set/puerta. «Tomorrow, open it.»", objective: null, kpi: null,
    keyword: null, notes: "Sticker: Cuenta atrás. Frames: 1. Hora: 20:30.",
  },
  {
    date: "2026-09-29", day: "martes", format: "Reel", family: "Capelino World",
    topic: "CAPELINO INTERRUPTS #00 — THE ORANGE DOOR | 0.0s mano abre → antes de 1.2s aparece un mundo naranja imposible.", objective: "Captación", kpi: "Compartidos + % no seguidores + comentarios",
    keyword: "S03", notes: "Test: Reveal <1.2 s + surrealismo. Story de apoyo: F1 mano en pomo. F2 repost Reel. F3 «Where next?» Hotel / Laundromat",
  },
  {
    date: "2026-09-30", day: "miércoles", format: "Stories", family: "Stories",
    topic: "Cierre / puente a octubre: F1 resultado S03. F2 «OCTOBER STARTS TOMORROW. KEEP IT ORANGE.»", objective: null, kpi: null,
    keyword: null, notes: "Sticker: Sin sticker. Frames: 2. Hora: 20:30.",
  },
  {
    date: "2026-10-01", day: "jueves", format: "Stories", family: "Stories",
    topic: "Teaser de mes: «OCTOBER, BUT MAKE IT ORANGE.» Fondo limpio + botella fría.", objective: null, kpi: null,
    keyword: null, notes: "Sticker: Sin sticker. Frames: 1. Hora: 20:30.",
  },
  {
    date: "2026-10-02", day: "viernes", format: "Reel", family: "Immediate Capelino",
    topic: "THE CAPELINO EFFECT #01 — When the plan turns orange | Primer frame: copa Capelino en cenital + texto «POV: the plan turns orange.»", objective: "Captación", kpi: "% no seguidores + compartidos / alcance",
    keyword: "P01", notes: "Test: Hora A (14:30) + hook con texto. Story de apoyo: F1 teaser 2 h antes: detalle de copa. F2 repost Reel + encuesta «Orange plan? YES / OBVIOUSLY»",
  },
  {
    date: "2026-10-03", day: "sábado", format: "Stories", family: "Stories",
    topic: "Lifestyle: Foto real de producto en mesa/terraza. Texto mínimo: «Saturday looks.»", objective: null, kpi: null,
    keyword: null, notes: "Sticker: Sin sticker. Frames: 1. Hora: 19:30.",
  },
  {
    date: "2026-10-04", day: "domingo", format: "Stories", family: "Stories",
    topic: "Research: F1 «What do you want more of?» F2 opciones: POV / Macro product", objective: null, kpi: null,
    keyword: null, notes: "Sticker: Encuesta. Frames: 2. Hora: 19:30.",
  },
  {
    date: "2026-10-05", day: "lunes", format: "Stories", family: "Stories",
    topic: "BTS P02: Plano del set macro: hielo, naranja, copa. «Tomorrow: 3 seconds of orange.»", objective: null, kpi: null,
    keyword: null, notes: "Sticker: Cuenta atrás opcional. Frames: 1. Hora: 20:30.",
  },
  {
    date: "2026-10-06", day: "martes", format: "Reel", family: "Immediate Capelino",
    topic: "3 SECONDS OF ORANGE — macro / ASMR | 0.0s: líquido entrando en copa en macro. Sin introducción.", objective: "Captación", kpi: "Retención + replays + % no seguidores",
    keyword: "P02", notes: "Test: Hora B (20:30) + sin texto inicial. Story de apoyo: F1 macro antes de publicar. F2 repost + slider 🍊",
  },
  {
    date: "2026-10-07", day: "miércoles", format: "Stories", family: "Stories",
    topic: "The Capelino Test: F1 «Garnish?» F2 Orange slice / No garnish", objective: null, kpi: null,
    keyword: null, notes: "Sticker: Encuesta. Frames: 2. Hora: 19:30.",
  },
  {
    date: "2026-10-08", day: "jueves", format: "Stories", family: "Stories",
    topic: "Capelino Spotted: Foto UGC/real de producto. «SPOTTED.» + ubicación solo si está autorizada.", objective: null, kpi: null,
    keyword: null, notes: "Sticker: Mención si aplica. Frames: 1. Hora: 20:30.",
  },
  {
    date: "2026-10-09", day: "viernes", format: "Reel", family: "Capelino Moment",
    topic: "APERITIVO IN 5 MOVES | Texto: «5 moves. One orange table.» + manos entrando en plano.", objective: "Captación", kpi: "Compartidos + comentarios + visitas perfil",
    keyword: "P03", notes: "Test: POV/manos vs persona completa. Story de apoyo: F1 «Who builds the aperitivo?» F2 encuesta Me / Someone else. F3 repost P03.",
  },
  {
    date: "2026-10-10", day: "sábado", format: "Stories", family: "Stories",
    topic: "Weekend IRL: Foto real casual de copa/producto, sin sobre-diseño. «Capelino IRL.»", objective: null, kpi: null,
    keyword: null, notes: "Sticker: Sin sticker. Frames: 1. Hora: 19:30.",
  },
  {
    date: "2026-10-11", day: "domingo", format: "Stories", family: "Stories",
    topic: "Research P05: «Where should Capelino appear next?» Elevator / Hotel room", objective: null, kpi: null,
    keyword: null, notes: "Sticker: Encuesta. Frames: 2. Hora: 20:30.",
  },
  {
    date: "2026-10-12", day: "lunes", format: "Stories", family: "Stories",
    topic: "Resultado: Publicar resultado encuesta de ayer + mini BTS del concepto ganador.", objective: null, kpi: null,
    keyword: null, notes: "Sticker: Sin sticker. Frames: 1. Hora: 20:30.",
  },
  {
    date: "2026-10-13", day: "martes", format: "Carrusel", family: "The Capelino Test",
    topic: "THE CAPELINO TEST #01 — Pick your scene | Slide 1: «THE CAPELINO TEST — Pick one. No explanations.»", objective: "Experimento / comunidad", kpi: "Comentarios + guardados + visitas perfil",
    keyword: "P04", notes: "Test: Carrusel interactivo vs Reels de captación. Story de apoyo: F1 teaser de 2 opciones. F2 repost carrusel: «No explanations. Pick.»",
  },
  {
    date: "2026-10-14", day: "miércoles", format: "Stories", family: "Stories",
    topic: "Resultado Test: Top combinación/comentario del carrusel. «You chose…»", objective: null, kpi: null,
    keyword: null, notes: "Sticker: Sin sticker. Frames: 1. Hora: 20:30.",
  },
  {
    date: "2026-10-15", day: "jueves", format: "Stories", family: "Stories",
    topic: "Teaser P05: Puertas cerradas de ascensor + «Tomorrow, wrong floor.»", objective: null, kpi: null,
    keyword: null, notes: "Sticker: Cuenta atrás. Frames: 1. Hora: 20:30.",
  },
  {
    date: "2026-10-16", day: "viernes", format: "Reel", family: "Capelino World",
    topic: "CAPELINO INTERRUPTS #01 — THE ELEVATOR | 0.0s dedo pulsa botón naranja → puertas empiezan a abrir antes del segundo 1.", objective: "Captación", kpi: "Shares + comentarios + % no seguidores",
    keyword: "P05", notes: "Test: Reveal <1.5s vs narrativa lenta. Story de apoyo: F1 botón de ascensor. F2 repost Reel. F3 «Where next?» Laundry / Hotel",
  },
  {
    date: "2026-10-17", day: "sábado", format: "Stories", family: "Stories",
    topic: "Community: Resultado «Where next?» + visual rápido de la opción ganadora.", objective: null, kpi: null,
    keyword: null, notes: "Sticker: Sin sticker. Frames: 1. Hora: 20:30.",
  },
  {
    date: "2026-10-18", day: "domingo", format: "Stories", family: "Stories",
    topic: "Macro Sunday: Macro condensación/burbujas. Sin copy o solo «Sunday details.»", objective: null, kpi: null,
    keyword: null, notes: "Sticker: Sin sticker. Frames: 1. Hora: 19:30.",
  },
  {
    date: "2026-10-19", day: "lunes", format: "Stories", family: "Stories",
    topic: "BTS P06: Dos objetos naranjas + «Can you guess the transition?»", objective: null, kpi: null,
    keyword: null, notes: "Sticker: Pregunta. Frames: 2. Hora: 20:30.",
  },
  {
    date: "2026-10-20", day: "martes", format: "Reel", family: "Capelino World",
    topic: "THE ORANGE RULE — match cuts | Objeto naranja ocupa pantalla → match cut inmediato a Capelino.", objective: "Brand / recuerdo", kpi: "Replays + guardados + visitas perfil",
    keyword: "P06", notes: "Test: Reconocimiento visual sin narrativa. Story de apoyo: F1 match-cut teaser. F2 repost + «Once you see orange…»",
  },
  {
    date: "2026-10-21", day: "miércoles", format: "Stories", family: "Stories",
    topic: "A/B: Dos portadas para futuro Reel. «A or B?»", objective: null, kpi: null,
    keyword: null, notes: "Sticker: Encuesta. Frames: 2. Hora: 19:30.",
  },
  {
    date: "2026-10-22", day: "jueves", format: "Stories", family: "Stories",
    topic: "Spot the detail: Frame fijo con un Capelino casi oculto. «Spot it.»", objective: null, kpi: null,
    keyword: null, notes: "Sticker: Pregunta. Frames: 1. Hora: 20:30.",
  },
  {
    date: "2026-10-23", day: "viernes", format: "Reel", family: "Capelino Moment",
    topic: "CAPELINO IRL — GOLDEN HOUR | 0.0s mano deja unas gafas / bolso → otra mano entra con la copa Capelino.", objective: "Captación", kpi: "Shares + follows / 1.000 espectadores",
    keyword: "P07", notes: "Test: Real/lifestyle vs producción conceptual. Story de apoyo: F1 golden hour real. F2 repost Reel + «IRL > studio?»",
  },
  {
    date: "2026-10-24", day: "sábado", format: "Stories", family: "Stories",
    topic: "UGC / comunidad: Repost de mención si existe; si no, foto propia casual con «Capelino spotted.»", objective: null, kpi: null,
    keyword: null, notes: "Sticker: Mención. Frames: 1. Hora: 20:30.",
  },
  {
    date: "2026-10-25", day: "domingo", format: "Stories", family: "Stories",
    topic: "Soundtrack: Visual vinilo/retro + «Pick the soundtrack» Disco / Indie", objective: null, kpi: null,
    keyword: null, notes: "Sticker: Encuesta. Frames: 2. Hora: 19:30.",
  },
  {
    date: "2026-10-26", day: "lunes", format: "Stories", family: "Stories",
    topic: "Teaser P08: Escena del juego desenfocada + «Tomorrow. 3 seconds.»", objective: null, kpi: null,
    keyword: null, notes: "Sticker: Cuenta atrás. Frames: 1. Hora: 20:30.",
  },
  {
    date: "2026-10-27", day: "martes", format: "Reel", family: "The Capelino Test",
    topic: "THE CAPELINO TEST #02 — SPOT IT | Texto: «You have 3 seconds. Find Capelino.» Escena retro naranja desde frame 0.", objective: "Captación / juego", kpi: "Comentarios + retención + replays",
    keyword: "P08", notes: "Test: Gamificación + comentario vs contenido pasivo. Story de apoyo: F1 «Ready?» F2 repost Reel. F3 «Found it before reveal?» Yes / No",
  },
  {
    date: "2026-10-28", day: "miércoles", format: "Stories", family: "Stories",
    topic: "Resultado P08: Mostrar ubicación exacta del producto + % de encuesta.", objective: null, kpi: null,
    keyword: null, notes: "Sticker: Sin sticker. Frames: 1. Hora: 20:30.",
  },
  {
    date: "2026-10-29", day: "jueves", format: "Stories", family: "Stories",
    topic: "Sensory: Macro naranja/hielo/condensación. «Close-up season.»", objective: null, kpi: null,
    keyword: null, notes: "Sticker: Sin sticker. Frames: 1. Hora: 19:30.",
  },
  {
    date: "2026-10-30", day: "viernes", format: "Stories", family: "Stories",
    topic: "Orange After Dark: F1 escena retro nocturna naranja. F2 «After dark: vinyl / city lights?»", objective: null, kpi: null,
    keyword: null, notes: "Sticker: Encuesta. Frames: 2. Hora: 20:30.",
  },
  {
    date: "2026-10-31", day: "sábado", format: "Stories", family: "Stories",
    topic: "Halloween: F1 «CAPELINO AFTER DARK.» F2 bodegón naranja oscuro / sombras / producto.", objective: null, kpi: null,
    keyword: null, notes: "Sticker: Emoji slider 🍊. Frames: 2. Hora: 20:30.",
  },
];

export const CAPELINO_CONTENT: RealContentRow[] = [
  {
    idfeed: "S01", title: "DON'T BLINK — ORANGE POUR", caption: "DON'T BLINK — ORANGE POUR | 0.0s vertido directo + splash naranja; producto legible antes del segundo 1.",
    mediaType: "VIDEO", date: "2026-09-22", hour: "20:30:00+02:00",
  },
  {
    idfeed: "S02", title: "POV: THE TABLE WAS WAITING", caption: "POV: THE TABLE WAS WAITING | Mano deja llaves/gafas → otra entra con copa Capelino → mesa de aperitivo real.",
    mediaType: "VIDEO", date: "2026-09-25", hour: "14:30:00+02:00",
  },
  {
    idfeed: "S03", title: "CAPELINO INTERRUPTS #00 — THE ORANGE DOOR", caption: "CAPELINO INTERRUPTS #00 — THE ORANGE DOOR | 0.0s mano abre → antes de 1.2s aparece un mundo naranja imposible.",
    mediaType: "VIDEO", date: "2026-09-29", hour: "20:30:00+02:00",
  },
  {
    idfeed: "P01", title: "THE CAPELINO EFFECT #01 — When the plan turns orange", caption: "THE CAPELINO EFFECT #01 — When the plan turns orange | Primer frame: copa Capelino en cenital + texto «POV: the plan turns orange.»",
    mediaType: "VIDEO", date: "2026-10-02", hour: "14:30:00+02:00",
  },
  {
    idfeed: "P02", title: "3 SECONDS OF ORANGE — macro / ASMR", caption: "3 SECONDS OF ORANGE — macro / ASMR | 0.0s: líquido entrando en copa en macro. Sin introducción.",
    mediaType: "VIDEO", date: "2026-10-06", hour: "20:30:00+02:00",
  },
  {
    idfeed: "P03", title: "APERITIVO IN 5 MOVES", caption: "APERITIVO IN 5 MOVES | Texto: «5 moves. One orange table.» + manos entrando en plano.",
    mediaType: "VIDEO", date: "2026-10-09", hour: "14:30:00+02:00",
  },
  {
    idfeed: "P04", title: "THE CAPELINO TEST #01 — Pick your scene", caption: "THE CAPELINO TEST #01 — Pick your scene | Slide 1: «THE CAPELINO TEST — Pick one. No explanations.»",
    mediaType: "IMAGE", date: "2026-10-13", hour: "20:30:00+02:00",
  },
  {
    idfeed: "P05", title: "CAPELINO INTERRUPTS #01 — THE ELEVATOR", caption: "CAPELINO INTERRUPTS #01 — THE ELEVATOR | 0.0s dedo pulsa botón naranja → puertas empiezan a abrir antes del segundo 1.",
    mediaType: "VIDEO", date: "2026-10-16", hour: "14:30:00+02:00",
  },
  {
    idfeed: "P06", title: "THE ORANGE RULE — match cuts", caption: "THE ORANGE RULE — match cuts | Objeto naranja ocupa pantalla → match cut inmediato a Capelino.",
    mediaType: "VIDEO", date: "2026-10-20", hour: "20:30:00+02:00",
  },
  {
    idfeed: "P07", title: "CAPELINO IRL — GOLDEN HOUR", caption: "CAPELINO IRL — GOLDEN HOUR | 0.0s mano deja unas gafas / bolso → otra mano entra con la copa Capelino.",
    mediaType: "VIDEO", date: "2026-10-23", hour: "14:30:00+02:00",
  },
  {
    idfeed: "P08", title: "THE CAPELINO TEST #02 — SPOT IT", caption: "THE CAPELINO TEST #02 — SPOT IT | Texto: «You have 3 seconds. Find Capelino.» Escena retro naranja desde frame 0.",
    mediaType: "VIDEO", date: "2026-10-27", hour: "20:30:00+01:00",
  },
];

export const CAPELINO_IDEAS: RealIdeaRow[] = [
  {
    priority: "Alta", family: "Immediate Capelino", idea: "FRIDGE REVEAL",
    hook: "«Open for orange.»", execution: "Nevera blanca → puerta abre → solo Capelino + luz naranja", resources: "Nevera, producto, LED",
    duration: "5–6 s", objective: "Captación", whenToUse: "Si P02 funciona",
  },
  {
    priority: "Alta", family: "Capelino World", idea: "LAUNDROMAT INTERRUPT",
    hook: "Lavadora gira naranja", execution: "Plano cotidiano → tambor se llena de luz naranja → bottle silhouette", resources: "Lavandería o IA",
    duration: "7 s", objective: "Captación", whenToUse: "Si P05 funciona",
  },
  {
    priority: "Alta", family: "The Capelino Test", idea: "WHICH GLASS?",
    hook: "«Pick one in 2 sec.»", execution: "2 copas/estéticas → elección rápida", resources: "Estudio, 2 copas",
    duration: "6 s", objective: "Comentarios", whenToUse: "Si P08 funciona",
  },
  {
    priority: "Media", family: "Capelino Moment", idea: "TABLE BEFORE / AFTER",
    hook: "«Same table. Different light.»", execution: "Mesa neutra → transición luz naranja + producto", resources: "Mesa, luz",
    duration: "6 s", objective: "Brand / share", whenToUse: "Para semana con poco rodaje",
  },
  {
    priority: "Media", family: "Immediate Capelino", idea: "CONDENSATION MACRO",
    hook: "Sin texto", execution: "Macro botella helada + gotas + naranja", resources: "Macro, producto frío",
    duration: "4 s", objective: "Retención", whenToUse: "Filler premium",
  },
  {
    priority: "Media", family: "Capelino World", idea: "HOTEL DOOR",
    hook: "«Room service?»", execution: "Puerta hotel → interior naranja imposible", resources: "Hotel/IA",
    duration: "7 s", objective: "Captación", whenToUse: "Siguiente Interrupt",
  },
  {
    priority: "Media", family: "Capelino Moment", idea: "BAG CHECK",
    hook: "«What’s in the bag?»", execution: "Adulto abre tote: objetos naranjas + Capelino", resources: "Persona adulta, tote",
    duration: "8 s", objective: "Curiosidad", whenToUse: "UGC controlado",
  },
  {
    priority: "Baja", family: "Brand", idea: "VINYL LOOP",
    hook: "«Orange on repeat.»", execution: "Vinilo gira → match cut copa", resources: "Vinilo, copa",
    duration: "6 s", objective: "Brand", whenToUse: "Apoyo visual",
  },
  {
    priority: "Baja", family: "The Capelino Test", idea: "3 ORANGE THINGS",
    hook: "«Which one is Capelino?»", execution: "3 objetos macro, solo uno producto", resources: "Estudio",
    duration: "5 s", objective: "Juego", whenToUse: "Story/Reel híbrido",
  },
  {
    priority: "Baja", family: "Capelino World", idea: "SHADOW BOTTLE",
    hook: "Sin texto", execution: "Sombra proyecta forma botella antes del reveal", resources: "Luz dura, silueta",
    duration: "6 s", objective: "Brand", whenToUse: "Post estético",
  },
];
// ---------------------------------------------------------------------------
// Guion de producción real, extraído de las pestañas "Reels plano a plano",
// "Posts diapositiva" y "Copies y rodaje" (Innovapro) y "02_GUIONES_FEED"
// (Capelino) de los Excel originales. Se enlaza por idfeed con
// INNOVAPRO_CONTENT / CAPELINO_CONTENT al sembrar la base de datos, y queda
// disponible en la pestaña "Guion y rodaje" de cada cliente.

export type RealProductionStep = {
  label: string | null;
  function?: string | null;
  action: string | null;
  onScreenText: string | null;
  voiceover?: string | null;
  // Solo en stories: línea/equipo del que habla el frame, y qué interacción
  // lleva (encuesta, caja de preguntas, cuenta atrás...).
  family?: string | null;
  interaction?: string | null;
  notes: string | null;
};

export type RealProductionSheet = {
  format: string | null;
  concept?: string | null;
  whoAppears: string | null;
  materials: string | null;
  validateBeforePublish: string | null;
  editing?: string | null;
  kpi?: string | null;
  cta?: string | null;
  approval: string;
  steps: RealProductionStep[];
  // Stories del mismo día que esta pieza (se añaden al sembrar, por fecha —
  // ver INNOVAPRO_STORIES / CAPELINO_STORIES más abajo).
  stories?: RealProductionStep[];
};

export const INNOVAPRO_PRODUCTION: Record<string, RealProductionSheet> =
{
  "A01": {
    "format": "REEL",
    "concept": null,
    "whoAppears": "Asesor a cámara al inicio y al cierre. Profesional y modelo adulta en planos de recurso.",
    "materials": "SHR X Ultra real; manípulos identificados; 3 clips propios; asesor con micro.",
    "validateBeforePublish": "Validar módulos disponibles. Aplicaciones reales supervisadas; protección adecuada; sin ajustes de pantalla legibles.",
    "editing": null,
    "kpi": null,
    "cta": null,
    "approval": "Pendiente",
    "steps": [
      {
        "label": "0–4 s",
        "function": "Hook",
        "action": "Plano medio del asesor; máquina visible a su lado desde el primer fotograma.",
        "onScreenText": "¿Tu equipo solo trabaja para un servicio?",
        "voiceover": "¿Tu equipo solo trabaja para un servicio?",
        "notes": "Asesor a cámara al inicio y al cierre. Profesional y modelo adulta en planos de recurso. Corte limpio; subtítulos revisados."
      },
      {
        "label": "4–10 s",
        "function": "Desarrollo",
        "action": "Tres cortes de 2 s: equipo, cabezal de depilación y cabezal facial.",
        "onScreenText": "SHR X Ultra",
        "voiceover": "SHR X Ultra reúne distintas tecnologías en una plataforma configurable.",
        "notes": "Corte limpio; subtítulos revisados."
      },
      {
        "label": "10–16 s",
        "function": "Desarrollo",
        "action": "Profesional selecciona el cabezal correcto; corte a aplicación validada.",
        "onScreenText": "Depilación · E-light · Nd:YAG",
        "voiceover": "Depilación, fotorejuvenecimiento con E-light y aplicaciones de Nd:YAG, según configuración.",
        "notes": "Corte limpio; subtítulos revisados."
      },
      {
        "label": "16–22 s",
        "function": "Desarrollo",
        "action": "Asesor señala una carta con dos servicios, sin cifras de facturación.",
        "onScreenText": "Primero, tu carta de servicios",
        "voiceover": "La decisión empieza por lo que tus clientes piden, no por acumular funciones.",
        "notes": "Corte limpio; subtítulos revisados."
      },
      {
        "label": "22–28 s",
        "function": "Desarrollo",
        "action": "Plano detalle de ficha comercial; módulos incluidos y opcionales separados.",
        "onScreenText": "Configuración a medida",
        "voiceover": "Revisamos qué utilizarías, qué necesitas aprender y qué incluye tu propuesta.",
        "notes": "Corte limpio; subtítulos revisados."
      },
      {
        "label": "28–35 s",
        "function": "CTA",
        "action": "Asesor a cámara; equipo en segundo plano. Mantener CTA 4 s.",
        "onScreenText": "¿Tienes centro? Comenta ULTRA",
        "voiceover": "¿Tienes un centro? Comenta ULTRA y dinos qué servicio quieres potenciar.",
        "notes": "CTA fijo al menos 4 s."
      }
    ]
  },
  "A02": {
    "format": "REEL",
    "concept": null,
    "whoAppears": "Voz en off humana. Profesional y modelo adulta sin diálogo.",
    "materials": "Xn, SHR y Nd:YAG reales. Dos secuencias independientes; fichas rotuladas.",
    "validateBeforePublish": "No mezclar cabezales. No presentar aplicaciones Nd:YAG como válidas para cualquier persona.",
    "editing": null,
    "kpi": null,
    "cta": null,
    "approval": "Pendiente",
    "steps": [
      {
        "label": "0–4 s",
        "function": "Hook",
        "action": "Primer plano de dos manípulos colocados por separado.",
        "onScreenText": "Una inversión. Dos líneas por valorar.",
        "voiceover": "¿Buscas depilación y quieres estudiar una segunda línea de servicios?",
        "notes": "Voz en off humana. Profesional y modelo adulta sin diálogo. Corte limpio; subtítulos revisados."
      },
      {
        "label": "4–10 s",
        "function": "Desarrollo",
        "action": "Abrir plano hasta mostrar Xn completo y nombre legible.",
        "onScreenText": "SHR Xn",
        "voiceover": "Este es SHR Xn, con tecnología SHR y Nd:YAG.",
        "notes": "Corte limpio; subtítulos revisados."
      },
      {
        "label": "10–16 s",
        "function": "Desarrollo",
        "action": "Plano corto de depilación supervisada; sin reloj ni resultado simulado.",
        "onScreenText": "Depilación SHR",
        "voiceover": "Una parte de la propuesta se centra en la depilación.",
        "notes": "Corte limpio; subtítulos revisados."
      },
      {
        "label": "16–22 s",
        "function": "Desarrollo",
        "action": "Mostrar Nd:YAG identificado; inserto breve de Carbon Peel supervisado.",
        "onScreenText": "Nd:YAG: otra aplicación, otro protocolo",
        "voiceover": "La otra permite valorar Carbon Peel y retirada de tatuajes, con protocolos específicos.",
        "notes": "Corte limpio; subtítulos revisados."
      },
      {
        "label": "22–28 s",
        "function": "Desarrollo",
        "action": "Profesional revisa ficha del centro con asesor.",
        "onScreenText": "¿Qué demanda tienes en tu centro?",
        "voiceover": "Antes de elegir, revisamos demanda, formación y configuración. No todos los centros necesitan lo mismo.",
        "notes": "Corte limpio; subtítulos revisados."
      },
      {
        "label": "28–35 s",
        "function": "CTA",
        "action": "Equipo, marca y texto en fondo claro.",
        "onScreenText": "Comenta XN",
        "voiceover": "Comenta XN y dinos qué servicio quieres incorporar. Te orientamos desde ahí.",
        "notes": "CTA fijo al menos 4 s."
      }
    ]
  },
  "T01": {
    "format": "REEL",
    "concept": null,
    "whoAppears": "Voz en off de formadora. Profesional y modelo adulta; modelo no habla.",
    "materials": "Carbon Peel real con Nd:YAG, consentimiento; planos sin marca hasta cierre.",
    "validateBeforePublish": "Validación de formadora. No fabricar antes/después ni confundir higiene facial con tratamiento indicado para todos.",
    "editing": null,
    "kpi": null,
    "cta": null,
    "approval": "Pendiente",
    "steps": [
      {
        "label": "0–4 s",
        "function": "Hook",
        "action": "Detalle visual del protocolo real; cliente con protección indicada.",
        "onScreenText": "Hollywood Peel: más allá del vídeo",
        "voiceover": "Este tratamiento no empieza con el disparo.",
        "notes": "Voz en off de formadora. Profesional y modelo adulta; modelo no habla. Corte limpio; subtítulos revisados."
      },
      {
        "label": "4–10 s",
        "function": "Desarrollo",
        "action": "Profesional conversa con la modelo antes de la aplicación.",
        "onScreenText": "Primero, valorar",
        "voiceover": "Empieza con una valoración profesional y con expectativas realistas.",
        "notes": "Corte limpio; subtítulos revisados."
      },
      {
        "label": "10–16 s",
        "function": "Desarrollo",
        "action": "Aplicación por profesional; plano lateral, no enseñar parámetros.",
        "onScreenText": "Carbon Peel con Nd:YAG",
        "voiceover": "El Carbon Peel utiliza Nd:YAG dentro de un protocolo específico.",
        "notes": "Corte limpio; subtítulos revisados."
      },
      {
        "label": "16–22 s",
        "function": "Desarrollo",
        "action": "Cortes de preparación y ejecución; sin filtros de belleza.",
        "onScreenText": "Protocolo y formación",
        "voiceover": "La técnica, la selección de la persona y la formación importan.",
        "notes": "Corte limpio; subtítulos revisados."
      },
      {
        "label": "22–28 s",
        "function": "Desarrollo",
        "action": "Modelo incorporándose. No etiquetar como después.",
        "onScreenText": "¿Encaja en tu carta?",
        "voiceover": "Si tienes un centro, estudia primero cómo encaja en tu oferta.",
        "notes": "Corte limpio; subtítulos revisados."
      },
      {
        "label": "28–35 s",
        "function": "CTA",
        "action": "Cartela limpia con marca; sin equipo protagonista.",
        "onScreenText": "Profesionales: escribe PEEL",
        "voiceover": "Escribe PEEL y cuéntanos con qué tecnología trabajas.",
        "notes": "CTA fijo al menos 4 s."
      }
    ]
  },
  "A06": {
    "format": "REEL",
    "concept": null,
    "whoAppears": "Formadora habla a cámara en apertura y cierre. Modelo adulta en recursos.",
    "materials": "HIFU V-10 MAX real, cabezal correcto, entrevista y aplicación supervisada.",
    "validateBeforePublish": "Sin profundidades ni porcentajes. No decir cirugía equivalente, resultados garantizados o sin riesgos.",
    "editing": null,
    "kpi": null,
    "cta": null,
    "approval": "Pendiente",
    "steps": [
      {
        "label": "0–4 s",
        "function": "Hook",
        "action": "Formadora en plano medio; HIFU a su lado.",
        "onScreenText": "Antes de ofrecer reafirmación…",
        "voiceover": "¿Quieres incorporar reafirmación a tu centro?",
        "notes": "Formadora habla a cámara en apertura y cierre. Modelo adulta en recursos. Corte limpio; subtítulos revisados."
      },
      {
        "label": "4–10 s",
        "function": "Desarrollo",
        "action": "Detalle de HIFU y manípulo real.",
        "onScreenText": "HIFU V-10 MAX",
        "voiceover": "HIFU V-10 MAX utiliza ultrasonido focalizado para trabajar la reafirmación facial y corporal.",
        "notes": "Corte limpio; subtítulos revisados."
      },
      {
        "label": "10–16 s",
        "function": "Desarrollo",
        "action": "Valoración sin marcas de disparo ni mapas técnicos.",
        "onScreenText": "La valoración va primero",
        "voiceover": "La elección del tratamiento empieza por valorar cada caso.",
        "notes": "Corte limpio; subtítulos revisados."
      },
      {
        "label": "16–22 s",
        "function": "Desarrollo",
        "action": "Recurso de aplicación validado por formadora; cámara lateral.",
        "onScreenText": "Ve la aplicación real",
        "voiceover": "En una demostración puedes conocer su manejo y resolver dudas de aplicación.",
        "notes": "Corte limpio; subtítulos revisados."
      },
      {
        "label": "22–28 s",
        "function": "Desarrollo",
        "action": "Formadora enseña documentación; sin profundidades visibles.",
        "onScreenText": "Formación y expectativas claras",
        "voiceover": "También debes revisar formación y expectativas, sin prometer un resultado idéntico a todos.",
        "notes": "Corte limpio; subtítulos revisados."
      },
      {
        "label": "28–35 s",
        "function": "CTA",
        "action": "Formadora a cámara.",
        "onScreenText": "Comenta HIFU: facial o corporal",
        "voiceover": "Comenta HIFU y dinos si buscas ampliar tu oferta facial o corporal.",
        "notes": "CTA fijo al menos 4 s."
      }
    ]
  },
  "M01": {
    "format": "REEL",
    "concept": null,
    "whoAppears": "Asesor real habla en todas las escenas. No necesita modelo ni cliente.",
    "materials": "Una persona del equipo, mesa, ficha ficticia y micro.",
    "validateBeforePublish": "No inventar testimonio ni cifras de centros. El asesor interpreta su función real.",
    "editing": null,
    "kpi": null,
    "cta": null,
    "approval": "Pendiente",
    "steps": [
      {
        "label": "0–4 s",
        "function": "Hook",
        "action": "Asesor mira a cámara; plano cercano.",
        "onScreenText": "La primera pregunta no es tu presupuesto",
        "voiceover": "¿Sabes qué preguntamos antes de hablar de máquinas?",
        "notes": "Asesor real habla en todas las escenas. No necesita modelo ni cliente. Corte limpio; subtítulos revisados."
      },
      {
        "label": "4–10 s",
        "function": "Desarrollo",
        "action": "Asesor sentado, corte a ficha vacía.",
        "onScreenText": "¿Qué necesita tu centro?",
        "voiceover": "Es qué necesita tu centro y qué quieres mejorar.",
        "notes": "Corte limpio; subtítulos revisados."
      },
      {
        "label": "10–16 s",
        "function": "Desarrollo",
        "action": "Mismo asesor, ligero cambio de encuadre.",
        "onScreenText": "Tu carta actual",
        "voiceover": "Nos cuentas qué servicios ofreces y cuáles te están pidiendo.",
        "notes": "Corte limpio; subtítulos revisados."
      },
      {
        "label": "16–22 s",
        "function": "Desarrollo",
        "action": "Escribe tres palabras: demanda, equipo, agenda.",
        "onScreenText": "Demanda. Equipo. Agenda.",
        "voiceover": "Después revisamos quién lo trabajará y cómo encajará en tu agenda.",
        "notes": "Corte limpio; subtítulos revisados."
      },
      {
        "label": "22–28 s",
        "function": "Desarrollo",
        "action": "Plano medio con equipos desenfocados; ninguno protagonista.",
        "onScreenText": "Primero escuchamos",
        "voiceover": "Con esa información podemos hablar de opciones concretas, no de una recomendación genérica.",
        "notes": "Corte limpio; subtítulos revisados."
      },
      {
        "label": "28–35 s",
        "function": "CTA",
        "action": "Cierre cercano, tono conversacional.",
        "onScreenText": "Escribe CENTRO",
        "voiceover": "Escribe CENTRO y cuéntanos qué quieres conseguir con tu próxima inversión.",
        "notes": "CTA fijo al menos 4 s."
      }
    ]
  },
  "ST02": {
    "format": "REEL",
    "concept": null,
    "whoAppears": "Voz en off humana. Nadie a cámara; no interviene personal técnico.",
    "materials": "Motion graphics sencillo, fotos propias de equipos cerrados y texto. No grabar en servicio técnico.",
    "validateBeforePublish": "No escenificar llamadas, reparaciones ni tiempos de respuesta. Condiciones sujetas al servicio y al caso. No recreación con actores, stock o IA del área restringida.",
    "editing": null,
    "kpi": null,
    "cta": null,
    "approval": "Pendiente",
    "steps": [
      {
        "label": "0–4 s",
        "function": "Hook",
        "action": "Animar dos fichas genéricas: equipo / precio.",
        "onScreenText": "Cuando comparas máquinas…",
        "voiceover": "Cuando comparas máquinas, sueles mirar prestaciones y precio.",
        "notes": "Voz en off humana. Nadie a cámara; no interviene personal técnico. Corte limpio; subtítulos revisados."
      },
      {
        "label": "4–10 s",
        "function": "Desarrollo",
        "action": "Entrar una tercera tarjeta, sin personas ni taller.",
        "onScreenText": "¿Y después de comprar?",
        "voiceover": "Pero hay otra pregunta: ¿qué respaldo tendré después de comprar?",
        "notes": "Corte limpio; subtítulos revisados."
      },
      {
        "label": "10–16 s",
        "function": "Desarrollo",
        "action": "Fotografía exterior de equipo; pequeño movimiento digital.",
        "onScreenText": "Especialistas en aparatología",
        "voiceover": "En Innovapro contamos con servicio técnico especializado en aparatología estética.",
        "notes": "Corte limpio; subtítulos revisados."
      },
      {
        "label": "16–22 s",
        "function": "Desarrollo",
        "action": "Tres palabras aparecen una a una.",
        "onScreenText": "Asistencia. Mantenimiento. Reparación.",
        "voiceover": "Un respaldo que incluye asistencia, mantenimiento y reparación, según las condiciones de tu servicio.",
        "notes": "Corte limpio; subtítulos revisados."
      },
      {
        "label": "22–28 s",
        "function": "Desarrollo",
        "action": "Marca en fondo claro; diseño tipográfico.",
        "onScreenText": "Conoce las condiciones",
        "voiceover": "Las condiciones deben quedar claras para tu equipo y tu centro.",
        "notes": "Corte limpio; subtítulos revisados."
      },
      {
        "label": "28–35 s",
        "function": "CTA",
        "action": "CTA tipográfico fijo, sin imágenes del área técnica.",
        "onScreenText": "Escribe RESPALDO",
        "voiceover": "Escribe RESPALDO y dinos qué necesitas aclarar antes de decidir.",
        "notes": "CTA fijo al menos 4 s."
      }
    ]
  },
  "A07": {
    "format": "REEL",
    "concept": null,
    "whoAppears": "Voz en off humana. Profesional y modelo adulta, sin diálogo.",
    "materials": "C-10 Max, aplicadores faciales y corporales, dos sesiones propias diferenciadas.",
    "validateBeforePublish": "Solo modos y accesorios documentados. No mostrar calor extremo ni prometer quemar grasa.",
    "editing": null,
    "kpi": null,
    "cta": null,
    "approval": "Pendiente",
    "steps": [
      {
        "label": "0–4 s",
        "function": "Hook",
        "action": "Alternar plano de rostro y cabina corporal, después equipo.",
        "onScreenText": "Facial o corporal: empieza por tu objetivo",
        "voiceover": "¿Quieres reforzar facial, corporal o ambos?",
        "notes": "Voz en off humana. Profesional y modelo adulta, sin diálogo. Corte limpio; subtítulos revisados."
      },
      {
        "label": "4–10 s",
        "function": "Desarrollo",
        "action": "C-10 Max frontal y detalle de nombre.",
        "onScreenText": "Diatermia C-10 Max",
        "voiceover": "C-10 Max ofrece diatermia capacitiva y resistiva para trabajo profesional.",
        "notes": "Corte limpio; subtítulos revisados."
      },
      {
        "label": "10–16 s",
        "function": "Desarrollo",
        "action": "Profesional escoge aplicador y prepara cabina.",
        "onScreenText": "El aplicador responde al protocolo",
        "voiceover": "Los aplicadores y el protocolo se eligen según la valoración y el objetivo.",
        "notes": "Corte limpio; subtítulos revisados."
      },
      {
        "label": "16–22 s",
        "function": "Desarrollo",
        "action": "Dos secuencias distintas de trabajo facial y corporal.",
        "onScreenText": "Una plataforma, distintos protocolos",
        "voiceover": "Puedes valorar protocolos de reafirmación facial y remodelación corporal, según cada caso.",
        "notes": "Corte limpio; subtítulos revisados."
      },
      {
        "label": "22–28 s",
        "function": "Desarrollo",
        "action": "Profesional conversa con formadora.",
        "onScreenText": "Aprender a integrarla",
        "voiceover": "La demostración debe ayudarte a entender también cómo integrarla en tu día a día.",
        "notes": "Corte limpio; subtítulos revisados."
      },
      {
        "label": "28–35 s",
        "function": "CTA",
        "action": "Equipo en plano completo y CTA.",
        "onScreenText": "Comenta C10",
        "voiceover": "Comenta C10 y dinos si tu prioridad es facial o corporal.",
        "notes": "CTA fijo al menos 4 s."
      }
    ]
  },
  "A08": {
    "format": "REEL",
    "concept": null,
    "whoAppears": "Asesor a cámara con pizarra. No necesita modelo.",
    "materials": "Ultra al fondo; pizarra; tres tarjetas: inversión, margen, demanda.",
    "validateBeforePublish": "No poner precio, beneficio ni plazo no verificados. Hablar de estimación, no garantía.",
    "editing": null,
    "kpi": null,
    "cta": null,
    "approval": "Pendiente",
    "steps": [
      {
        "label": "0–4 s",
        "function": "Hook",
        "action": "Asesor junto al Ultra, pregunta directa.",
        "onScreenText": "¿Cuántas sesiones necesitas?",
        "voiceover": "¿Cuántas sesiones necesitas para cubrir tu inversión?",
        "notes": "Asesor a cámara con pizarra. No necesita modelo. Corte limpio; subtítulos revisados."
      },
      {
        "label": "4–10 s",
        "function": "Desarrollo",
        "action": "Pizarra: inversión total.",
        "onScreenText": "1. Inversión total",
        "voiceover": "Primero, calcula la inversión completa, no solo el precio que ves anunciado.",
        "notes": "Corte limpio; subtítulos revisados."
      },
      {
        "label": "10–16 s",
        "function": "Desarrollo",
        "action": "Pizarra: precio por sesión menos costes.",
        "onScreenText": "2. Margen por sesión",
        "voiceover": "Después, estima lo que queda por sesión al descontar sus costes.",
        "notes": "Corte limpio; subtítulos revisados."
      },
      {
        "label": "16–22 s",
        "function": "Desarrollo",
        "action": "Asesor señala agenda ficticia.",
        "onScreenText": "3. Demanda real",
        "voiceover": "Y comprueba si tienes demanda y agenda para sostener esa actividad.",
        "notes": "Corte limpio; subtítulos revisados."
      },
      {
        "label": "22–28 s",
        "function": "Desarrollo",
        "action": "Ultra cerrado junto al asesor en zona comercial.",
        "onScreenText": "Inversión y respaldo",
        "voiceover": "Al valorar SHR X Ultra, pregunta también por el respaldo técnico después de comprar.",
        "notes": "Corte limpio; subtítulos revisados."
      },
      {
        "label": "28–35 s",
        "function": "CTA",
        "action": "Plano cercano, CTA grande.",
        "onScreenText": "Comenta ULTRA",
        "voiceover": "Comenta ULTRA y dinos qué servicio quieres potenciar. Hablamos de tu caso.",
        "notes": "CTA fijo al menos 4 s."
      }
    ]
  },
  "A10": {
    "format": "REEL",
    "concept": null,
    "whoAppears": "Voz en off humana. Profesional y modelo adulta sin hablar.",
    "materials": "Hidrapro H-20, hidrodermoabrasión y valoración real.",
    "validateBeforePublish": "No afirmar número de cabezales. No piel perfecta instantánea ni mismo protocolo para todos.",
    "editing": null,
    "kpi": null,
    "cta": null,
    "approval": "Pendiente",
    "steps": [
      {
        "label": "0–4 s",
        "function": "Hook",
        "action": "Primer plano de cabezal en uso supervisado.",
        "onScreenText": "La higiene facial también necesita criterio",
        "voiceover": "Una higiene facial no debería ser el mismo protocolo para todas las personas.",
        "notes": "Voz en off humana. Profesional y modelo adulta sin hablar. Corte limpio; subtítulos revisados."
      },
      {
        "label": "4–10 s",
        "function": "Desarrollo",
        "action": "Profesional valora piel; modelo escucha.",
        "onScreenText": "Primero, valoración",
        "voiceover": "Primero se valora la piel y se define el objetivo del servicio.",
        "notes": "Corte limpio; subtítulos revisados."
      },
      {
        "label": "10–16 s",
        "function": "Desarrollo",
        "action": "Hidrapro completo y nombre en foco.",
        "onScreenText": "Hidrapro H-20",
        "voiceover": "Hidrapro H-20 incorpora hidrodermoabrasión para trabajar la higiene facial.",
        "notes": "Corte limpio; subtítulos revisados."
      },
      {
        "label": "16–22 s",
        "function": "Desarrollo",
        "action": "Secuencia de preparación y un paso validado.",
        "onScreenText": "Cada paso tiene una función",
        "voiceover": "Lo importante es elegir cada paso con criterio, no utilizar todos los accesorios.",
        "notes": "Corte limpio; subtítulos revisados."
      },
      {
        "label": "22–28 s",
        "function": "Desarrollo",
        "action": "Profesional anota protocolo; cliente sale de cabina.",
        "onScreenText": "Una carta facial bien explicada",
        "voiceover": "Para tu centro, es una oportunidad de explicar mejor tu propuesta facial.",
        "notes": "Corte limpio; subtítulos revisados."
      },
      {
        "label": "28–35 s",
        "function": "CTA",
        "action": "Equipo y CTA en blanco roto.",
        "onScreenText": "Comenta HIDRA",
        "voiceover": "Comenta HIDRA y cuéntanos cómo trabajas hoy tus higienes faciales.",
        "notes": "CTA fijo al menos 4 s."
      }
    ]
  },
  "A12": {
    "format": "REEL",
    "concept": null,
    "whoAppears": "Asesor a cámara; profesional y modelo solo en recursos.",
    "materials": "Xe real y carta facial/depilación; micro y dos recursos propios.",
    "validateBeforePublish": "No comparaciones de precio o calidad sin datos. No indicar que Xn o Xe son versiones inferiores.",
    "editing": null,
    "kpi": null,
    "cta": null,
    "approval": "Pendiente",
    "steps": [
      {
        "label": "0–4 s",
        "function": "Hook",
        "action": "Asesor muestra carta con dos columnas.",
        "onScreenText": "Tu carta marca la elección",
        "voiceover": "¿Depilación y facial? Empieza por tu carta.",
        "notes": "Asesor a cámara; profesional y modelo solo en recursos. Corte limpio; subtítulos revisados."
      },
      {
        "label": "4–10 s",
        "function": "Desarrollo",
        "action": "Plano del Xe, no Ultra ni Xn.",
        "onScreenText": "SHR Xe",
        "voiceover": "SHR Xe es una de las opciones que podemos estudiar contigo.",
        "notes": "Corte limpio; subtítulos revisados."
      },
      {
        "label": "10–16 s",
        "function": "Desarrollo",
        "action": "Recurso de servicio facial, con protección si procede.",
        "onScreenText": "¿Qué quieres incorporar?",
        "voiceover": "Cuéntanos qué trabajas hoy y qué te gustaría incorporar.",
        "notes": "Corte limpio; subtítulos revisados."
      },
      {
        "label": "16–22 s",
        "function": "Desarrollo",
        "action": "Asesor revisa ficha real sin precio visible.",
        "onScreenText": "Revisar la configuración",
        "voiceover": "Después revisamos los accesorios y la formación que necesita tu equipo.",
        "notes": "Corte limpio; subtítulos revisados."
      },
      {
        "label": "22–28 s",
        "function": "Desarrollo",
        "action": "Asesor y profesional junto al Xe.",
        "onScreenText": "Conócelo en una demo",
        "voiceover": "El siguiente paso es conocerlo en una demostración y resolver tus dudas.",
        "notes": "Corte limpio; subtítulos revisados."
      },
      {
        "label": "28–35 s",
        "function": "CTA",
        "action": "Asesor mira a cámara.",
        "onScreenText": "Comenta XE",
        "voiceover": "Comenta XE y dinos cuál es tu prioridad. Te ayudamos a ordenarla.",
        "notes": "CTA fijo al menos 4 s."
      }
    ]
  },
  "M02": {
    "format": "REEL",
    "concept": null,
    "whoAppears": "Modelo adulta sin diálogo; profesional real. Voz en off humana.",
    "materials": "Llegada, escucha, preparación de cabina, cuidado y despedida. Sin equipo protagonista.",
    "validateBeforePublish": "Modelo representa una experiencia, no un testimonio ni caso de éxito. Material propio autorizado.",
    "editing": null,
    "kpi": null,
    "cta": null,
    "approval": "Pendiente",
    "steps": [
      {
        "label": "0–4 s",
        "function": "Hook",
        "action": "Modelo llega; profesional la recibe sin mirar a cámara.",
        "onScreenText": "Lo que la cámara no suele enseñar",
        "voiceover": "La experiencia empieza antes de encender el equipo.",
        "notes": "Modelo adulta sin diálogo; profesional real. Voz en off humana. Corte limpio; subtítulos revisados."
      },
      {
        "label": "4–10 s",
        "function": "Desarrollo",
        "action": "Plano de escucha entre ambas.",
        "onScreenText": "Escuchar",
        "voiceover": "Empieza escuchando lo que la persona necesita y lo que espera.",
        "notes": "Corte limpio; subtítulos revisados."
      },
      {
        "label": "10–16 s",
        "function": "Desarrollo",
        "action": "Profesional explica un documento sin datos personales.",
        "onScreenText": "Explicar",
        "voiceover": "Continúa explicando qué se va a hacer y resolviendo sus dudas.",
        "notes": "Corte limpio; subtítulos revisados."
      },
      {
        "label": "16–22 s",
        "function": "Desarrollo",
        "action": "Preparación de toalla, espacio y protección correspondiente.",
        "onScreenText": "Preparar",
        "voiceover": "También está en preparar cada detalle y trabajar con atención.",
        "notes": "Corte limpio; subtítulos revisados."
      },
      {
        "label": "22–28 s",
        "function": "Desarrollo",
        "action": "Modelo conversa al terminar; sin piel comparativa.",
        "onScreenText": "Acompañar",
        "voiceover": "La tecnología forma parte del servicio. La forma de atender también.",
        "notes": "Corte limpio; subtítulos revisados."
      },
      {
        "label": "28–35 s",
        "function": "CTA",
        "action": "Cartela blanca; firma Innovapro.",
        "onScreenText": "¿Tienes centro? Escribe CABINA",
        "voiceover": "¿Tienes un centro? Escribe CABINA y cuéntanos qué detalle cuidas tú.",
        "notes": "CTA fijo al menos 4 s."
      }
    ]
  },
  "A13": {
    "format": "REEL",
    "concept": null,
    "whoAppears": "Asesor a cámara, profesional en recursos. No necesita modelo salvo aplicación real.",
    "materials": "Xn real, ficha de preguntas y escena de formación.",
    "validateBeforePublish": "No simular cita disponible ni disponibilidad inmediata. No prometer prueba sobre cualquier persona.",
    "editing": null,
    "kpi": null,
    "cta": null,
    "approval": "Pendiente",
    "steps": [
      {
        "label": "0–4 s",
        "function": "Hook",
        "action": "Asesor junto al Xn, plano medio.",
        "onScreenText": "No vayas a una demo sin preguntas",
        "voiceover": "Si vas a ver SHR Xn, lleva estas tres preguntas.",
        "notes": "Asesor a cámara, profesional en recursos. No necesita modelo salvo aplicación real. Corte limpio; subtítulos revisados."
      },
      {
        "label": "4–10 s",
        "function": "Desarrollo",
        "action": "Plano del equipo y una tarjeta.",
        "onScreenText": "1. ¿Cómo encaja en mi centro?",
        "voiceover": "Primera: ¿cómo encaja con los servicios que ya trabajo?",
        "notes": "Corte limpio; subtítulos revisados."
      },
      {
        "label": "10–16 s",
        "function": "Desarrollo",
        "action": "Detalle de accesorio; mano señala ficha.",
        "onScreenText": "2. ¿Qué incluye la propuesta?",
        "voiceover": "Segunda: ¿qué configuración, accesorios y formación incluye la propuesta?",
        "notes": "Corte limpio; subtítulos revisados."
      },
      {
        "label": "16–22 s",
        "function": "Desarrollo",
        "action": "Asesor en zona comercial; recurso del exterior del Xn.",
        "onScreenText": "3. ¿Con qué respaldo cuento?",
        "voiceover": "Tercera: ¿con qué formación y soporte contaré después de comprar?",
        "notes": "Corte limpio; subtítulos revisados."
      },
      {
        "label": "22–28 s",
        "function": "Desarrollo",
        "action": "Plano amplio de demostración sin clientes identificables.",
        "onScreenText": "Resuelve tus dudas con el equipo",
        "voiceover": "Una demostración útil responde a tu operativa, no solo enseña una máquina.",
        "notes": "Corte limpio; subtítulos revisados."
      },
      {
        "label": "28–35 s",
        "function": "CTA",
        "action": "Cierre del asesor, CTA fijo.",
        "onScreenText": "Comenta XN",
        "voiceover": "Comenta XN y dinos qué quieres comprobar. Revisamos contigo el siguiente paso.",
        "notes": "CTA fijo al menos 4 s."
      }
    ]
  },
  "A03": {
    "format": "CARRUSEL",
    "concept": null,
    "whoAppears": "No necesita persona hablando. Fotos propias de equipo y manípulos.",
    "materials": "5 diapositivas 1080 × 1350. Foto frontal Xe, SHR y E-light.",
    "validateBeforePublish": "No usar imagen de Xn. Distinguir servicio de indicación individual.",
    "editing": null,
    "kpi": null,
    "cta": null,
    "approval": "Pendiente",
    "steps": [
      {
        "label": "Diapositiva 1",
        "function": "Portada",
        "action": "Foto del Xe a la derecha; titular grande a la izquierda.",
        "onScreenText": "¿Depilación y facial en tu próximo equipo?\nConoce el enfoque de SHR Xe.",
        "voiceover": null,
        "notes": null
      },
      {
        "label": "Diapositiva 2",
        "function": "Desarrollo",
        "action": "Foto del manípulo SHR, sin comparaciones antes/después.",
        "onScreenText": "Una línea: depilación\nTecnología SHR para desarrollar este servicio en tu centro.",
        "voiceover": null,
        "notes": null
      },
      {
        "label": "Diapositiva 3",
        "function": "Desarrollo",
        "action": "Foto del cabezal E-light, nombre visible.",
        "onScreenText": "Otra línea: facial\nE-light combina IPL y radiofrecuencia para aplicaciones de fotorejuvenecimiento.",
        "voiceover": null,
        "notes": null
      },
      {
        "label": "Diapositiva 4",
        "function": "Desarrollo",
        "action": "Tres preguntas, mucho blanco y sin iconos decorativos.",
        "onScreenText": "Antes de elegir\n¿Qué te piden tus clientes?\n¿Qué servicios ofreces ya?\n¿Qué equipo vas a formar?",
        "voiceover": null,
        "notes": null
      },
      {
        "label": "Diapositiva 5",
        "function": "CTA",
        "action": "Xe completo y CTA sobre banda beige estrecha.",
        "onScreenText": "¿Quieres valorar SHR Xe?\nComenta XE y dinos tu prioridad: depilación, facial o ambas.",
        "voiceover": null,
        "notes": null
      }
    ]
  },
  "ST01": {
    "format": "CARRUSEL",
    "concept": null,
    "whoAppears": "Nadie aparece hablando. Diseño gráfico y fotografías propias de equipos cerrados.",
    "materials": "5 slides. Equipo en estudio o cabina; tipografía y agenda ilustrada sin datos reales.",
    "validateBeforePublish": "Prohibido grabar taller, técnicos, reparación, piezas internas o pantallas de incidencias. No usar stock o IA para simularlos. No prometer 24/7, plazos, gratuidad ni sustitución universal.",
    "editing": null,
    "kpi": null,
    "cta": null,
    "approval": "Pendiente",
    "steps": [
      {
        "label": "Diapositiva 1",
        "function": "Portada",
        "action": "Equipo cerrado en estudio; titular dominante.",
        "onScreenText": "Tu inversión también se decide después de la compra.",
        "voiceover": null,
        "notes": null
      },
      {
        "label": "Diapositiva 2",
        "function": "Desarrollo",
        "action": "Agenda ilustrada, sin equipos averiados ni dramatización.",
        "onScreenText": "Detrás de cada equipo hay una agenda\nPor eso importa saber con quién contar cuando surge una duda o una incidencia.",
        "voiceover": null,
        "notes": null
      },
      {
        "label": "Diapositiva 3",
        "function": "Desarrollo",
        "action": "Tipografía sobre blanco; detalle exterior de marca.",
        "onScreenText": "Servicio técnico especializado\nAsistencia, mantenimiento y reparación de aparatología. Respaldo para trabajar con confianza.",
        "voiceover": null,
        "notes": null
      },
      {
        "label": "Diapositiva 4",
        "function": "Desarrollo",
        "action": "Tres preguntas en tarjetas beige.",
        "onScreenText": "Pregunta antes de comprar\n¿Cómo contacto?\n¿Qué cubre mi servicio?\n¿Cómo se gestiona una incidencia?",
        "voiceover": null,
        "notes": null
      },
      {
        "label": "Diapositiva 5",
        "function": "CTA",
        "action": "Equipo y marca. No fotos de técnicos.",
        "onScreenText": "El respaldo también cuenta\nEscribe RESPALDO y resolvemos tus dudas sobre el servicio.",
        "voiceover": null,
        "notes": null
      }
    ]
  },
  "A04": {
    "format": "CARRUSEL",
    "concept": null,
    "whoAppears": "No requiere persona ni voz. Fotografías propias de equipo y accesorios.",
    "materials": "5 slides; configuración comercial revisada, fotos de cabezales.",
    "validateBeforePublish": "No afirmar que todos los cabezales vienen de serie. Texto listo sin precios no confirmados.",
    "editing": null,
    "kpi": null,
    "cta": null,
    "approval": "Pendiente",
    "steps": [
      {
        "label": "Diapositiva 1",
        "function": "Portada",
        "action": "Ultra y titular con amplio margen.",
        "onScreenText": "SHR X Ultra\nDecide qué vas a utilizar antes de elegir la configuración.",
        "voiceover": null,
        "notes": null
      },
      {
        "label": "Diapositiva 2",
        "function": "Desarrollo",
        "action": "Carta de servicios ficticia sin cifras.",
        "onScreenText": "1. Tu actividad actual\n¿Qué servicios quieres mantener o mejorar con la nueva inversión?",
        "voiceover": null,
        "notes": null
      },
      {
        "label": "Diapositiva 3",
        "function": "Desarrollo",
        "action": "Dos tarjetas: hoy / siguiente paso.",
        "onScreenText": "2. Tu siguiente servicio\nElige una ampliación con demanda real. No necesitas lanzar todo a la vez.",
        "voiceover": null,
        "notes": null
      },
      {
        "label": "Diapositiva 4",
        "function": "Desarrollo",
        "action": "Manípulos etiquetados incluidos / opcionales, según propuesta real.",
        "onScreenText": "3. La configuración\nPide que cada manípulo y su formación queden identificados en la propuesta.",
        "voiceover": null,
        "notes": null
      },
      {
        "label": "Diapositiva 5",
        "function": "CTA",
        "action": "Ultra frontal y firma Innovapro.",
        "onScreenText": "Hablemos de tu centro\nComenta ULTRA y dinos qué servicios ofreces hoy.",
        "voiceover": null,
        "notes": null
      }
    ]
  },
  "A05": {
    "format": "CARRUSEL",
    "concept": null,
    "whoAppears": "Diseño estático; sin persona hablando.",
    "materials": "5 slides; Xn y una hoja de preguntas, sin precios ficticios.",
    "validateBeforePublish": "No presupuestar ingresos ni retorno automático. Derivar dudas de indicaciones al equipo técnico.",
    "editing": null,
    "kpi": null,
    "cta": null,
    "approval": "Pendiente",
    "steps": [
      {
        "label": "Diapositiva 1",
        "function": "Portada",
        "action": "Xn junto a tres números grandes.",
        "onScreenText": "SHR Xn\nTres preguntas antes de ampliar servicios.",
        "voiceover": null,
        "notes": null
      },
      {
        "label": "Diapositiva 2",
        "function": "Desarrollo",
        "action": "Foto de agenda sin datos personales.",
        "onScreenText": "1. ¿Existe demanda?\nAnota qué tratamientos te preguntan y cuántas consultas recibes realmente.",
        "voiceover": null,
        "notes": null
      },
      {
        "label": "Diapositiva 3",
        "function": "Desarrollo",
        "action": "Formadora y profesional revisan equipo; foto propia.",
        "onScreenText": "2. ¿Quién lo va a trabajar?\nDefine la persona responsable y la formación necesaria.",
        "voiceover": null,
        "notes": null
      },
      {
        "label": "Diapositiva 4",
        "function": "Desarrollo",
        "action": "Cabina limpia con Xn.",
        "onScreenText": "3. ¿Cabe en tu operativa?\nRevisa espacio, agenda y costes antes de estimar la rentabilidad.",
        "voiceover": null,
        "notes": null
      },
      {
        "label": "Diapositiva 5",
        "function": "CTA",
        "action": "Xn y CTA grande.",
        "onScreenText": "Comenta XN\n¿Quieres iniciar, renovar o ampliar servicios? Cuéntanos tu caso.",
        "voiceover": null,
        "notes": null
      }
    ]
  },
  "A09": {
    "format": "CARRUSEL",
    "concept": null,
    "whoAppears": "No requiere voz. Fotos de equipo y ambos tipos de aplicador.",
    "materials": "5 slides, separando visualmente criolipólisis y estimulación electromagnética.",
    "validateBeforePublish": "No afirmar uso simultáneo. No prometer adelgazar, reemplazar ejercicio ni resultados medidos sin evidencia.",
    "editing": null,
    "kpi": null,
    "cta": null,
    "approval": "Pendiente",
    "steps": [
      {
        "label": "Diapositiva 1",
        "function": "Portada",
        "action": "Equipo completo; titular sin cuerpo retocado.",
        "onScreenText": "Grasa localizada y músculo no son lo mismo\nColdSculptor M40 Ultra.",
        "voiceover": null,
        "notes": null
      },
      {
        "label": "Diapositiva 2",
        "function": "Desarrollo",
        "action": "Solo aplicador de criolipólisis.",
        "onScreenText": "Criolipólisis\nAplicación de frío controlado para trabajar grasa localizada en casos indicados.",
        "voiceover": null,
        "notes": null
      },
      {
        "label": "Diapositiva 3",
        "function": "Desarrollo",
        "action": "Solo aplicador electromagnético, bien identificado.",
        "onScreenText": "Estimulación electromagnética\nUna tecnología distinta, orientada al trabajo muscular.",
        "voiceover": null,
        "notes": null
      },
      {
        "label": "Diapositiva 4",
        "function": "Desarrollo",
        "action": "Dos columnas limpias: objetivo / valoración.",
        "onScreenText": "No confundas los objetivos\nLa valoración define la aplicación. No implica trabajar ambas a la vez ni sustituye el ejercicio.",
        "voiceover": null,
        "notes": null
      },
      {
        "label": "Diapositiva 5",
        "function": "CTA",
        "action": "Equipo, CTA único.",
        "onScreenText": "¿Qué demanda tienes en tu centro?\nComenta M40 y cuéntanos qué objetivo corporal te consultan más.",
        "voiceover": null,
        "notes": null
      }
    ]
  },
  "T02": {
    "format": "CARRUSEL",
    "concept": null,
    "whoAppears": "Sin voz. Fotos de valoración y piel sin retoque.",
    "materials": "5 slides educativos sin ficha de producto protagonista.",
    "validateBeforePublish": "No diagnosticar por foto ni declarar una técnica apropiada sin valoración. No hacer ranking de resultados.",
    "editing": null,
    "kpi": null,
    "cta": null,
    "approval": "Pendiente",
    "steps": [
      {
        "label": "Diapositiva 1",
        "function": "Portada",
        "action": "Retrato neutro y limpio, sin antes/después.",
        "onScreenText": "No todo lo que llamamos glow es el mismo tratamiento.",
        "voiceover": null,
        "notes": null
      },
      {
        "label": "Diapositiva 2",
        "function": "Desarrollo",
        "action": "Profesional valorando piel, sin aplicación.",
        "onScreenText": "Primero, la necesidad\n¿Qué quiere mejorar la persona? La respuesta requiere valoración.",
        "voiceover": null,
        "notes": null
      },
      {
        "label": "Diapositiva 3",
        "function": "Desarrollo",
        "action": "Foto de higiene facial real.",
        "onScreenText": "Higiene facial\nEl enfoque es la limpieza y la exfoliación, adaptadas a la piel.",
        "voiceover": null,
        "notes": null
      },
      {
        "label": "Diapositiva 4",
        "function": "Desarrollo",
        "action": "Foto de cabina de fotorejuvenecimiento con protección.",
        "onScreenText": "Fotorejuvenecimiento\nEs otra línea de tratamiento. No se elige solo por una tendencia o una foto.",
        "voiceover": null,
        "notes": null
      },
      {
        "label": "Diapositiva 5",
        "function": "CTA",
        "action": "Fondo blanco roto con tipografía grande.",
        "onScreenText": "Explica tu carta con claridad\n¿Tienes centro? Escribe FACIAL y cuéntanos qué ofreces ahora.",
        "voiceover": null,
        "notes": null
      }
    ]
  },
  "A11": {
    "format": "CARRUSEL",
    "concept": null,
    "whoAppears": "Fotos de profesional aplicando. Sin voz.",
    "materials": "5 slides; T-4 Pro, cabezal rotacional y aplicación real.",
    "validateBeforePublish": "No usar frecuencia de la web. No venderlo como igual a C-10 Max; validar configuración.",
    "editing": null,
    "kpi": null,
    "cta": null,
    "approval": "Pendiente",
    "steps": [
      {
        "label": "Diapositiva 1",
        "function": "Portada",
        "action": "T-4 Pro frontal.",
        "onScreenText": "Diatermia T-4 Pro\nConócela por cómo se trabaja.",
        "voiceover": null,
        "notes": null
      },
      {
        "label": "Diapositiva 2",
        "function": "Desarrollo",
        "action": "Fotografía de los aplicadores correspondientes.",
        "onScreenText": "Trabajo capacitivo y resistivo\nLa elección forma parte del protocolo profesional.",
        "voiceover": null,
        "notes": null
      },
      {
        "label": "Diapositiva 3",
        "function": "Desarrollo",
        "action": "Macro del cabezal rotacional.",
        "onScreenText": "Masaje iónico rotacional\nObserva esta aplicación durante la demostración.",
        "voiceover": null,
        "notes": null
      },
      {
        "label": "Diapositiva 4",
        "function": "Desarrollo",
        "action": "Profesional en cabina, no retrato comercial genérico.",
        "onScreenText": "Piensa en tus servicios\nValora protocolos de firmeza facial y corporal según las necesidades de cada persona.",
        "voiceover": null,
        "notes": null
      },
      {
        "label": "Diapositiva 5",
        "function": "CTA",
        "action": "Equipo y CTA.",
        "onScreenText": "Comenta T4\nCuéntanos tu objetivo y revisamos su encaje en tu centro.",
        "voiceover": null,
        "notes": null
      }
    ]
  },
  "A14": {
    "format": "CARRUSEL",
    "concept": null,
    "whoAppears": "Fotografías de Ultra y asesor. Sin voz.",
    "materials": "5 slides; check de compra y CTA a conversación comercial.",
    "validateBeforePublish": "Sin falsa urgencia ni plazas inventadas. No decir que la rentabilidad está garantizada.",
    "editing": null,
    "kpi": null,
    "cta": null,
    "approval": "Pendiente",
    "steps": [
      {
        "label": "Diapositiva 1",
        "function": "Portada",
        "action": "Ultra protagonista, composición editorial.",
        "onScreenText": "Tu siguiente paso con SHR X Ultra.",
        "voiceover": null,
        "notes": null
      },
      {
        "label": "Diapositiva 2",
        "function": "Desarrollo",
        "action": "Tarjeta de objetivo, sin iconos.",
        "onScreenText": "Define tu objetivo\n¿Qué servicio quieres potenciar o incorporar primero?",
        "voiceover": null,
        "notes": null
      },
      {
        "label": "Diapositiva 3",
        "function": "Desarrollo",
        "action": "Manípulos reales identificados.",
        "onScreenText": "Revisa tu configuración\n¿Qué accesorios necesitas y cuáles incluye la propuesta?",
        "voiceover": null,
        "notes": null
      },
      {
        "label": "Diapositiva 4",
        "function": "Desarrollo",
        "action": "Equipo cerrado y asesor en zona comercial; nunca taller.",
        "onScreenText": "Piensa también en el después\nRevisa formación, servicio técnico y condiciones de asistencia antes de decidir.",
        "voiceover": null,
        "notes": null
      },
      {
        "label": "Diapositiva 5",
        "function": "CTA",
        "action": "Ultra y CTA grande; espacio inferior generoso.",
        "onScreenText": "Comenta ULTRA\nDinos tu objetivo y revisamos contigo una demostración.",
        "voiceover": null,
        "notes": null
      }
    ]
  }
}
;

export const CAPELINO_PRODUCTION: Record<string, RealProductionSheet> =
{
  "S01": {
    "format": "REEL",
    "concept": "DON'T BLINK — ORANGE POUR",
    "whoAppears": null,
    "materials": "Botella fría, copa, hielo, naranja, macro o móvil cerca, luz lateral, fondo limpio",
    "validateBeforePublish": "Público adulto; consumo moderado; sin claims funcionales.",
    "editing": "Cortes muy rápidos; sonido del vertido/hielo; loop casi perfecto.",
    "kpi": "Retención + % no seguidores + replays",
    "cta": "Sin CTA en pantalla; el Reel debe funcionar por repetición.",
    "approval": "Pendiente",
    "steps": [
      {
        "label": "Hook 0-1s",
        "function": "Hook",
        "action": "0.0s: Capelino entrando en copa, macro. Nada de intro.",
        "onScreenText": null,
        "voiceover": null,
        "notes": null
      },
      {
        "label": "0.0–1.0s",
        "function": null,
        "action": "vertido",
        "onScreenText": null,
        "voiceover": null,
        "notes": null
      },
      {
        "label": "1.0–2.0s",
        "function": null,
        "action": "hielo/burbujas",
        "onScreenText": null,
        "voiceover": null,
        "notes": null
      },
      {
        "label": "2.0–3.2s",
        "function": null,
        "action": "naranja cae",
        "onScreenText": null,
        "voiceover": null,
        "notes": null
      },
      {
        "label": "3.2–5.0s",
        "function": null,
        "action": "botella+copa.",
        "onScreenText": null,
        "voiceover": null,
        "notes": null
      }
    ]
  },
  "S02": {
    "format": "REEL",
    "concept": "POV: THE TABLE WAS WAITING",
    "whoAppears": null,
    "materials": "2 adultos, mesa real, snacks, copa, botella, gafas/llaves/bolso, luz natural",
    "validateBeforePublish": "Casting adulto; no asociar alcohol a éxito social o rendimiento.",
    "editing": "Look UGC cuidado; cámara en mano; evitar sensación de spot tradicional.",
    "kpi": "Compartidos + follows / 1.000 + visitas perfil",
    "cta": "«Send it to your table person.»",
    "approval": "Pendiente",
    "steps": [
      {
        "label": "Hook 0-1s",
        "function": "Hook",
        "action": "0.0s mano deja llaves/gafas → otra mano entra ya con copa Capelino.",
        "onScreenText": null,
        "voiceover": null,
        "notes": null
      },
      {
        "label": "0.0–1.2s",
        "function": null,
        "action": "gesto cotidiano",
        "onScreenText": null,
        "voiceover": null,
        "notes": null
      },
      {
        "label": "1.2–3.0s",
        "function": null,
        "action": "copa entra",
        "onScreenText": null,
        "voiceover": null,
        "notes": null
      },
      {
        "label": "3.0–5.5s",
        "function": null,
        "action": "mesa real/aperitivo",
        "onScreenText": null,
        "voiceover": null,
        "notes": null
      },
      {
        "label": "5.5–8.0s",
        "function": null,
        "action": "macro + sonrisa/gesto natural.",
        "onScreenText": null,
        "voiceover": null,
        "notes": null
      }
    ]
  },
  "S03": {
    "format": "REEL",
    "concept": "CAPELINO INTERRUPTS #00 — THE ORANGE DOOR",
    "whoAppears": null,
    "materials": "Puerta real o set + composición/IA, botella/copa, elementos naranja, iluminación coherente",
    "validateBeforePublish": "Producto como elemento visual; público adulto; sin contexto de consumo inseguro.",
    "editing": "Reveal antes de 1.2s; sound design de puerta + golpe musical; evitar intro.",
    "kpi": "Compartidos + % no seguidores + comentarios",
    "cta": "«Where should the next door lead?»",
    "approval": "Pendiente",
    "steps": [
      {
        "label": "Hook 0-1s",
        "function": "Hook",
        "action": "0.0s mano en pomo → la puerta empieza a abrir inmediatamente.",
        "onScreenText": null,
        "voiceover": null,
        "notes": null
      },
      {
        "label": "0.0–0.7s",
        "function": null,
        "action": "pomo",
        "onScreenText": null,
        "voiceover": null,
        "notes": null
      },
      {
        "label": "0.7–1.2s",
        "function": null,
        "action": "apertura",
        "onScreenText": null,
        "voiceover": null,
        "notes": null
      },
      {
        "label": "1.2–4.8s",
        "function": null,
        "action": "interior naranja imposible/mediterráneo",
        "onScreenText": null,
        "voiceover": null,
        "notes": null
      },
      {
        "label": "4.8–7.0s",
        "function": null,
        "action": "Capelino hero.",
        "onScreenText": null,
        "voiceover": null,
        "notes": null
      }
    ]
  },
  "P01": {
    "format": "REEL",
    "concept": "THE CAPELINO EFFECT #01 — When the plan turns orange",
    "whoAppears": null,
    "materials": "Mesa clara, copa, hielo, rodaja de naranja, luz/gel naranja, trípode cenital",
    "validateBeforePublish": "Público adulto. Sin claims de rendimiento, alivio o éxito social.",
    "editing": "Hora A (14:30) + hook con texto",
    "kpi": "% no seguidores + compartidos / alcance",
    "cta": "«Send it to your orange-plan person.»",
    "approval": "Pendiente",
    "steps": [
      {
        "label": "Hook 0-1s",
        "function": "Hook",
        "action": "Primer frame: copa Capelino en cenital + texto «POV: the plan turns orange.»",
        "onScreenText": null,
        "voiceover": null,
        "notes": null
      },
      {
        "label": "0.0–0.6s",
        "function": null,
        "action": "copa/mesa neutra",
        "onScreenText": null,
        "voiceover": null,
        "notes": null
      },
      {
        "label": "0.6–1.5s",
        "function": null,
        "action": "giro de la copa",
        "onScreenText": null,
        "voiceover": null,
        "notes": null
      },
      {
        "label": "1.5–3.5s",
        "function": null,
        "action": "transición a luz naranja",
        "onScreenText": null,
        "voiceover": null,
        "notes": null
      },
      {
        "label": "3.5–6.0s",
        "function": null,
        "action": "macro burbujas + logo.",
        "onScreenText": null,
        "voiceover": null,
        "notes": null
      }
    ]
  },
  "P02": {
    "format": "REEL",
    "concept": "3 SECONDS OF ORANGE — macro / ASMR",
    "whoAppears": null,
    "materials": "Botella fría, copa, hielo grande, naranja, fondo limpio, luz lateral, micro/sonido limpio",
    "validateBeforePublish": "Consumo mostrado de forma moderada; sin ritmo de consumo.",
    "editing": "Hora B (20:30) + sin texto inicial",
    "kpi": "Retención + replays + % no seguidores",
    "cta": "Sin CTA en pantalla. Copy: «Orange, served.»",
    "approval": "Pendiente",
    "steps": [
      {
        "label": "Hook 0-1s",
        "function": "Hook",
        "action": "0.0s: líquido entrando en copa en macro. Sin introducción.",
        "onScreenText": null,
        "voiceover": null,
        "notes": null
      },
      {
        "label": "0.0–1.2s",
        "function": null,
        "action": "vertido",
        "onScreenText": null,
        "voiceover": null,
        "notes": null
      },
      {
        "label": "1.2–2.2s",
        "function": null,
        "action": "hielo/burbujas",
        "onScreenText": null,
        "voiceover": null,
        "notes": null
      },
      {
        "label": "2.2–3.2s",
        "function": null,
        "action": "naranja cae",
        "onScreenText": null,
        "voiceover": null,
        "notes": null
      },
      {
        "label": "3.2–5.0s",
        "function": null,
        "action": "hero shot botella+copa.",
        "onScreenText": null,
        "voiceover": null,
        "notes": null
      }
    ]
  },
  "P03": {
    "format": "REEL",
    "concept": "APERITIVO IN 5 MOVES",
    "whoAppears": null,
    "materials": "2–3 adultos solo manos, mantel, aceitunas/snacks, botella, copas, naranja",
    "validateBeforePublish": "Casting adulto; comida y ritual, sin asociar producto a éxito social.",
    "editing": "POV/manos vs persona completa",
    "kpi": "Compartidos + comentarios + visitas perfil",
    "cta": "«Which step is non-negotiable?»",
    "approval": "Pendiente",
    "steps": [
      {
        "label": "Hook 0-1s",
        "function": "Hook",
        "action": "Texto: «5 moves. One orange table.» + manos entrando en plano.",
        "onScreenText": null,
        "voiceover": null,
        "notes": null
      },
      {
        "label": null,
        "function": null,
        "action": "1 hielo",
        "onScreenText": null,
        "voiceover": null,
        "notes": null
      },
      {
        "label": null,
        "function": null,
        "action": "2 copa",
        "onScreenText": null,
        "voiceover": null,
        "notes": null
      },
      {
        "label": null,
        "function": null,
        "action": "3 Capelino",
        "onScreenText": null,
        "voiceover": null,
        "notes": null
      },
      {
        "label": null,
        "function": null,
        "action": "4 naranja",
        "onScreenText": null,
        "voiceover": null,
        "notes": null
      },
      {
        "label": null,
        "function": null,
        "action": "5 mesa lista. Corte cada 0,8–1,2 s.",
        "onScreenText": null,
        "voiceover": null,
        "notes": null
      }
    ]
  },
  "P04": {
    "format": "CARRUSEL",
    "concept": "THE CAPELINO TEST #01 — Pick your scene",
    "whoAppears": null,
    "materials": "4 fotos propias de producto/lifestyle + diseño Belgrad/naranja",
    "validateBeforePublish": "Opciones adultas y neutrales; evitar lenguaje de presión al consumo.",
    "editing": "Carrusel interactivo vs Reels de captación",
    "kpi": "Comentarios + guardados + visitas perfil",
    "cta": "Comentar combinación (ej. A-B-A) y guardar.",
    "approval": "Pendiente",
    "steps": [
      {
        "label": "Hook 0-1s",
        "function": "Hook",
        "action": "Slide 1: «THE CAPELINO TEST — Pick one. No explanations.»",
        "onScreenText": null,
        "voiceover": null,
        "notes": null
      },
      {
        "label": null,
        "function": null,
        "action": "S1 portada",
        "onScreenText": null,
        "voiceover": null,
        "notes": null
      },
      {
        "label": null,
        "function": null,
        "action": "S2 Terrace / Dinner",
        "onScreenText": null,
        "voiceover": null,
        "notes": null
      },
      {
        "label": null,
        "function": null,
        "action": "S3 Sunset / City",
        "onScreenText": null,
        "voiceover": null,
        "notes": null
      },
      {
        "label": null,
        "function": null,
        "action": "S4 Vinyl / Silence",
        "onScreenText": null,
        "voiceover": null,
        "notes": null
      },
      {
        "label": null,
        "function": null,
        "action": "S5 «Comment your 3 picks.»",
        "onScreenText": null,
        "voiceover": null,
        "notes": null
      }
    ]
  },
  "P05": {
    "format": "REEL",
    "concept": "CAPELINO INTERRUPTS #01 — THE ELEVATOR",
    "whoAppears": null,
    "materials": "Ascensor/localización o IA, botella, copa, iluminación naranja, composición vertical",
    "validateBeforePublish": "No representar consumo en lugares inseguros; producto aparece como elemento visual.",
    "editing": "Reveal <1.5s vs narrativa lenta",
    "kpi": "Shares + comentarios + % no seguidores",
    "cta": "«Where should Capelino interrupt next?»",
    "approval": "Pendiente",
    "steps": [
      {
        "label": "Hook 0-1s",
        "function": "Hook",
        "action": "0.0s dedo pulsa botón naranja → puertas empiezan a abrir antes del segundo 1.",
        "onScreenText": null,
        "voiceover": null,
        "notes": null
      },
      {
        "label": "0.0–0.7s",
        "function": null,
        "action": "botón",
        "onScreenText": null,
        "voiceover": null,
        "notes": null
      },
      {
        "label": "0.7–1.5s",
        "function": null,
        "action": "puertas",
        "onScreenText": null,
        "voiceover": null,
        "notes": null
      },
      {
        "label": "1.5–4.5s",
        "function": null,
        "action": "interior imposible naranja/mediterráneo",
        "onScreenText": null,
        "voiceover": null,
        "notes": null
      },
      {
        "label": "4.5–7.0s",
        "function": null,
        "action": "botella/copa hero.",
        "onScreenText": null,
        "voiceover": null,
        "notes": null
      }
    ]
  },
  "P06": {
    "format": "REEL",
    "concept": "THE ORANGE RULE — match cuts",
    "whoAppears": null,
    "materials": "3–4 objetos naranjas, copa, botella, fondos gráficos limpios",
    "validateBeforePublish": "Branding puro; sin promesas funcionales.",
    "editing": "Reconocimiento visual sin narrativa",
    "kpi": "Replays + guardados + visitas perfil",
    "cta": "«Once you see orange…»",
    "approval": "Pendiente",
    "steps": [
      {
        "label": "Hook 0-1s",
        "function": "Hook",
        "action": "Objeto naranja ocupa pantalla → match cut inmediato a Capelino.",
        "onScreenText": null,
        "voiceover": null,
        "notes": null
      },
      {
        "label": null,
        "function": null,
        "action": "Naranja/semáforo/tejido/sol",
        "onScreenText": null,
        "voiceover": null,
        "notes": null
      },
      {
        "label": null,
        "function": null,
        "action": "match cut copa",
        "onScreenText": null,
        "voiceover": null,
        "notes": null
      },
      {
        "label": null,
        "function": null,
        "action": "botella",
        "onScreenText": null,
        "voiceover": null,
        "notes": null
      },
      {
        "label": null,
        "function": null,
        "action": "end card 0,7s.",
        "onScreenText": null,
        "voiceover": null,
        "notes": null
      }
    ]
  },
  "P07": {
    "format": "REEL",
    "concept": "CAPELINO IRL — GOLDEN HOUR",
    "whoAppears": null,
    "materials": "Terraza, 1–2 adultos, copa, producto, luz natural, 3 planos macro",
    "validateBeforePublish": "Adultos; consumo moderado; no vincular a estatus o éxito.",
    "editing": "Real/lifestyle vs producción conceptual",
    "kpi": "Shares + follows / 1.000 espectadores",
    "cta": "«Golden hour, your way.»",
    "approval": "Pendiente",
    "steps": [
      {
        "label": "Hook 0-1s",
        "function": "Hook",
        "action": "0.0s mano deja unas gafas / bolso → otra mano entra con la copa Capelino.",
        "onScreenText": null,
        "voiceover": null,
        "notes": null
      },
      {
        "label": null,
        "function": null,
        "action": "Llegada terraza 1s",
        "onScreenText": null,
        "voiceover": null,
        "notes": null
      },
      {
        "label": null,
        "function": null,
        "action": "copa 2s",
        "onScreenText": null,
        "voiceover": null,
        "notes": null
      },
      {
        "label": null,
        "function": null,
        "action": "burbujas/macro 2s",
        "onScreenText": null,
        "voiceover": null,
        "notes": null
      },
      {
        "label": null,
        "function": null,
        "action": "persona adulta de fondo 2s",
        "onScreenText": null,
        "voiceover": null,
        "notes": null
      },
      {
        "label": null,
        "function": null,
        "action": "sunset end 2s.",
        "onScreenText": null,
        "voiceover": null,
        "notes": null
      }
    ]
  },
  "P08": {
    "format": "REEL",
    "concept": "THE CAPELINO TEST #02 — SPOT IT",
    "whoAppears": null,
    "materials": "Escena retro/estudio o IA, botella integrada, contador gráfico, zoom digital",
    "validateBeforePublish": "Juego visual dirigido a adultos; no dinámica de consumo.",
    "editing": "Gamificación + comentario vs contenido pasivo",
    "kpi": "Comentarios + retención + replays",
    "cta": "«Comment 🍊 if you found it before the reveal.»",
    "approval": "Pendiente",
    "steps": [
      {
        "label": "Hook 0-1s",
        "function": "Hook",
        "action": "Texto: «You have 3 seconds. Find Capelino.» Escena retro naranja desde frame 0.",
        "onScreenText": null,
        "voiceover": null,
        "notes": null
      },
      {
        "label": "0–3s",
        "function": null,
        "action": "búsqueda + contador",
        "onScreenText": null,
        "voiceover": null,
        "notes": null
      },
      {
        "label": "3–5s",
        "function": null,
        "action": "zoom/reveal",
        "onScreenText": null,
        "voiceover": null,
        "notes": null
      },
      {
        "label": "5–7s",
        "function": null,
        "action": "frame final «Did you get it?»",
        "onScreenText": null,
        "voiceover": null,
        "notes": null
      }
    ]
  }
}
;

// ---------------------------------------------------------------------------
// Stories diarias reales, extraídas de "Stories diarias" (Innovapro) y
// "03_STORIES" (Capelino). Van por fecha (no por idfeed): cada día de
// publicación de feed puede llevar sus propias stories de apoyo, así que se
// enlazan por fecha al sembrar (ver scripts/seed.ts).

export const INNOVAPRO_STORIES: Record<string, RealProductionStep[]> =
{
  "2026-09-21": [
    {
      "label": "S01-1",
      "family": "SHR X Ultra",
      "onScreenText": "¿Qué te piden y todavía no ofreces en tu centro?",
      "action": "Foto de Ultra en cabina.",
      "interaction": "Encuesta: Depilación / Facial",
      "notes": "7 s; deja libre el centro inferior para el sticker."
    },
    {
      "label": "S01-2",
      "family": "SHR X Ultra",
      "onScreenText": "SHR X Ultra: empieza por los servicios que quieres desarrollar.",
      "action": "Detalle de equipo.",
      "interaction": "Sin sticker",
      "notes": "7 s; una idea por pantalla. No añadir otra promesa."
    },
    {
      "label": "S01-3",
      "family": "SHR X Ultra",
      "onScreenText": "Escribe ULTRA y dinos cuál quieres potenciar.",
      "action": "Foto del equipo cuando corresponda; si no, fondo blanco roto.",
      "interaction": "Respuesta por DM: ULTRA",
      "notes": "8 s; registrar ID de story en cada conversación."
    }
  ],
  "2026-09-22": [
    {
      "label": "S02-1",
      "family": "SHR X Ultra",
      "onScreenText": "Una máquina no sustituye una carta de servicios bien pensada.",
      "action": "Carta ficticia y Ultra.",
      "interaction": "Caja: ¿Qué quieres ampliar?",
      "notes": "7 s; deja libre el centro inferior para el sticker."
    },
    {
      "label": "S02-2",
      "family": "SHR X Ultra",
      "onScreenText": "Antes de comprar: demanda, equipo humano y agenda.",
      "action": "Tres tarjetas tipográficas.",
      "interaction": "Sin sticker",
      "notes": "7 s; una idea por pantalla. No añadir otra promesa."
    },
    {
      "label": "S02-3",
      "family": "SHR X Ultra",
      "onScreenText": "Escribe ULTRA y cuéntanos qué ofreces hoy.",
      "action": "Foto del equipo cuando corresponda; si no, fondo blanco roto.",
      "interaction": "Respuesta por DM: ULTRA",
      "notes": "8 s; registrar ID de story en cada conversación."
    }
  ],
  "2026-09-23": [
    {
      "label": "S03-1",
      "family": "SHR Xn",
      "onScreenText": "¿Buscas depilación y otra línea de servicio?",
      "action": "Xn y sus dos cabezales separados.",
      "interaction": "Encuesta: Sí / Estoy valorándolo",
      "notes": "7 s; deja libre el centro inferior para el sticker."
    },
    {
      "label": "S03-2",
      "family": "SHR Xn",
      "onScreenText": "SHR y Nd:YAG son tecnologías diferentes dentro de SHR Xn.",
      "action": "Manípulos identificados.",
      "interaction": "Sin sticker",
      "notes": "7 s; una idea por pantalla. No añadir otra promesa."
    },
    {
      "label": "S03-3",
      "family": "SHR Xn",
      "onScreenText": "Escribe XN y dinos qué necesitas incorporar.",
      "action": "Foto del equipo cuando corresponda; si no, fondo blanco roto.",
      "interaction": "Respuesta por DM: XN",
      "notes": "8 s; registrar ID de story en cada conversación."
    }
  ],
  "2026-09-24": [
    {
      "label": "S04-1",
      "family": "SHR Xn",
      "onScreenText": "¿Qué necesitas comprobar antes de cambiar de equipo?",
      "action": "Xn y asesor.",
      "interaction": "Encuesta: Uso / Formación",
      "notes": "7 s; deja libre el centro inferior para el sticker."
    },
    {
      "label": "S04-2",
      "family": "SHR Xn",
      "onScreenText": "Prepara tus preguntas antes de pedir una demostración.",
      "action": "Bloc con preguntas.",
      "interaction": "Sin sticker",
      "notes": "7 s; una idea por pantalla. No añadir otra promesa."
    },
    {
      "label": "S04-3",
      "family": "SHR Xn",
      "onScreenText": "Responde XN y cuéntanos tu duda principal.",
      "action": "Foto del equipo cuando corresponda; si no, fondo blanco roto.",
      "interaction": "Respuesta por DM: XN",
      "notes": "8 s; registrar ID de story en cada conversación."
    }
  ],
  "2026-09-25": [
    {
      "label": "S05-1",
      "family": "SHR Xe",
      "onScreenText": "¿Tu prioridad es la depilación o la oferta facial?",
      "action": "Xe completo.",
      "interaction": "Encuesta: Depilación / Facial",
      "notes": "7 s; deja libre el centro inferior para el sticker."
    },
    {
      "label": "S05-2",
      "family": "SHR Xe",
      "onScreenText": "SHR Xe combina esa orientación en su propuesta.",
      "action": "Foto del cabezal E-light.",
      "interaction": "Sin sticker",
      "notes": "7 s; una idea por pantalla. No añadir otra promesa."
    },
    {
      "label": "S05-3",
      "family": "SHR Xe",
      "onScreenText": "Escribe XE y revisamos tu objetivo.",
      "action": "Foto del equipo cuando corresponda; si no, fondo blanco roto.",
      "interaction": "Respuesta por DM: XE",
      "notes": "8 s; registrar ID de story en cada conversación."
    }
  ],
  "2026-09-26": [
    {
      "label": "S06-1",
      "family": "Sin equipo protagonista",
      "onScreenText": "Hollywood Peel: no todo se ve en un reel.",
      "action": "Fotograma propio del tratamiento; protección visible.",
      "interaction": "Encuesta: ¿Lo trabajas? Sí / No",
      "notes": "7 s; deja libre el centro inferior para el sticker."
    },
    {
      "label": "S06-2",
      "family": "Sin equipo protagonista",
      "onScreenText": "Detrás del vídeo hay valoración, formación y protocolo.",
      "action": "Profesional preparando la sesión.",
      "interaction": "Sin sticker",
      "notes": "7 s; una idea por pantalla. No añadir otra promesa."
    },
    {
      "label": "S06-3",
      "family": "Sin equipo protagonista",
      "onScreenText": "Si tienes centro, escribe PEEL y dinos qué tecnología utilizas.",
      "action": "Foto del equipo cuando corresponda; si no, fondo blanco roto.",
      "interaction": "Respuesta por DM: PEEL",
      "notes": "8 s; registrar ID de story en cada conversación."
    }
  ],
  "2026-09-27": [
    {
      "label": "S07-1",
      "family": "Sin equipo protagonista",
      "onScreenText": "Tu inversión no termina el día de la compra.",
      "action": "Diseño tipográfico con foto exterior de equipo. No taller ni técnicos.",
      "interaction": "Caja: ¿Qué necesitas saber?",
      "notes": "7 s; deja libre el centro inferior para el sticker."
    },
    {
      "label": "S07-2",
      "family": "Sin equipo protagonista",
      "onScreenText": "Pregunta cómo contactar, qué cubre tu servicio y cómo se gestiona una incidencia.",
      "action": "Tres tarjetas gráficas. Sin pantallas de tickets ni llamadas escenificadas.",
      "interaction": "Sin sticker",
      "notes": "7 s; una idea por pantalla. No añadir otra promesa."
    },
    {
      "label": "S07-3",
      "family": "Sin equipo protagonista",
      "onScreenText": "Escribe RESPALDO y cuéntanos qué necesitas aclarar.",
      "action": "Foto del equipo cuando corresponda; si no, fondo blanco roto.",
      "interaction": "Respuesta por DM: RESPALDO",
      "notes": "8 s; registrar ID de story en cada conversación."
    }
  ],
  "2026-09-28": [
    {
      "label": "S08-1",
      "family": "SHR X Ultra",
      "onScreenText": "¿Comprarías funciones que no vas a utilizar?",
      "action": "Ultra y manípulos.",
      "interaction": "Encuesta: No / Necesito orientación",
      "notes": "7 s; deja libre el centro inferior para el sticker."
    },
    {
      "label": "S08-2",
      "family": "SHR X Ultra",
      "onScreenText": "Revisa qué incluye la configuración y qué exige cada aplicación.",
      "action": "Ficha real sin precios.",
      "interaction": "Sin sticker",
      "notes": "7 s; una idea por pantalla. No añadir otra promesa."
    },
    {
      "label": "S08-3",
      "family": "SHR X Ultra",
      "onScreenText": "Escribe ULTRA y revisamos los servicios que quieres trabajar.",
      "action": "Foto del equipo cuando corresponda; si no, fondo blanco roto.",
      "interaction": "Respuesta por DM: ULTRA",
      "notes": "8 s; registrar ID de story en cada conversación."
    }
  ],
  "2026-09-29": [
    {
      "label": "S09-1",
      "family": "SHR X Ultra",
      "onScreenText": "Tres preguntas para tu próxima reunión de compra.",
      "action": "Asesor con bloc.",
      "interaction": "Caja: ¿Qué te preocupa más?",
      "notes": "7 s; deja libre el centro inferior para el sticker."
    },
    {
      "label": "S09-2",
      "family": "SHR X Ultra",
      "onScreenText": "Qué necesito. Qué incluye. Qué debo aprender.",
      "action": "Tres frases en fondo blanco.",
      "interaction": "Sin sticker",
      "notes": "7 s; una idea por pantalla. No añadir otra promesa."
    },
    {
      "label": "S09-3",
      "family": "SHR X Ultra",
      "onScreenText": "Responde ULTRA y dinos cuál te cuesta resolver.",
      "action": "Foto del equipo cuando corresponda; si no, fondo blanco roto.",
      "interaction": "Respuesta por DM: ULTRA",
      "notes": "8 s; registrar ID de story en cada conversación."
    }
  ],
  "2026-09-30": [
    {
      "label": "S10-1",
      "family": "SHR Xn",
      "onScreenText": "¿La demanda existe o solo te gusta el tratamiento?",
      "action": "Xn al fondo; agenda ficticia.",
      "interaction": "Encuesta: Ya me lo piden / Estoy explorando",
      "notes": "7 s; deja libre el centro inferior para el sticker."
    },
    {
      "label": "S10-2",
      "family": "SHR Xn",
      "onScreenText": "Anota consultas reales antes de estimar ingresos.",
      "action": "Bloc sin cifras inventadas.",
      "interaction": "Sin sticker",
      "notes": "7 s; una idea por pantalla. No añadir otra promesa."
    },
    {
      "label": "S10-3",
      "family": "SHR Xn",
      "onScreenText": "Escribe XN y cuéntanos qué te preguntan tus clientes.",
      "action": "Foto del equipo cuando corresponda; si no, fondo blanco roto.",
      "interaction": "Respuesta por DM: XN",
      "notes": "8 s; registrar ID de story en cada conversación."
    }
  ],
  "2026-10-01": [
    {
      "label": "S11-1",
      "family": "SHR Xn",
      "onScreenText": "¿Quién utilizará tu próximo equipo?",
      "action": "Formadora y Xn.",
      "interaction": "Encuesta: Yo / Mi equipo",
      "notes": "7 s; deja libre el centro inferior para el sticker."
    },
    {
      "label": "S11-2",
      "family": "SHR Xn",
      "onScreenText": "La formación también forma parte de la decisión.",
      "action": "Material formativo propio.",
      "interaction": "Sin sticker",
      "notes": "7 s; una idea por pantalla. No añadir otra promesa."
    },
    {
      "label": "S11-3",
      "family": "SHR Xn",
      "onScreenText": "Responde XN y dinos cómo trabajáis en tu centro.",
      "action": "Foto del equipo cuando corresponda; si no, fondo blanco roto.",
      "interaction": "Respuesta por DM: XN",
      "notes": "8 s; registrar ID de story en cada conversación."
    }
  ],
  "2026-10-02": [
    {
      "label": "S12-1",
      "family": "HIFU V-10 MAX",
      "onScreenText": "¿Quieres desarrollar reafirmación facial o corporal?",
      "action": "HIFU V-10 MAX real.",
      "interaction": "Encuesta: Facial / Corporal",
      "notes": "7 s; deja libre el centro inferior para el sticker."
    },
    {
      "label": "S12-2",
      "family": "HIFU V-10 MAX",
      "onScreenText": "Empieza por la valoración y conoce la aplicación en una demo.",
      "action": "Formadora junto al equipo.",
      "interaction": "Sin sticker",
      "notes": "7 s; una idea por pantalla. No añadir otra promesa."
    },
    {
      "label": "S12-3",
      "family": "HIFU V-10 MAX",
      "onScreenText": "Escribe HIFU y dinos tu objetivo.",
      "action": "Foto del equipo cuando corresponda; si no, fondo blanco roto.",
      "interaction": "Respuesta por DM: HIFU",
      "notes": "8 s; registrar ID de story en cada conversación."
    }
  ],
  "2026-10-03": [
    {
      "label": "S13-1",
      "family": "Sin equipo protagonista",
      "onScreenText": "La primera pregunta es: ¿qué necesita tu centro?",
      "action": "Asesor del reel M01.",
      "interaction": "Caja: ¿Qué quieres mejorar?",
      "notes": "7 s; deja libre el centro inferior para el sticker."
    },
    {
      "label": "S13-2",
      "family": "Sin equipo protagonista",
      "onScreenText": "Tu carta, tu equipo humano y tu agenda orientan la elección.",
      "action": "Tres palabras en pantalla.",
      "interaction": "Sin sticker",
      "notes": "7 s; una idea por pantalla. No añadir otra promesa."
    },
    {
      "label": "S13-3",
      "family": "Sin equipo protagonista",
      "onScreenText": "Escribe CENTRO y cuéntanos tu siguiente objetivo.",
      "action": "Foto del equipo cuando corresponda; si no, fondo blanco roto.",
      "interaction": "Respuesta por DM: CENTRO",
      "notes": "8 s; registrar ID de story en cada conversación."
    }
  ],
  "2026-10-04": [
    {
      "label": "S14-1",
      "family": "Sin equipo protagonista",
      "onScreenText": "¿Qué respaldo buscas en tu proveedor?",
      "action": "Diseño tipográfico con foto exterior de equipo. No taller ni técnicos.",
      "interaction": "Encuesta: Asistencia / Mantenimiento",
      "notes": "7 s; deja libre el centro inferior para el sticker."
    },
    {
      "label": "S14-2",
      "family": "Sin equipo protagonista",
      "onScreenText": "Pregunta cómo contactar, qué cubre tu servicio y cómo se gestiona una incidencia.",
      "action": "Tres tarjetas gráficas. Sin pantallas de tickets ni llamadas escenificadas.",
      "interaction": "Sin sticker",
      "notes": "7 s; una idea por pantalla. No añadir otra promesa."
    },
    {
      "label": "S14-3",
      "family": "Sin equipo protagonista",
      "onScreenText": "Escribe RESPALDO y cuéntanos qué necesitas aclarar.",
      "action": "Foto del equipo cuando corresponda; si no, fondo blanco roto.",
      "interaction": "Respuesta por DM: RESPALDO",
      "notes": "8 s; registrar ID de story en cada conversación."
    }
  ],
  "2026-10-05": [
    {
      "label": "S15-1",
      "family": "Diatermia C-10 Max",
      "onScreenText": "¿Dónde incorporarías diatermia en tu centro?",
      "action": "C-10 Max en cabina.",
      "interaction": "Encuesta: Facial / Corporal",
      "notes": "7 s; deja libre el centro inferior para el sticker."
    },
    {
      "label": "S15-2",
      "family": "Diatermia C-10 Max",
      "onScreenText": "Conoce C-10 Max desde el protocolo que quieres trabajar.",
      "action": "Aplicadores reales.",
      "interaction": "Sin sticker",
      "notes": "7 s; una idea por pantalla. No añadir otra promesa."
    },
    {
      "label": "S15-3",
      "family": "Diatermia C-10 Max",
      "onScreenText": "Escribe C10 y cuéntanos tu prioridad.",
      "action": "Foto del equipo cuando corresponda; si no, fondo blanco roto.",
      "interaction": "Respuesta por DM: C10",
      "notes": "8 s; registrar ID de story en cada conversación."
    }
  ],
  "2026-10-06": [
    {
      "label": "S16-1",
      "family": "HIFU V-10 MAX",
      "onScreenText": "Elegir tecnología empieza por definir el servicio.",
      "action": "HIFU y ficha del centro.",
      "interaction": "Caja: ¿Ya ofreces reafirmación?",
      "notes": "7 s; deja libre el centro inferior para el sticker."
    },
    {
      "label": "S16-2",
      "family": "HIFU V-10 MAX",
      "onScreenText": "Revisa necesidades y formación antes de ampliar tu carta.",
      "action": "Asesor y profesional.",
      "interaction": "Sin sticker",
      "notes": "7 s; una idea por pantalla. No añadir otra promesa."
    },
    {
      "label": "S16-3",
      "family": "HIFU V-10 MAX",
      "onScreenText": "Escribe HIFU y cuéntanos qué trabajas actualmente.",
      "action": "Foto del equipo cuando corresponda; si no, fondo blanco roto.",
      "interaction": "Respuesta por DM: HIFU",
      "notes": "8 s; registrar ID de story en cada conversación."
    }
  ],
  "2026-10-07": [
    {
      "label": "S17-1",
      "family": "SHR X Ultra",
      "onScreenText": "¿Calculas inversión o solo miras precio?",
      "action": "Ultra y pizarra.",
      "interaction": "Encuesta: Hago números / Necesito ayuda",
      "notes": "7 s; deja libre el centro inferior para el sticker."
    },
    {
      "label": "S17-2",
      "family": "SHR X Ultra",
      "onScreenText": "Inversión total, margen por sesión y demanda real.",
      "action": "Tres variables sin cifras.",
      "interaction": "Sin sticker",
      "notes": "7 s; una idea por pantalla. No añadir otra promesa."
    },
    {
      "label": "S17-3",
      "family": "SHR X Ultra",
      "onScreenText": "Responde ULTRA y dinos qué servicio quieres desarrollar.",
      "action": "Foto del equipo cuando corresponda; si no, fondo blanco roto.",
      "interaction": "Respuesta por DM: ULTRA",
      "notes": "8 s; registrar ID de story en cada conversación."
    }
  ],
  "2026-10-08": [
    {
      "label": "S18-1",
      "family": "Sin equipo protagonista",
      "onScreenText": "El servicio técnico también se pregunta antes de comprar.",
      "action": "Diseño tipográfico con foto exterior de equipo. No taller ni técnicos.",
      "interaction": "Caja: ¿Qué necesitas saber?",
      "notes": "7 s; deja libre el centro inferior para el sticker."
    },
    {
      "label": "S18-2",
      "family": "Sin equipo protagonista",
      "onScreenText": "Pregunta cómo contactar, qué cubre tu servicio y cómo se gestiona una incidencia.",
      "action": "Tres tarjetas gráficas. Sin pantallas de tickets ni llamadas escenificadas.",
      "interaction": "Sin sticker",
      "notes": "7 s; una idea por pantalla. No añadir otra promesa."
    },
    {
      "label": "S18-3",
      "family": "Sin equipo protagonista",
      "onScreenText": "Escribe RESPALDO y cuéntanos qué necesitas aclarar.",
      "action": "Foto del equipo cuando corresponda; si no, fondo blanco roto.",
      "interaction": "Respuesta por DM: RESPALDO",
      "notes": "8 s; registrar ID de story en cada conversación."
    }
  ],
  "2026-10-09": [
    {
      "label": "S19-1",
      "family": "ColdSculptor M40 Ultra",
      "onScreenText": "¿Te consultan por grasa localizada o trabajo muscular?",
      "action": "M40 con aplicadores separados.",
      "interaction": "Encuesta: Grasa localizada / Músculo",
      "notes": "7 s; deja libre el centro inferior para el sticker."
    },
    {
      "label": "S19-2",
      "family": "ColdSculptor M40 Ultra",
      "onScreenText": "Son objetivos distintos. La valoración determina la aplicación.",
      "action": "Dos columnas tipográficas.",
      "interaction": "Sin sticker",
      "notes": "7 s; una idea por pantalla. No añadir otra promesa."
    },
    {
      "label": "S19-3",
      "family": "ColdSculptor M40 Ultra",
      "onScreenText": "Responde M40 y cuéntanos tu demanda corporal.",
      "action": "Foto del equipo cuando corresponda; si no, fondo blanco roto.",
      "interaction": "Respuesta por DM: M40",
      "notes": "8 s; registrar ID de story en cada conversación."
    }
  ],
  "2026-10-10": [
    {
      "label": "S20-1",
      "family": "Sin equipo protagonista",
      "onScreenText": "¿Tu carta diferencia higiene y fotorejuvenecimiento?",
      "action": "Carta facial ficticia.",
      "interaction": "Encuesta: Sí / Quiero revisarla",
      "notes": "7 s; deja libre el centro inferior para el sticker."
    },
    {
      "label": "S20-2",
      "family": "Sin equipo protagonista",
      "onScreenText": "Comunicar bien el servicio empieza por explicar su objetivo.",
      "action": "Fotograma de valoración.",
      "interaction": "Sin sticker",
      "notes": "7 s; una idea por pantalla. No añadir otra promesa."
    },
    {
      "label": "S20-3",
      "family": "Sin equipo protagonista",
      "onScreenText": "Escribe FACIAL y dinos qué tratamientos trabajas hoy.",
      "action": "Foto del equipo cuando corresponda; si no, fondo blanco roto.",
      "interaction": "Respuesta por DM: FACIAL",
      "notes": "8 s; registrar ID de story en cada conversación."
    }
  ],
  "2026-10-11": [
    {
      "label": "S21-1",
      "family": "SHR Xe",
      "onScreenText": "¿Qué quieres reforzar antes: depilación o facial?",
      "action": "Xe real.",
      "interaction": "Encuesta: Depilación / Facial",
      "notes": "7 s; deja libre el centro inferior para el sticker."
    },
    {
      "label": "S21-2",
      "family": "SHR Xe",
      "onScreenText": "El objetivo de tu centro debe guiar la elección.",
      "action": "Dos tarjetas junto al equipo.",
      "interaction": "Sin sticker",
      "notes": "7 s; una idea por pantalla. No añadir otra promesa."
    },
    {
      "label": "S21-3",
      "family": "SHR Xe",
      "onScreenText": "Escribe XE y cuéntanos dónde quieres crecer.",
      "action": "Foto del equipo cuando corresponda; si no, fondo blanco roto.",
      "interaction": "Respuesta por DM: XE",
      "notes": "8 s; registrar ID de story en cada conversación."
    }
  ],
  "2026-10-12": [
    {
      "label": "S22-1",
      "family": "Hidrapro H-20",
      "onScreenText": "La higiene facial también merece una propuesta clara.",
      "action": "Hidrapro y cabina.",
      "interaction": "Caja: ¿Cómo la trabajas ahora?",
      "notes": "7 s; deja libre el centro inferior para el sticker."
    },
    {
      "label": "S22-2",
      "family": "Hidrapro H-20",
      "onScreenText": "Valorar, seleccionar el protocolo y explicar cada paso.",
      "action": "Manos del profesional.",
      "interaction": "Sin sticker",
      "notes": "7 s; una idea por pantalla. No añadir otra promesa."
    },
    {
      "label": "S22-3",
      "family": "Hidrapro H-20",
      "onScreenText": "Responde HIDRA y cuéntanos tu servicio actual.",
      "action": "Foto del equipo cuando corresponda; si no, fondo blanco roto.",
      "interaction": "Respuesta por DM: HIDRA",
      "notes": "8 s; registrar ID de story en cada conversación."
    }
  ],
  "2026-10-13": [
    {
      "label": "S23-1",
      "family": "ColdSculptor M40 Ultra",
      "onScreenText": "Dos aplicadores diferentes no cuentan la misma historia.",
      "action": "Aplicadores M40 separados.",
      "interaction": "Caja: ¿Quieres conocer M40?",
      "notes": "7 s; deja libre el centro inferior para el sticker."
    },
    {
      "label": "S23-2",
      "family": "ColdSculptor M40 Ultra",
      "onScreenText": "Distingue criolipólisis de estimulación electromagnética.",
      "action": "Nombres sobre cada foto.",
      "interaction": "Sin sticker",
      "notes": "7 s; una idea por pantalla. No añadir otra promesa."
    },
    {
      "label": "S23-3",
      "family": "ColdSculptor M40 Ultra",
      "onScreenText": "Escribe M40 y dinos qué aplicación quieres valorar.",
      "action": "Foto del equipo cuando corresponda; si no, fondo blanco roto.",
      "interaction": "Respuesta por DM: M40",
      "notes": "8 s; registrar ID de story en cada conversación."
    }
  ],
  "2026-10-14": [
    {
      "label": "S24-1",
      "family": "Diatermia T-4 Pro",
      "onScreenText": "¿Has visto cómo se trabaja con T-4 Pro?",
      "action": "T-4 Pro real.",
      "interaction": "Encuesta: Sí / Quiero verlo",
      "notes": "7 s; deja libre el centro inferior para el sticker."
    },
    {
      "label": "S24-2",
      "family": "Diatermia T-4 Pro",
      "onScreenText": "Conoce su aplicación y pregunta por el masaje iónico rotacional.",
      "action": "Detalle rotacional real.",
      "interaction": "Sin sticker",
      "notes": "7 s; una idea por pantalla. No añadir otra promesa."
    },
    {
      "label": "S24-3",
      "family": "Diatermia T-4 Pro",
      "onScreenText": "Responde T4 y cuéntanos tu objetivo facial o corporal.",
      "action": "Foto del equipo cuando corresponda; si no, fondo blanco roto.",
      "interaction": "Respuesta por DM: T4",
      "notes": "8 s; registrar ID de story en cada conversación."
    }
  ],
  "2026-10-15": [
    {
      "label": "S25-1",
      "family": "Diatermia C-10 Max",
      "onScreenText": "¿Qué servicio quieres reforzar con diatermia?",
      "action": "C-10 Max junto al profesional.",
      "interaction": "Encuesta: Reafirmación facial / Corporal",
      "notes": "7 s; deja libre el centro inferior para el sticker."
    },
    {
      "label": "S25-2",
      "family": "Diatermia C-10 Max",
      "onScreenText": "Haz que la demo responda a tu carta actual.",
      "action": "Carta sin precios.",
      "interaction": "Sin sticker",
      "notes": "7 s; una idea por pantalla. No añadir otra promesa."
    },
    {
      "label": "S25-3",
      "family": "Diatermia C-10 Max",
      "onScreenText": "Escribe C10 y dinos qué ofreces hoy.",
      "action": "Foto del equipo cuando corresponda; si no, fondo blanco roto.",
      "interaction": "Respuesta por DM: C10",
      "notes": "8 s; registrar ID de story en cada conversación."
    }
  ],
  "2026-10-16": [
    {
      "label": "S26-1",
      "family": "SHR Xe",
      "onScreenText": "Tu carta marca la elección de tu equipo.",
      "action": "Xe y asesor del reel.",
      "interaction": "Encuesta: ¿Tienes centro? Sí / En proyecto",
      "notes": "7 s; deja libre el centro inferior para el sticker."
    },
    {
      "label": "S26-2",
      "family": "SHR Xe",
      "onScreenText": "Revisa necesidades, configuración y formación.",
      "action": "Tres tarjetas.",
      "interaction": "Sin sticker",
      "notes": "7 s; una idea por pantalla. No añadir otra promesa."
    },
    {
      "label": "S26-3",
      "family": "SHR Xe",
      "onScreenText": "Responde XE y cuéntanos tu prioridad.",
      "action": "Foto del equipo cuando corresponda; si no, fondo blanco roto.",
      "interaction": "Respuesta por DM: XE",
      "notes": "8 s; registrar ID de story en cada conversación."
    }
  ],
  "2026-10-17": [
    {
      "label": "S27-1",
      "family": "Sin equipo protagonista",
      "onScreenText": "¿Qué detalle cuidas antes de comenzar una sesión?",
      "action": "Modelo y profesional; escena representada.",
      "interaction": "Encuesta: Escucha / Explicación",
      "notes": "7 s; deja libre el centro inferior para el sticker."
    },
    {
      "label": "S27-2",
      "family": "Sin equipo protagonista",
      "onScreenText": "La experiencia de cabina también se diseña.",
      "action": "Preparación de espacio.",
      "interaction": "Sin sticker",
      "notes": "7 s; una idea por pantalla. No añadir otra promesa."
    },
    {
      "label": "S27-3",
      "family": "Sin equipo protagonista",
      "onScreenText": "Escribe CABINA y cuéntanos cómo lo hacéis.",
      "action": "Foto del equipo cuando corresponda; si no, fondo blanco roto.",
      "interaction": "Respuesta por DM: CABINA",
      "notes": "8 s; registrar ID de story en cada conversación."
    }
  ],
  "2026-10-18": [
    {
      "label": "S28-1",
      "family": "Sin equipo protagonista",
      "onScreenText": "¿Te queda alguna duda sobre el respaldo a tu equipo?",
      "action": "Diseño tipográfico con foto exterior de equipo. No taller ni técnicos.",
      "interaction": "Caja: ¿Qué necesitas saber?",
      "notes": "7 s; deja libre el centro inferior para el sticker."
    },
    {
      "label": "S28-2",
      "family": "Sin equipo protagonista",
      "onScreenText": "Pregunta cómo contactar, qué cubre tu servicio y cómo se gestiona una incidencia.",
      "action": "Tres tarjetas gráficas. Sin pantallas de tickets ni llamadas escenificadas.",
      "interaction": "Sin sticker",
      "notes": "7 s; una idea por pantalla. No añadir otra promesa."
    },
    {
      "label": "S28-3",
      "family": "Sin equipo protagonista",
      "onScreenText": "Escribe RESPALDO y cuéntanos qué necesitas aclarar.",
      "action": "Foto del equipo cuando corresponda; si no, fondo blanco roto.",
      "interaction": "Respuesta por DM: RESPALDO",
      "notes": "8 s; registrar ID de story en cada conversación."
    }
  ],
  "2026-10-19": [
    {
      "label": "S29-1",
      "family": "SHR Xn",
      "onScreenText": "No vayas a una demo sin tus preguntas.",
      "action": "Fotograma del reel A13.",
      "interaction": "Encuesta: Uso / Configuración",
      "notes": "7 s; deja libre el centro inferior para el sticker."
    },
    {
      "label": "S29-2",
      "family": "SHR Xn",
      "onScreenText": "Qué encaja. Qué incluye. Qué necesitas aprender.",
      "action": "Tres frases grandes.",
      "interaction": "Sin sticker",
      "notes": "7 s; una idea por pantalla. No añadir otra promesa."
    },
    {
      "label": "S29-3",
      "family": "SHR Xn",
      "onScreenText": "Escribe XN y preparamos contigo el siguiente paso.",
      "action": "Foto del equipo cuando corresponda; si no, fondo blanco roto.",
      "interaction": "Respuesta por DM: XN",
      "notes": "8 s; registrar ID de story en cada conversación."
    }
  ],
  "2026-10-20": [
    {
      "label": "S30-1",
      "family": "SHR X Ultra",
      "onScreenText": "¿Qué te falta para decidir tu próxima inversión?",
      "action": "Ultra real.",
      "interaction": "Encuesta: Información / Demostración",
      "notes": "7 s; deja libre el centro inferior para el sticker."
    },
    {
      "label": "S30-2",
      "family": "SHR X Ultra",
      "onScreenText": "Concreta el servicio que quieres potenciar y revisa tu configuración.",
      "action": "Asesor junto a Ultra.",
      "interaction": "Sin sticker",
      "notes": "7 s; una idea por pantalla. No añadir otra promesa."
    },
    {
      "label": "S30-3",
      "family": "SHR X Ultra",
      "onScreenText": "Responde ULTRA y cuéntanos tu objetivo.",
      "action": "Foto del equipo cuando corresponda; si no, fondo blanco roto.",
      "interaction": "Respuesta por DM: ULTRA",
      "notes": "8 s; registrar ID de story en cada conversación."
    }
  ]
}
;

export const CAPELINO_STORIES: Record<string, RealProductionStep[]> =
{
  "2026-09-21": [
    {
      "label": "Frame 1",
      "family": null,
      "onScreenText": "«NEW WEEK. NEW RULES.»",
      "action": null,
      "interaction": "Encuesta",
      "notes": "Hora: 19:30. Objetivo: Detectar qué hook interesa más. Seguimiento: Guardar resultado como variable creativa del primer test."
    },
    {
      "label": "Frame 2",
      "family": null,
      "onScreenText": "«What stops your scroll?» POV / Unexpected scene",
      "action": null,
      "interaction": null,
      "notes": null
    }
  ],
  "2026-09-22": [
    {
      "label": "Frame 1",
      "family": null,
      "onScreenText": "Macro de botella/copa 90 min antes",
      "action": null,
      "interaction": "Emoji slider",
      "notes": "Hora: 19:00 + 21:00. Objetivo: Apoyar S01 y medir reacción inicial. Seguimiento: Guardar respuestas y revisar DMs/reposts."
    },
    {
      "label": "Frame 2",
      "family": null,
      "onScreenText": "Repost S01 + slider 🍊",
      "action": null,
      "interaction": null,
      "notes": null
    }
  ],
  "2026-09-23": [
    {
      "label": "Frame 1",
      "family": null,
      "onScreenText": "Frame S01 + «Fast or cinematic?»",
      "action": null,
      "interaction": "Encuesta",
      "notes": "Hora: 19:30. Objetivo: Validar ritmo creativo. Seguimiento: Usar respuesta para decidir ritmo de S02/S03."
    },
    {
      "label": "Frame 2",
      "family": null,
      "onScreenText": "Fast / Cinematic",
      "action": null,
      "interaction": null,
      "notes": null
    }
  ],
  "2026-09-24": [
    {
      "label": "Frame 1",
      "family": null,
      "onScreenText": "Plano real de manos montando una mesa. «Tomorrow: real people. No pose.»",
      "action": null,
      "interaction": "Cuenta atrás",
      "notes": "Hora: 20:30. Objetivo: Precalentar S02. Seguimiento: Medir taps en cuenta atrás y respuestas."
    }
  ],
  "2026-09-25": [
    {
      "label": "Frame 1",
      "family": null,
      "onScreenText": "«Who starts the plan?»",
      "action": null,
      "interaction": "Encuesta",
      "notes": "Hora: 12:30 + 15:30. Objetivo: Empujar S02 sin duplicar el Reel. Seguimiento: Guardar respuesta + revisar visitas/reposts tras Story."
    },
    {
      "label": "Frame 2",
      "family": null,
      "onScreenText": "Me / The group",
      "action": null,
      "interaction": null,
      "notes": null
    },
    {
      "label": "Frame 3",
      "family": null,
      "onScreenText": "Repost S02",
      "action": null,
      "interaction": null,
      "notes": null
    }
  ],
  "2026-09-26": [
    {
      "label": "Frame 1",
      "family": null,
      "onScreenText": "Foto real casual de producto",
      "action": null,
      "interaction": "Caja de preguntas",
      "notes": "Hora: 19:30. Objetivo: Generar ideas desde comunidad. Seguimiento: Clasificar respuestas por terraza/playa/casa/evento/etc."
    },
    {
      "label": "Frame 2",
      "family": null,
      "onScreenText": "«Where would you take it?»",
      "action": null,
      "interaction": null,
      "notes": null
    }
  ],
  "2026-09-27": [
    {
      "label": "Frame 1",
      "family": null,
      "onScreenText": "«Next interruption?»",
      "action": null,
      "interaction": "Encuesta",
      "notes": "Hora: 20:30. Objetivo: Elegir siguiente concepto. Seguimiento: Usar ganador como referencia del siguiente Capelino World."
    },
    {
      "label": "Frame 2",
      "family": null,
      "onScreenText": "Orange door / Vending machine",
      "action": null,
      "interaction": null,
      "notes": null
    }
  ],
  "2026-09-28": [
    {
      "label": "Frame 1",
      "family": null,
      "onScreenText": "Resultado encuesta + detalle del set. «Tomorrow, open it.»",
      "action": null,
      "interaction": "Cuenta atrás",
      "notes": "Hora: 20:30. Objetivo: Crear curiosidad para S03. Seguimiento: Revisar taps y respuestas; no enseñar el reveal."
    }
  ],
  "2026-09-29": [
    {
      "label": "Frame 1",
      "family": null,
      "onScreenText": "Mano en pomo",
      "action": null,
      "interaction": "Encuesta",
      "notes": "Hora: 18:30 + 21:00. Objetivo: Extender S03 y abrir siguiente episodio. Seguimiento: Guardar respuesta para siguiente Interrupt."
    },
    {
      "label": "Frame 2",
      "family": null,
      "onScreenText": "Repost S03",
      "action": null,
      "interaction": null,
      "notes": null
    },
    {
      "label": "Frame 3",
      "family": null,
      "onScreenText": "«Where next?» Hotel / Laundromat",
      "action": null,
      "interaction": null,
      "notes": null
    }
  ],
  "2026-09-30": [
    {
      "label": "Frame 1",
      "family": null,
      "onScreenText": "Resultado de S03",
      "action": null,
      "interaction": "Sin sticker",
      "notes": "Hora: 20:30. Objetivo: Cerrar loop y enlazar octubre. Seguimiento: Comparar rendimiento S01/S02/S03 antes de entrar en octubre."
    },
    {
      "label": "Frame 2",
      "family": null,
      "onScreenText": "«OCTOBER STARTS TOMORROW. KEEP IT ORANGE.»",
      "action": null,
      "interaction": null,
      "notes": null
    }
  ],
  "2026-10-01": [
    {
      "label": "Frame 1",
      "family": null,
      "onScreenText": "«OCTOBER, BUT MAKE IT ORANGE.» Fondo limpio + botella fría.",
      "action": null,
      "interaction": "Sin sticker",
      "notes": "Hora: 20:30. Objetivo: Abrir tono de mes / branding. Seguimiento: Revisar respuestas/DMs y repostear menciones útiles."
    }
  ],
  "2026-10-02": [
    {
      "label": "Frame 1",
      "family": null,
      "onScreenText": "teaser 2 h antes: detalle de copa",
      "action": null,
      "interaction": "Encuesta",
      "notes": "Hora: 12:30 + 16:30. Objetivo: Empujar Reel sin repetirlo. Seguimiento: Guardar respuestas y usarlas en el siguiente contenido."
    },
    {
      "label": "Frame 2",
      "family": null,
      "onScreenText": "repost Reel + encuesta «Orange plan? YES / OBVIOUSLY»",
      "action": null,
      "interaction": null,
      "notes": null
    }
  ],
  "2026-10-03": [
    {
      "label": "Frame 1",
      "family": null,
      "onScreenText": "Foto real de producto en mesa/terraza. Texto mínimo: «Saturday looks.»",
      "action": null,
      "interaction": "Sin sticker",
      "notes": "Hora: 19:30. Objetivo: Presencia de marca. Seguimiento: Revisar respuestas/DMs y repostear menciones útiles."
    }
  ],
  "2026-10-04": [
    {
      "label": "Frame 1",
      "family": null,
      "onScreenText": "«What do you want more of?»",
      "action": null,
      "interaction": "Encuesta",
      "notes": "Hora: 19:30. Objetivo: Recoger preferencia creativa. Seguimiento: Guardar respuestas y usarlas en el siguiente contenido."
    },
    {
      "label": "Frame 2",
      "family": null,
      "onScreenText": "opciones: POV / Macro product",
      "action": null,
      "interaction": null,
      "notes": null
    }
  ],
  "2026-10-05": [
    {
      "label": "Frame 1",
      "family": null,
      "onScreenText": "Plano del set macro: hielo, naranja, copa. «Tomorrow: 3 seconds of orange.»",
      "action": null,
      "interaction": "Cuenta atrás opcional",
      "notes": "Hora: 20:30. Objetivo: Precalentar P02. Seguimiento: Revisar respuestas/DMs y repostear menciones útiles."
    }
  ],
  "2026-10-06": [
    {
      "label": "Frame 1",
      "family": null,
      "onScreenText": "macro antes de publicar",
      "action": null,
      "interaction": "Emoji slider",
      "notes": "Hora: 18:30 + 21:00. Objetivo: Interacción y distribución inicial. Seguimiento: Guardar respuestas y usarlas en el siguiente contenido."
    },
    {
      "label": "Frame 2",
      "family": null,
      "onScreenText": "repost + slider 🍊",
      "action": null,
      "interaction": null,
      "notes": null
    }
  ],
  "2026-10-07": [
    {
      "label": "Frame 1",
      "family": null,
      "onScreenText": "«Garnish?»",
      "action": null,
      "interaction": "Encuesta",
      "notes": "Hora: 19:30. Objetivo: Research producto/estética. Seguimiento: Guardar respuestas y usarlas en el siguiente contenido."
    },
    {
      "label": "Frame 2",
      "family": null,
      "onScreenText": "Orange slice / No garnish",
      "action": null,
      "interaction": null,
      "notes": null
    }
  ],
  "2026-10-08": [
    {
      "label": "Frame 1",
      "family": null,
      "onScreenText": "Foto UGC/real de producto. «SPOTTED.» + ubicación solo si está autorizada.",
      "action": null,
      "interaction": "Mención si aplica",
      "notes": "Hora: 20:30. Objetivo: Prueba social sin depender de influencer. Seguimiento: Revisar respuestas/DMs y repostear menciones útiles."
    }
  ],
  "2026-10-09": [
    {
      "label": "Frame 1",
      "family": null,
      "onScreenText": "«Who builds the aperitivo?»",
      "action": null,
      "interaction": "Encuesta",
      "notes": "Hora: 12:30 + 15:30. Objetivo: Activar conversación. Seguimiento: Guardar respuestas y usarlas en el siguiente contenido."
    },
    {
      "label": "Frame 2",
      "family": null,
      "onScreenText": "encuesta Me / Someone else",
      "action": null,
      "interaction": null,
      "notes": null
    },
    {
      "label": "Frame 3",
      "family": null,
      "onScreenText": "repost P03",
      "action": null,
      "interaction": null,
      "notes": null
    }
  ],
  "2026-10-10": [
    {
      "label": "Frame 1",
      "family": null,
      "onScreenText": "Foto real casual de copa/producto, sin sobre-diseño. «Capelino IRL.»",
      "action": null,
      "interaction": "Sin sticker",
      "notes": "Hora: 19:30. Objetivo: Naturalidad. Seguimiento: Revisar respuestas/DMs y repostear menciones útiles."
    }
  ],
  "2026-10-11": [
    {
      "label": "Frame 1",
      "family": null,
      "onScreenText": "«Where should Capelino appear next?» Elevator / Hotel room",
      "action": null,
      "interaction": "Encuesta",
      "notes": "Hora: 20:30. Objetivo: Validar escenario. Seguimiento: Guardar respuestas y usarlas en el siguiente contenido."
    }
  ],
  "2026-10-12": [
    {
      "label": "Frame 1",
      "family": null,
      "onScreenText": "Publicar resultado encuesta de ayer + mini BTS del concepto ganador.",
      "action": null,
      "interaction": "Sin sticker",
      "notes": "Hora: 20:30. Objetivo: Cerrar loop. Seguimiento: Revisar respuestas/DMs y repostear menciones útiles."
    }
  ],
  "2026-10-13": [
    {
      "label": "Frame 1",
      "family": null,
      "onScreenText": "teaser de 2 opciones",
      "action": null,
      "interaction": "Encuesta",
      "notes": "Hora: 18:30 + 21:00. Objetivo: Empujar comentarios. Seguimiento: Guardar respuestas y usarlas en el siguiente contenido."
    },
    {
      "label": "Frame 2",
      "family": null,
      "onScreenText": "repost carrusel: «No explanations. Pick.»",
      "action": null,
      "interaction": null,
      "notes": null
    }
  ],
  "2026-10-14": [
    {
      "label": "Frame 1",
      "family": null,
      "onScreenText": "Top combinación/comentario del carrusel. «You chose…»",
      "action": null,
      "interaction": "Sin sticker",
      "notes": "Hora: 20:30. Objetivo: Recompensar participación. Seguimiento: Revisar respuestas/DMs y repostear menciones útiles."
    }
  ],
  "2026-10-15": [
    {
      "label": "Frame 1",
      "family": null,
      "onScreenText": "Puertas cerradas de ascensor + «Tomorrow, wrong floor.»",
      "action": null,
      "interaction": "Cuenta atrás",
      "notes": "Hora: 20:30. Objetivo: Curiosidad. Seguimiento: Revisar respuestas/DMs y repostear menciones útiles."
    }
  ],
  "2026-10-16": [
    {
      "label": "Frame 1",
      "family": null,
      "onScreenText": "botón de ascensor",
      "action": null,
      "interaction": "Encuesta",
      "notes": "Hora: 12:30 + 16:30. Objetivo: Extender serie. Seguimiento: Guardar respuestas y usarlas en el siguiente contenido."
    },
    {
      "label": "Frame 2",
      "family": null,
      "onScreenText": "repost Reel",
      "action": null,
      "interaction": null,
      "notes": null
    },
    {
      "label": "Frame 3",
      "family": null,
      "onScreenText": "«Where next?» Laundry / Hotel",
      "action": null,
      "interaction": null,
      "notes": null
    }
  ],
  "2026-10-17": [
    {
      "label": "Frame 1",
      "family": null,
      "onScreenText": "Resultado «Where next?» + visual rápido de la opción ganadora.",
      "action": null,
      "interaction": "Sin sticker",
      "notes": "Hora: 20:30. Objetivo: Conectar con siguiente idea. Seguimiento: Revisar respuestas/DMs y repostear menciones útiles."
    }
  ],
  "2026-10-18": [
    {
      "label": "Frame 1",
      "family": null,
      "onScreenText": "Macro condensación/burbujas. Sin copy o solo «Sunday details.»",
      "action": null,
      "interaction": "Sin sticker",
      "notes": "Hora: 19:30. Objetivo: Branding sensorial. Seguimiento: Revisar respuestas/DMs y repostear menciones útiles."
    }
  ],
  "2026-10-19": [
    {
      "label": "Frame 1",
      "family": null,
      "onScreenText": "Dos objetos naranjas + «Can you guess the transition?»",
      "action": null,
      "interaction": "Pregunta",
      "notes": "Hora: 20:30. Objetivo: Anticipar match cuts. Seguimiento: Guardar respuestas y usarlas en el siguiente contenido."
    }
  ],
  "2026-10-20": [
    {
      "label": "Frame 1",
      "family": null,
      "onScreenText": "match-cut teaser",
      "action": null,
      "interaction": "Emoji slider",
      "notes": "Hora: 18:30 + 21:00. Objetivo: Refuerzo visual. Seguimiento: Guardar respuestas y usarlas en el siguiente contenido."
    },
    {
      "label": "Frame 2",
      "family": null,
      "onScreenText": "repost + «Once you see orange…»",
      "action": null,
      "interaction": null,
      "notes": null
    }
  ],
  "2026-10-21": [
    {
      "label": "Frame 1",
      "family": null,
      "onScreenText": "Dos portadas para futuro Reel. «A or B?»",
      "action": null,
      "interaction": "Encuesta",
      "notes": "Hora: 19:30. Objetivo: Optimizar covers. Seguimiento: Guardar respuestas y usarlas en el siguiente contenido."
    }
  ],
  "2026-10-22": [
    {
      "label": "Frame 1",
      "family": null,
      "onScreenText": "Frame fijo con un Capelino casi oculto. «Spot it.»",
      "action": null,
      "interaction": "Pregunta",
      "notes": "Hora: 20:30. Objetivo: Preparar P08 / juego. Seguimiento: Guardar respuestas y usarlas en el siguiente contenido."
    }
  ],
  "2026-10-23": [
    {
      "label": "Frame 1",
      "family": null,
      "onScreenText": "golden hour real",
      "action": null,
      "interaction": "Encuesta",
      "notes": "Hora: 12:30 + 15:30. Objetivo: Comparar preferencia. Seguimiento: Guardar respuestas y usarlas en el siguiente contenido."
    },
    {
      "label": "Frame 2",
      "family": null,
      "onScreenText": "repost Reel + «IRL > studio?»",
      "action": null,
      "interaction": null,
      "notes": null
    }
  ],
  "2026-10-24": [
    {
      "label": "Frame 1",
      "family": null,
      "onScreenText": "Repost de mención si existe; si no, foto propia casual con «Capelino spotted.»",
      "action": null,
      "interaction": "Mención",
      "notes": "Hora: 20:30. Objetivo: Normalizar presencia real. Seguimiento: Revisar respuestas/DMs y repostear menciones útiles."
    }
  ],
  "2026-10-25": [
    {
      "label": "Frame 1",
      "family": null,
      "onScreenText": "Visual vinilo/retro + «Pick the soundtrack» Disco / Indie",
      "action": null,
      "interaction": "Encuesta",
      "notes": "Hora: 19:30. Objetivo: Research cultural. Seguimiento: Guardar respuestas y usarlas en el siguiente contenido."
    }
  ],
  "2026-10-26": [
    {
      "label": "Frame 1",
      "family": null,
      "onScreenText": "Escena del juego desenfocada + «Tomorrow. 3 seconds.»",
      "action": null,
      "interaction": "Cuenta atrás",
      "notes": "Hora: 20:30. Objetivo: Curiosidad. Seguimiento: Revisar respuestas/DMs y repostear menciones útiles."
    }
  ],
  "2026-10-27": [
    {
      "label": "Frame 1",
      "family": null,
      "onScreenText": "«Ready?»",
      "action": null,
      "interaction": "Encuesta",
      "notes": "Hora: 18:30 + 21:00. Objetivo: Gamificación. Seguimiento: Guardar respuestas y usarlas en el siguiente contenido."
    },
    {
      "label": "Frame 2",
      "family": null,
      "onScreenText": "repost Reel",
      "action": null,
      "interaction": null,
      "notes": null
    },
    {
      "label": "Frame 3",
      "family": null,
      "onScreenText": "«Found it before reveal?» Yes / No",
      "action": null,
      "interaction": null,
      "notes": null
    }
  ],
  "2026-10-28": [
    {
      "label": "Frame 1",
      "family": null,
      "onScreenText": "Mostrar ubicación exacta del producto + % de encuesta.",
      "action": null,
      "interaction": "Sin sticker",
      "notes": "Hora: 20:30. Objetivo: Cerrar loop. Seguimiento: Revisar respuestas/DMs y repostear menciones útiles."
    }
  ],
  "2026-10-29": [
    {
      "label": "Frame 1",
      "family": null,
      "onScreenText": "Macro naranja/hielo/condensación. «Close-up season.»",
      "action": null,
      "interaction": "Sin sticker",
      "notes": "Hora: 19:30. Objetivo: Mantener estética. Seguimiento: Revisar respuestas/DMs y repostear menciones útiles."
    }
  ],
  "2026-10-30": [
    {
      "label": "Frame 1",
      "family": null,
      "onScreenText": "escena retro nocturna naranja",
      "action": null,
      "interaction": "Encuesta",
      "notes": "Hora: 20:30. Objetivo: Estacional adulto. Seguimiento: Guardar respuestas y usarlas en el siguiente contenido."
    },
    {
      "label": "Frame 2",
      "family": null,
      "onScreenText": "«After dark: vinyl / city lights?»",
      "action": null,
      "interaction": null,
      "notes": null
    }
  ],
  "2026-10-31": [
    {
      "label": "Frame 1",
      "family": null,
      "onScreenText": "«CAPELINO AFTER DARK.»",
      "action": null,
      "interaction": "Emoji slider 🍊",
      "notes": "Hora: 20:30. Objetivo: Branding estacional adulto. Seguimiento: Revisar respuestas/DMs y repostear menciones útiles."
    },
    {
      "label": "Frame 2",
      "family": null,
      "onScreenText": "bodegón naranja oscuro / sombras / producto",
      "action": null,
      "interaction": null,
      "notes": null
    }
  ]
}
;
