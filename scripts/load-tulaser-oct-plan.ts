// Carga en Nexalya (Turso) el plan de contenido de Tulaserclinic del 1 al
// 15 de octubre de 2026 que se preparó a partir de sus Insights de
// Instagram — el mismo que se entregó como Excel, pero aquí ya en forma
// de plan_batch + plan_items + content_items (feed) + content_items
// (historias independientes, una por día), tal y como espera la web.
//
// Pensado para evitar el bug de "conceptos repetidos en el mismo mes":
// cada una de las 7 piezas de feed trata un concepto distinto (ninguna
// pieza repite el mismo mito/tratamiento/ángulo que otra), repartidas
// entre las 4 líneas editoriales ya definidas para el cliente.
//
// Es SEGURO de ejecutar más de una vez: antes de insertar, borra (por
// fecha, dentro del rango 2026-10-01..2026-10-15) cualquier plan_item o
// content_item que ya hubiera creado una ejecución anterior de ESTE
// script (identificados por notes/productionNotes con la marca interna
// "source: load-tulaser-oct-plan"), sin tocar nada creado a mano o desde
// otro sitio.
//
// Uso:  npx tsx --env-file=.env.local scripts/load-tulaser-oct-plan.ts

import { createClient } from "@libsql/client";
import { randomUUID } from "node:crypto";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;
if (!url) throw new Error("Falta TURSO_DATABASE_URL en .env.local");
const db = createClient({ url, authToken });

const SOURCE_TAG = "load-tulaser-oct-plan";
const CLIENT_NAME_MATCH = "tulaser";

type Step = {
  label: string;
  function: string;
  action: string;
  onScreenText?: string;
  voiceover?: string;
  notes?: string;
};

type StoryFrame = {
  label: string;
  onScreenText: string;
  action: string;
  notes: string;
};

type FeedItem = {
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  pillar: string;
  format: "Reel" | "Carrusel";
  topic: string;
  objective: string;
  kpi: string;
  caption: string;
  whoAppears: string;
  materials: string;
  validateBeforePublish: string;
  steps: Step[];
  linkedStories: StoryFrame[]; // stories del MISMO día, de apoyo a esta pieza
};

const FEED_ITEMS: FeedItem[] = [
  {
    date: "2026-10-01",
    time: "19:30",
    pillar: "Antes de decidir",
    format: "Reel",
    topic: "El ácido hialurónico no es un único tratamiento — 3 preguntas antes de pedir cita",
    objective: "Educar / captación",
    kpi: "Guardados y clics a reserva de cita",
    caption:
      "No todo el ácido hialurónico se usa igual. Antes de pedir cita, hazte estas 3 preguntas 👇\n\n" +
      "Cada rostro necesita un enfoque distinto — por eso en Tulaser empezamos siempre con un diagnóstico personalizado.\n\n" +
      "📍 Link en bio para tu diagnóstico gratuito.\n#AcidoHialuronico #MedicinaEstetica #Tulaserclinic",
    whoAppears: "Profesional a cámara",
    materials: "Gabinete de consulta, sin producto a la vista (foco en la explicación, no en la venta)",
    validateBeforePublish: "No prometer resultados concretos ni usar cifras de duración sin matizar que varía por paciente",
    steps: [
      { label: "0-3 s", function: "Hook", action: "Primer plano a cámara", onScreenText: "¿Sabías que el ácido hialurónico no es un único tratamiento?", voiceover: "¿Sabías que el ácido hialurónico no es un único tratamiento?", notes: "Corte seco al terminar la frase" },
      { label: "3-10 s", function: "Desarrollo", action: "Plano medio, profesional explicando", onScreenText: "Pregunta 1: ¿qué zona te preocupa de verdad?", voiceover: "Lo primero: ¿qué zona te preocupa de verdad?", notes: "" },
      { label: "10-17 s", function: "Desarrollo", action: "Mismo plano, continúa la explicación", onScreenText: "Pregunta 2: ¿buscas volumen o hidratación?", voiceover: "Segundo: ¿buscas volumen o solo hidratar?", notes: "" },
      { label: "17-24 s", function: "Desarrollo", action: "Mismo plano, cierra la idea", onScreenText: "Pregunta 3: ¿qué resultado es realista para ti?", voiceover: "Y tercero: qué resultado es realista en tu caso concreto", notes: "" },
      { label: "24-30 s", function: "CTA", action: "Plano medio, mirada a cámara", onScreenText: "Resuélvelo en tu diagnóstico gratuito · link en bio", voiceover: "Te lo resolvemos en tu diagnóstico personalizado, gratis", notes: "Texto grande y fijo los últimos 3 segundos" },
    ],
    linkedStories: [
      { label: "Frame 1", onScreenText: "Hoy hablamos de ácido hialurónico 👆", action: "Repost del reel recién publicado", notes: "Sticker de cuenta atrás a la próxima cita disponible" },
      { label: "Frame 2", onScreenText: "¿Cuál es tu duda sobre el ácido hialurónico?", action: "Caja de preguntas abierta", notes: "Guardar respuestas para el banco de ideas de \"Pregúntale al profesional\"" },
    ],
  },
  {
    date: "2026-10-03",
    time: "19:30",
    pillar: "La belleza de lo normal",
    format: "Carrusel",
    topic: "Piel real, sin filtro: lo que de verdad cambia (y lo que no hace falta cambiar)",
    objective: "Conexión / seguidores nuevos",
    kpi: "Nuevos seguidores",
    caption:
      "No todo tiene que cambiar. Esto es lo que trabajamos — y esto es lo que decidimos dejar igual.\n\n" +
      "En Tulaser no vendemos perfección, vendemos que te sientas bien con lo tuyo.\n\n" +
      "Síguenos si quieres ver más piel real 👇\n#BellezaReal #PielReal #Tulaserclinic",
    whoAppears: "Paciente (con permiso, o anónima si lo prefiere) — solo la zona tratada",
    materials: "Fotos antes/durante/después con la misma luz e iluminación (comparación honesta)",
    validateBeforePublish: "Consentimiento explícito de la paciente para publicar su imagen; no editar la foto más allá de encuadre",
    steps: [
      { label: "Diapositiva 1", function: "Portada", action: "Texto sobre fondo neutro, sin foto todavía", onScreenText: "Lo que no te enseñan en redes" },
      { label: "Diapositiva 2", function: "Desarrollo", action: "Foto \"antes\"", onScreenText: "Antes: esto es lo que había" },
      { label: "Diapositiva 3", function: "Desarrollo", action: "Foto \"durante\" o del proceso", onScreenText: "Esto es lo que trabajamos" },
      { label: "Diapositiva 4", function: "Desarrollo", action: "Foto \"después\", misma luz que la primera", onScreenText: "Y esto es lo que decidimos dejar igual" },
      { label: "Diapositiva 5", function: "CTA", action: "Texto sobre fondo neutro", onScreenText: "Síguenos si quieres ver más piel real" },
    ],
    linkedStories: [
      { label: "Frame 1", onScreenText: "¿Qué te parece este cambio?", action: "Encuesta Sí / No: \"¿Te lo harías?\"", notes: "Resultado de la encuesta comentado en la siguiente historia si da buen dato" },
      { label: "Frame 2", onScreenText: "Reseña real de una paciente", action: "Captura de una reseña (con permiso) o cita textual", notes: "Sticker de valoración con estrellas" },
    ],
  },
  {
    date: "2026-10-05",
    time: "19:30",
    pillar: "Antes de la cabina",
    format: "Reel",
    topic: "Así es tu primera cita en Tulaser: sin sorpresas",
    objective: "Reducir la incertidumbre / captación",
    kpi: "Clics a reserva de cita",
    caption:
      "¿Primera vez en clínica estética? Así es exactamente tu primera visita, paso a paso — nada de sorpresas.\n\n" +
      "📍 Reserva tu diagnóstico gratuito, link en bio.\n#PrimeraVisita #ClinicaEstetica #Tulaserclinic",
    whoAppears: "Paciente (de espaldas o con permiso) + profesional",
    materials: "Recepción y gabinete de diagnóstico, sin material médico expuesto en primer plano",
    validateBeforePublish: "No mostrar datos de otros pacientes en pantalla ni documentación visible",
    steps: [
      { label: "0-4 s", function: "Hook", action: "Plano de la entrada/recepción", onScreenText: "¿Primera vez en clínica estética?", voiceover: "¿Primera vez en una clínica estética?", notes: "" },
      { label: "4-12 s", function: "Desarrollo", action: "Recepción, bienvenida", onScreenText: "1. Te recibimos y te explicamos el proceso", voiceover: "Primero te recibimos y te explicamos cómo va a ir todo", notes: "" },
      { label: "12-20 s", function: "Desarrollo", action: "Gabinete, diagnóstico con el profesional", onScreenText: "2. Diagnóstico personalizado, sin compromiso", voiceover: "Después, un diagnóstico personalizado, sin ningún compromiso", notes: "" },
      { label: "20-27 s", function: "Desarrollo", action: "Profesional explicando un plan en pantalla o papel", onScreenText: "3. Te proponemos un plan hecho para ti", voiceover: "Y te proponemos un plan pensado solo para tu caso", notes: "" },
      { label: "27-32 s", function: "CTA", action: "Plano medio a cámara", onScreenText: "Reserva tu diagnóstico gratuito · link en bio", voiceover: "Reserva tu diagnóstico gratuito, te esperamos", notes: "" },
    ],
    linkedStories: [
      { label: "Frame 1", onScreenText: "Detrás de cámaras de hoy", action: "Clip corto de la preparación de un tratamiento real en curso", notes: "Cuenta atrás a la próxima cita disponible" },
      { label: "Frame 2", onScreenText: "¿Te animas a dar el paso?", action: "Encuesta Sí / Todavía no", notes: "" },
    ],
  },
  {
    date: "2026-10-08",
    time: "19:30",
    pillar: "Pregúntale al profesional",
    format: "Carrusel",
    topic: "Responde el equipo: ¿duele la diatermia facial?",
    objective: "Confianza / guardados",
    kpi: "Comentarios (nuevas preguntas para el banco de ideas)",
    caption:
      "Nos lo preguntáis mucho: ¿duele la diatermia facial? Responde el equipo 👇\n\n" +
      "¿Tienes otra duda? Escríbela en comentarios y la respondemos en el próximo \"Pregúntale al profesional\".\n#DiatermiaFacial #DudasResueltas #Tulaserclinic",
    whoAppears: "Profesional (texto, sin necesidad de vídeo)",
    materials: "Ninguno especial — diseño de carrusel con la ficha de marca",
    validateBeforePublish: "Describir la sensación real, no minimizarla ni exagerarla",
    steps: [
      { label: "Diapositiva 1", function: "Portada", action: "La pregunta tal cual la hacen los pacientes", onScreenText: "\"¿Duele la diatermia facial?\"" },
      { label: "Diapositiva 2", function: "Desarrollo", action: "Respuesta punto 1", onScreenText: "No es doloroso: se siente calor progresivo y controlado" },
      { label: "Diapositiva 3", function: "Desarrollo", action: "Respuesta punto 2", onScreenText: "La sesión dura entre 20 y 40 minutos según la zona" },
      { label: "Diapositiva 4", function: "Desarrollo", action: "Respuesta punto 3", onScreenText: "Sin tiempo de recuperación: puedes seguir tu día con normalidad" },
      { label: "Diapositiva 5", function: "CTA", action: "Texto de cierre", onScreenText: "¿Tienes otra pregunta? Escríbela en comentarios" },
    ],
    linkedStories: [
      { label: "Frame 1", onScreenText: "Hoy respondemos sobre diatermia facial 👆", action: "Repost del carrusel recién publicado", notes: "Sticker de cuenta atrás" },
      { label: "Frame 2", onScreenText: "Detrás de cámaras del gabinete", action: "Clip corto del equipo preparando una sesión", notes: "" },
    ],
  },
  {
    date: "2026-10-10",
    time: "19:30",
    pillar: "Antes de decidir",
    format: "Reel",
    topic: "Ácido hialurónico vs. bioestimuladores de colágeno: no es lo mismo",
    objective: "Educar / posicionamiento como expertos",
    kpi: "Guardados y clics a reserva",
    caption:
      "¿Ácido hialurónico o bioestimulador? No es lo mismo ni sirven para lo mismo — te lo explicamos en 30 segundos.\n\n" +
      "Cada tratamiento tiene su momento. En tu diagnóstico te decimos cuál es el tuyo.\n#Bioestimuladores #AcidoHialuronico #Tulaserclinic",
    whoAppears: "Profesional a cámara",
    materials: "Gabinete de consulta",
    validateBeforePublish: "Diferenciar claramente ambos tratamientos sin presentar ninguno como \"mejor\" en general, solo distinto según el caso",
    steps: [
      { label: "0-3 s", function: "Hook", action: "Primer plano a cámara", onScreenText: "¿Rellenar o bioestimular? No es lo mismo", voiceover: "¿Rellenar o bioestimular? No es lo mismo", notes: "" },
      { label: "3-12 s", function: "Desarrollo", action: "Plano medio, explicación 1", onScreenText: "El ácido hialurónico rellena y da volumen al instante", voiceover: "El ácido hialurónico rellena y da volumen al instante", notes: "" },
      { label: "12-21 s", function: "Desarrollo", action: "Plano medio, explicación 2", onScreenText: "El bioestimulador activa tu propio colágeno, poco a poco", voiceover: "El bioestimulador activa tu propio colágeno, de forma progresiva", notes: "" },
      { label: "21-28 s", function: "CTA", action: "Plano medio a cámara", onScreenText: "Te decimos cuál es el tuyo en el diagnóstico gratuito", voiceover: "Te decimos cuál es el tuyo en tu diagnóstico gratuito, link en bio", notes: "" },
    ],
    linkedStories: [
      { label: "Frame 1", onScreenText: "¿Sabías la diferencia?", action: "Sticker de quiz: \"Rellena\" o \"Estimula\"", notes: "Revelar la respuesta correcta en el siguiente frame" },
      { label: "Frame 2", onScreenText: "La respuesta correcta y por qué", action: "Texto breve con la explicación", notes: "" },
    ],
  },
  {
    date: "2026-10-13",
    time: "19:30",
    pillar: "La belleza de lo normal",
    format: "Reel",
    topic: "Un cambio que se nota — parte 2 (otro caso real, distinto al de la pieza del día 3)",
    objective: "Conexión / nuevos seguidores",
    kpi: "Nuevos seguidores y shares",
    caption:
      "Otro cambio real. Esto es lo que se puede conseguir sin perder lo que te hace tú.\n\n" +
      "Cada persona, un caso distinto — por eso empezamos siempre con un diagnóstico personalizado.\n#CambioReal #Tulaserclinic",
    whoAppears: "Paciente (con permiso) — caso distinto al del carrusel del día 3, para no repetir el mismo antes/después",
    materials: "Música suave de fondo, sin texto agresivo tipo \"antes horrible / después perfecto\"",
    validateBeforePublish: "Que el caso mostrado sea DISTINTO al usado el día 3 (zona, tratamiento o paciente diferente) para no repetir el mismo antes/después dos veces en el mes",
    steps: [
      { label: "0-5 s", function: "Hook", action: "Foto/clip \"antes\"", onScreenText: "Un cambio que se nota" },
      { label: "5-15 s", function: "Desarrollo", action: "Clip del proceso/tratamiento", onScreenText: "" },
      { label: "15-25 s", function: "Desarrollo", action: "Foto/clip \"después\", misma luz", onScreenText: "" },
      { label: "25-30 s", function: "CTA", action: "Paciente hablando brevemente de cómo se siente (voz real, no locución)", onScreenText: "Síguenos para ver más cambios reales", voiceover: "Testimonio breve y espontáneo de la paciente" },
    ],
    linkedStories: [
      { label: "Frame 1", onScreenText: "¿Qué te gustaría saber?", action: "Sticker de preguntas abierto", notes: "Respuestas para el banco de ideas de \"Pregúntale al profesional\"" },
      { label: "Frame 2", onScreenText: "Repost del reel de hoy", action: "Repost con CTA a seguir", notes: "" },
    ],
  },
  {
    date: "2026-10-15",
    time: "19:30",
    pillar: "Antes de la cabina",
    format: "Carrusel",
    topic: "Qué llevar (y qué evitar) antes de tu cita",
    objective: "Reducir fricción antes de la primera visita",
    kpi: "Clics a reserva de cita",
    caption:
      "Antes de tu cita, esto es lo único que necesitas saber (y lo único que deberías evitar los 2 días antes).\n\n" +
      "📍 Reserva tu diagnóstico gratuito, link en bio.\n#AntesDeTuCita #Tulaserclinic",
    whoAppears: "Sin persona — carrusel de texto/iconografía",
    materials: "Diseño de carrusel con la ficha de marca",
    validateBeforePublish: "Las recomendaciones de \"qué evitar\" deben coincidir con el protocolo real de la clínica, revisar con el equipo médico antes de publicar",
    steps: [
      { label: "Diapositiva 1", function: "Portada", action: "Texto sobre fondo de marca", onScreenText: "Qué llevar (y qué evitar) antes de tu cita" },
      { label: "Diapositiva 2", function: "Desarrollo", action: "Icono + texto", onScreenText: "Qué llevar: tu historial si tienes alguno, y ganas de preguntar" },
      { label: "Diapositiva 3", function: "Desarrollo", action: "Icono + texto", onScreenText: "Qué evitar 48h antes: sol directo, alcohol y ciertos activos (retinol, exfoliantes)" },
      { label: "Diapositiva 4", function: "Desarrollo", action: "Icono + texto", onScreenText: "Qué esperar al llegar: recepción, diagnóstico y plan personalizado, sin compromiso" },
      { label: "Diapositiva 5", function: "CTA", action: "Texto de cierre", onScreenText: "Reserva tu diagnóstico gratuito · link en bio" },
    ],
    linkedStories: [
      { label: "Frame 1", onScreenText: "Hoy: qué llevar y qué evitar antes de tu cita 👆", action: "Repost del carrusel recién publicado", notes: "Sticker de cuenta atrás a la próxima cita disponible" },
      { label: "Frame 2", onScreenText: "Última semana con este plan — ¿qué te gustaría ver en el próximo?", action: "Caja de preguntas abierta", notes: "Recoger ideas para el plan de la segunda quincena de octubre" },
    ],
  },
];

// Historias independientes para los días SIN publicación de feed (mismo
// ritmo semanal que el Excel: detrás de cámaras / pregunta comunidad /
// mito o realidad / antes-después rápido / testimonio / recordatorio).
const STANDALONE_STORY_DAYS: { date: string; topic: string; frames: StoryFrame[] }[] = [
  {
    date: "2026-10-02",
    topic: "Antes/después rápido",
    frames: [
      { label: "Frame 1", onScreenText: "Resultado exprés de esta semana", action: "Antes/después rápido de un caso ya publicado o nuevo (distinto al del feed)", notes: "" },
      { label: "Frame 2", onScreenText: "¿Te lo harías?", action: "Encuesta Sí / No", notes: "" },
    ],
  },
  {
    date: "2026-10-04",
    topic: "Recordatorio + objetivo de la semana",
    frames: [
      { label: "Frame 1", onScreenText: "Horario de la clínica esta semana", action: "Gráfico o texto con el horario", notes: "" },
      { label: "Frame 2", onScreenText: "¿Cuál es tu objetivo de piel esta semana?", action: "Caja de preguntas abierta", notes: "" },
    ],
  },
  {
    date: "2026-10-06",
    topic: "Pregunta de la comunidad",
    frames: [
      { label: "Frame 1", onScreenText: "¿Qué te gustaría saber?", action: "Sticker de preguntas", notes: "" },
      { label: "Frame 2", onScreenText: "Respuesta breve a una duda ya recibida", action: "Texto o clip corto respondiendo", notes: "" },
    ],
  },
  {
    date: "2026-10-07",
    topic: "Mito o realidad",
    frames: [
      { label: "Frame 1", onScreenText: "\"El botox impide gesticular\" ¿mito o realidad?", action: "Sticker de quiz (2 opciones)", notes: "" },
      { label: "Frame 2", onScreenText: "Mito — bien aplicado, respeta la expresión natural", action: "Respuesta explicada en 15 segundos", notes: "" },
    ],
  },
  {
    date: "2026-10-09",
    topic: "Antes/después rápido",
    frames: [
      { label: "Frame 1", onScreenText: "Otro resultado exprés (caso distinto al del día 2)", action: "Antes/después rápido", notes: "" },
      { label: "Frame 2", onScreenText: "¿Te lo harías?", action: "Encuesta Sí / No", notes: "" },
    ],
  },
  {
    date: "2026-10-11",
    topic: "Recordatorio + objetivo de la semana",
    frames: [
      { label: "Frame 1", onScreenText: "Horario de la clínica la próxima semana", action: "Gráfico o texto con el horario", notes: "" },
      { label: "Frame 2", onScreenText: "¿Cuál es tu objetivo de piel esta semana?", action: "Caja de preguntas abierta", notes: "" },
    ],
  },
  {
    date: "2026-10-12",
    topic: "Detrás de cámaras",
    frames: [
      { label: "Frame 1", onScreenText: "Preparando la semana en el gabinete", action: "Clip corto de preparación, sin paciente identificable", notes: "" },
      { label: "Frame 2", onScreenText: "Un detalle que no se ve en el feed", action: "Detalle del proceso o del equipo", notes: "" },
    ],
  },
  {
    date: "2026-10-14",
    topic: "Mito o realidad",
    frames: [
      { label: "Frame 1", onScreenText: "\"El ácido hialurónico da un efecto exagerado\" ¿mito o realidad?", action: "Sticker de quiz (2 opciones)", notes: "" },
      { label: "Frame 2", onScreenText: "Mito — bien dosificado, el resultado es natural", action: "Respuesta explicada en 15 segundos", notes: "" },
    ],
  },
];

async function main() {
  const clientsRs = await db.execute(`SELECT id, name FROM clients`);
  const clients = clientsRs.rows as unknown as { id: string; name: string }[];
  const matches = clients.filter((c) => c.name.toLowerCase().includes(CLIENT_NAME_MATCH));
  if (matches.length !== 1) {
    console.error(`Se esperaba un único cliente que contenga "${CLIENT_NAME_MATCH}", se encontraron ${matches.length}:`);
    for (const c of matches) console.error(` - ${c.name} (${c.id})`);
    process.exit(1);
  }
  const client = matches[0];
  console.log(`Cargando plan de octubre (1-15) para "${client.name}" (${client.id})…`);

  // Limpieza de una carga anterior de ESTE script, si la hay (identificada
  // por la marca interna en productionNotes), para poder re-ejecutarlo sin
  // duplicar contenido.
  const existingRs = await db.execute({
    sql: `SELECT id, productionNotes FROM content_items WHERE clientId = ? AND scheduledAt >= '2026-10-01T00:00:00.000Z' AND scheduledAt < '2026-10-16T00:00:00.000Z'`,
    args: [client.id],
  });
  let removed = 0;
  for (const row of existingRs.rows as unknown as { id: string; productionNotes: string | null }[]) {
    if (!row.productionNotes) continue;
    if (row.productionNotes.includes(SOURCE_TAG)) {
      await db.execute({ sql: `DELETE FROM plan_items WHERE contentItemId = ?`, args: [row.id] });
      await db.execute({ sql: `DELETE FROM content_items WHERE id = ?`, args: [row.id] });
      removed++;
    }
  }
  if (removed > 0) console.log(`✓ Eliminada una carga anterior de este script (${removed} piezas) antes de recrearla.`);

  const nowIso = new Date().toISOString();
  const batchId = randomUUID();
  await db.execute({
    sql: `INSERT INTO plan_batches (id, clientId, periodDays, trendsSummary, model, createdAt) VALUES (?, ?, ?, ?, ?, ?)`,
    args: [
      batchId,
      client.id,
      15,
      "Plan preparado a mano a partir de los Insights de Instagram de los últimos 30 días (771,2 mil visualizaciones, 402 seguidores nuevos, crecimiento de seguidores casi plano) y de las 4 líneas editoriales ya definidas: Antes de decidir, La belleza de lo normal, Pregúntale al profesional, Antes de la cabina. Los formatos que mejor funcionan en la cuenta (reels de transformación real y carruseles educativos) se repiten en el ritmo semanal, pero cada pieza trata un concepto distinto — sin repetir el mismo mito, tratamiento o ángulo dos veces en el mismo plan.",
      "manual",
      nowIso,
    ],
  });

  let feedCreated = 0;
  for (const item of FEED_ITEMS) {
    const isReel = item.format === "Reel";
    const contentId = randomUUID();
    const scheduledAt = new Date(`${item.date}T${item.time}:00`).toISOString();

    const productionNotes = {
      format: item.format,
      concept: item.topic,
      family: item.pillar,
      kpi: item.kpi,
      approval: "Pendiente",
      whoAppears: item.whoAppears,
      materials: item.materials,
      validateBeforePublish: item.validateBeforePublish,
      steps: item.steps,
      stories: item.linkedStories,
      source: SOURCE_TAG,
    };

    await db.execute({
      sql: `INSERT INTO content_items
        (id, clientId, title, caption, mediaUrl, mediaType, platform, scheduledAt, status, publishedAt, errorMessage, productionNotes, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'DRAFT', NULL, NULL, ?, ?, ?)`,
      args: [
        contentId,
        client.id,
        item.topic,
        item.caption,
        `https://picsum.photos/seed/tulaser-oct-${contentId}/600/600`,
        isReel ? "VIDEO" : "IMAGE",
        "INSTAGRAM",
        scheduledAt,
        JSON.stringify(productionNotes),
        nowIso,
        nowIso,
      ],
    });

    const planItemId = randomUUID();
    await db.execute({
      sql: `INSERT INTO plan_items (id, clientId, planBatchId, date, day, format, family, topic, objective, kpi, keyword, notes, status, contentItemId, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'SCHEDULED', ?, ?, ?)`,
      args: [
        planItemId,
        client.id,
        batchId,
        item.date,
        new Date(item.date + "T12:00:00").toLocaleDateString("es-ES", { weekday: "long" }),
        item.format,
        item.pillar,
        item.topic,
        item.objective,
        item.kpi,
        item.pillar,
        `Historias del día embebidas en el guion. [${SOURCE_TAG}]`,
        contentId,
        nowIso,
        nowIso,
      ],
    });

    // Historia independiente, para que también aparezca en la pestaña
    // "Historias" el mismo día, enlazada a esta pieza de feed.
    const storyId = randomUUID();
    const storyNotes = {
      format: "STORY",
      concept: `Stories del ${item.date} — apoyo a "${item.topic}"`,
      approval: "Pendiente",
      steps: item.linkedStories,
      sourceItemId: contentId,
      source: SOURCE_TAG,
    };
    await db.execute({
      sql: `INSERT INTO content_items
        (id, clientId, title, caption, mediaUrl, mediaType, platform, scheduledAt, status, publishedAt, errorMessage, productionNotes, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'DRAFT', NULL, NULL, ?, ?, ?)`,
      args: [
        storyId,
        client.id,
        `Stories — ${item.topic}`,
        item.linkedStories.map((f) => f.onScreenText).join(" → "),
        `https://picsum.photos/seed/tulaser-oct-story-${storyId}/600/600`,
        "IMAGE",
        "INSTAGRAM",
        scheduledAt,
        JSON.stringify(storyNotes),
        nowIso,
        nowIso,
      ],
    });

    feedCreated++;
  }

  let storiesCreated = 0;
  for (const day of STANDALONE_STORY_DAYS) {
    const storyId = randomUUID();
    const scheduledAt = new Date(`${day.date}T19:00:00`).toISOString();
    const productionNotes = {
      format: "STORY",
      concept: day.topic,
      approval: "Pendiente",
      steps: day.frames,
      source: SOURCE_TAG,
    };
    await db.execute({
      sql: `INSERT INTO content_items
        (id, clientId, title, caption, mediaUrl, mediaType, platform, scheduledAt, status, publishedAt, errorMessage, productionNotes, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'DRAFT', NULL, NULL, ?, ?, ?)`,
      args: [
        storyId,
        client.id,
        `Stories — ${day.topic}`,
        day.frames.map((f) => f.onScreenText).join(" → "),
        `https://picsum.photos/seed/tulaser-oct-story-${storyId}/600/600`,
        "IMAGE",
        "INSTAGRAM",
        scheduledAt,
        JSON.stringify(productionNotes),
        nowIso,
        nowIso,
      ],
    });
    storiesCreated++;
  }

  await db.execute({
    sql: `UPDATE clients SET lastPlanGeneratedAt = ?, updatedAt = ? WHERE id = ?`,
    args: [nowIso, nowIso, client.id],
  });

  console.log(`✓ ${feedCreated} publicaciones de feed creadas (Calendario + Plan de contenido IA).`);
  console.log(`✓ ${feedCreated} historias enlazadas a esas publicaciones + ${storiesCreated} historias independientes = ${feedCreated + storiesCreated} historias en total (pestaña "Historias").`);
  console.log(`✓ Ya debería verse todo en Nexalya para ${client.name}, del 1 al 15 de octubre.`);
}

main().catch((err) => {
  console.error("✗ ERROR:", err);
  process.exit(1);
});
