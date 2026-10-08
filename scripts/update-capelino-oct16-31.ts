// Actualiza el calendario de Capelino del 16 al 31 oct. 2026 con las ideas
// nuevas sacadas del benchmark de marcas de spritz (Ghia, Spritz Society,
// Ramona, Select, Amara Brava…): cara fija de marca, co-creación real
// (la audiencia decide algo que se produce), el 0,0 como palanca,
// colaboración con bar (Collab) + "dónde tomarlo", keyword por DM y
// stickers "Añade la tuya" para UGC.
//
// 5 piezas de feed (Reels, mar./vie.) + 1 story de apoyo por pieza +
// 11 stories de los días sin feed.
//
// Es SEGURO de ejecutar más de una vez: solo toca contenido de Capelino
// entre el 16 y el 31 oct., NUNCA borra nada marcado como "Publicado"
// (si choca con una fecha nueva, no inserta ese día y avisa), y sustituye
// plan_items/content_items previos del rango por los nuevos.
//
// Uso:  npx tsx --env-file=.env.local scripts/update-capelino-oct16-31.ts

import { createClient } from "@libsql/client";
import { randomUUID } from "node:crypto";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;
if (!url) throw new Error("Falta TURSO_DATABASE_URL en .env.local");
const db = createClient({ url, authToken });

const RANGE_START = "2026-10-16";
const RANGE_END = "2026-11-01"; // exclusivo

const ADULTOS =
  "Todas las personas con aspecto claramente mayor de 25 años. Consumo moderado, sin rondas ni cantidades. No vincular Capelino a éxito social, rendimiento ni a 'desconectar del estrés'.";

type Step = {
  label: string;
  function: string | null;
  action: string | null;
  onScreenText: string | null;
  voiceover?: string | null;
  interaction?: string | null;
  notes: string | null;
};

type Feed = {
  key: string;
  date: string;
  day: string;
  hour: string; // HH:MM:SS+TZ
  family: string;
  title: string;
  caption: string;
  objective: string;
  kpi: string;
  keyword: string | null;
  whoAppears: string;
  materials: string;
  validate: string;
  editing: string;
  cta: string;
  steps: Step[];
  story: { hour: string; steps: Step[] };
};

type Story = {
  date: string;
  day: string;
  hour: string;
  pillar: string;
  title: string;
  caption: string;
  objective: string;
  kpi: string;
  validate: string;
  steps: Step[];
};

const FEED: Feed[] = [
  {
    key: "R07",
    date: "2026-10-16",
    day: "Viernes",
    hour: "14:30:00+02:00",
    family: "The Capelino Test",
    title: "¿CUÁL DE LOS DOS LLEVA ALCOHOL?",
    caption:
      "Una lleva alcohol. La otra no. Y sabemos que vas a fallar. 🍊\n\nComenta A o B: mañana lo desvelamos en stories.\n\nSí, Capelino también existe en 0,0.\n#CapelinoSpritz",
    objective: "Captación + comentarios",
    kpi: "Comentarios + % no seguidores",
    keyword: "A / B",
    whoAppears: "2 adultos (uno es la cara fija de Capelino)",
    materials: "Capelino clásico + Capelino 0,0, 2 copas iguales, terraza o mesa con luz de tarde · Equipo: móvil en trípode, plano fijo",
    validate: `Confirmar formato de Capelino sin alcohol disponible. Las dos copas tienen que ser idénticas (nada de pistas). ${ADULTOS}`,
    editing: "Test: juego de adivinar + 0,0 vs contenido pasivo",
    cta: "«Comenta A o B. Mañana lo desvelamos.»",
    steps: [
      { label: "0,0–1,0 s", function: "Hook juego", action: "Dos manos cogen a la vez dos copas Capelino idénticas.", onScreenText: "UNA LLEVA ALCOHOL.\nLA OTRA NO.", notes: "Cámara: plano cenital/frontal fijo · Audio: hielo + tick · Checklist: naranja desde el frame 0" },
      { label: "1,0–4,0 s", function: "Tensión", action: "Brindis y primer sorbo; plano corto a cada cara, gesto neutro.", onScreenText: "¿CUÁL ES LA 0,0?", notes: "Cámara: 2 planos cortos · Checklist: nadie da pistas con la cara" },
      { label: "4,0–6,0 s", function: "Participación", action: "Plano fijo de las dos copas con A y B encima.", onScreenText: "COMENTA A O B.", notes: "Edición: letras grandes, 2 s de pausa para pensar" },
      { label: "6,0–7,0 s", function: "Cierre + loop", action: "Botella Capelino y Capelino 0,0 juntas.", onScreenText: "LA RESPUESTA, MAÑANA EN STORIES.", notes: "Edición: corte limpio para que el loop vuelva al hook" },
    ],
    story: {
      hour: "14:30 + 20:00",
      steps: [
        { label: "Frame 1", function: "Apoyo R07", action: null, onScreenText: "Foto de las dos copas: «HOY ES DIFÍCIL.»", interaction: null, notes: null },
        { label: "Frame 2", function: null, action: null, onScreenText: "Repost R07.", interaction: null, notes: null },
        { label: "Frame 3", function: null, action: null, onScreenText: "«¿A O B?»", interaction: "Encuesta: A / B", notes: "Guardar % para el reveal del sábado." },
      ],
    },
  },
  {
    key: "R08",
    date: "2026-10-20",
    day: "Martes",
    hour: "20:30:00+02:00",
    family: "Capelino World",
    title: "VOSOTROS DECIDÍS: EL VASO CAPELINO",
    caption:
      "Tenemos tres diseños y cero ganas de decidir solos. 🍊\n\nComenta A, B o C. El que gane, existe.\n\nVotación abierta hasta el lunes 26.\n#CapelinoSpritz",
    objective: "Co-creación + seguidores",
    kpi: "Comentarios + seguidores nuevos",
    keyword: "A / B / C",
    whoAppears: "Cara fija de Capelino",
    materials: "3 diseños de vaso (o posavasos/tote) impresos o en mockup, mesa naranja · Equipo: móvil, LED, trípode",
    validate: `VALIDAR CON CLIENTE: el diseño ganador se produce de verdad (vaso, posavasos o tote). Si se sortea, bases legales y solo mayores de 18. Plan B si no hay merch: votar el nombre del primer tardeo Capelino. ${ADULTOS}`,
    editing: "Test: co-creación con consecuencia real vs encuesta sin consecuencia",
    cta: "«Comenta A, B o C. El que gane, existe.»",
    steps: [
      { label: "0,0–1,0 s", function: "Hook", action: "La cara fija deja los 3 diseños sobre la mesa de golpe.", onScreenText: "ESTO LO DECIDES TÚ.", notes: "Cámara: plano medio frontal · Audio: golpe seco" },
      { label: "1,0–5,0 s", function: "Opciones", action: "1 s por diseño, primer plano.", onScreenText: "A: RETRO 70s\nB: TARDEO MINIMAL\nC: NARANJA SIN FRENOS", notes: "Edición: corte al ritmo · Checklist: los tres igual de bonitos" },
      { label: "5,0–7,0 s", function: "Promesa", action: "Cara fija a cámara.", onScreenText: "COMENTA A, B O C.", voiceover: "«El que más votos tenga, lo hacemos de verdad.»", notes: "Audio: voz directa, sin música encima" },
      { label: "7,0–8,0 s", function: "Urgencia", action: "Los 3 diseños con un Capelino en medio.", onScreenText: "VOTACIÓN ABIERTA HASTA EL LUNES 26.", notes: null },
    ],
    story: {
      hour: "20:30 + 22:00",
      steps: [
        { label: "Frame 1", function: "Apoyo R08", action: null, onScreenText: "«HOY MANDÁIS VOSOTROS.»", interaction: null, notes: null },
        { label: "Frame 2", function: null, action: null, onScreenText: "Repost R08 + «Se vota en comentarios.»", interaction: null, notes: null },
        { label: "Frame 3", function: null, action: null, onScreenText: "Diseño C a pantalla completa: «¿Y ESTE QUÉ?»", interaction: "Emoji slider 🍊", notes: "Medir si el diseño arriesgado gusta." },
      ],
    },
  },
  {
    key: "R09",
    date: "2026-10-23",
    day: "Viernes",
    hour: "14:30:00+02:00",
    family: "Capelino Moment",
    title: "DÓNDE TOMARTE UN CAPELINO — PARTE 1 (COLLAB CON BAR)",
    caption:
      "Dónde tomarte un Capelino, parte 1: @[bar] 🍊\n\n¿Qué sitio tiene que salir en la parte 2? Te leemos.\n\nEscríbenos DÓNDE por privado y te pasamos la lista.\n#CapelinoSpritz",
    objective: "Captación vía Collab + punto de venta",
    kpi: "Alcance no seguidores + follows desde Collab (separar del orgánico)",
    keyword: "DÓNDE (DM)",
    whoAppears: "Cara fija + camarero/a del bar (+ clientes adultos con permiso)",
    materials: "Bar que venda Capelino, terraza a golden hour, barra · Equipo: móvil, gimbal",
    validate: `Publicar con la función Collab de Instagram junto al bar (el bar acepta la invitación). Permiso de imagen de quien salga. Responder a cada DM «DÓNDE» con la lista de sitios (manual o con automatización). ${ADULTOS}`,
    editing: "Test: Collab con punto de venta vs Reel propio",
    cta: "«¿Qué sitio va en la parte 2? Escríbenos DÓNDE por DM.»",
    steps: [
      { label: "0,0–1,0 s", function: "Hook", action: "Mano del camarero/a sirve Capelino en barra: hielo + chorro naranja.", onScreenText: "DÓNDE TOMARTE UN CAPELINO EN [CIUDAD]: PARTE 1", notes: "Cámara: macro lateral · Audio: sonido real de barra" },
      { label: "1,0–4,0 s", function: "Lugar", action: "3 planos de 1 s: fachada, terraza con luz de tarde, la cara fija pidiendo en barra.", onScreenText: null, notes: "Edición: cortes en golpe de música" },
      { label: "4,0–7,0 s", function: "Por qué este sitio", action: "Cara fija y camarero/a brindan.", onScreenText: "@[BAR] · [BARRIO]\n«La terraza con mejor luz de las 19:00»", notes: "Checklist: nombre del bar legible 2 s" },
      { label: "7,0–8,0 s", function: "Serie + CTA", action: "Copa sobre la mesa al atardecer.", onScreenText: "¿QUÉ BAR VA EN LA PARTE 2?", notes: "Promete serie → motivo para seguir la cuenta" },
    ],
    story: {
      hour: "14:30 + 19:30",
      steps: [
        { label: "Frame 1", function: "Apoyo R09", action: null, onScreenText: "Foto de la terraza del bar.", interaction: "Sticker de ubicación + mención al bar", notes: null },
        { label: "Frame 2", function: null, action: null, onScreenText: "Repost R09.", interaction: null, notes: null },
        { label: "Frame 3", function: null, action: null, onScreenText: "«¿SIGUIENTE PARADA?»", interaction: "Pregunta", notes: "Guardar en destacado nuevo «DÓNDE TOMARLO»." },
      ],
    },
  },
  {
    key: "R10",
    date: "2026-10-27",
    day: "Martes",
    hour: "20:30:00+01:00",
    family: "The Capelino Test",
    title: "TIER LIST DEL TARDEO DE OTOÑO",
    caption:
      "Tier list del tardeo de otoño, sin piedad. 🍊\n\n¿Qué cambiarías de sitio? Te leemos en comentarios.\n#CapelinoSpritz",
    objective: "Comentarios + compartidos",
    kpi: "Comentarios + compartidos + follows / 1.000 espectadores",
    keyword: null,
    whoAppears: "Cara fija de Capelino",
    materials: "Pizarra o cartulinas naranjas S/A/B/C + 6 tarjetas, Capelino en la mesa · Equipo: móvil, trípode",
    validate: `Opiniones con humor, sin hablar de cantidades de bebida. ${ADULTOS}`,
    editing: "Test: ranking/opinión con cara fija vs juego visual sin persona",
    cta: "«¿Qué cambiarías de sitio?»",
    steps: [
      { label: "0,0–1,0 s", function: "Hook opinión", action: "La cara fija clava la primera tarjeta en la S con decisión.", onScreenText: "TIER LIST DEL TARDEO DE OTOÑO. SIN PIEDAD.", notes: "Cámara: plano medio, tier list visible entera" },
      { label: "1,0–6,0 s", function: "Ranking", action: "6 tarjetas, ~0,8 s cada una.", onScreenText: "S: Mesa al sol en octubre\nS: Terraza con mantita\nA: Tardeo que acaba en cena\nA: Vermut de domingo\nC: El plan que se cancela a las 18:59\nC: Quedar «a las 7» y llegar a las 8", notes: "Edición: sonido de 'clac' en cada tarjeta" },
      { label: "6,0–7,0 s", function: "Polémica", action: "Se queda con una tarjeta en la mano, duda.", onScreenText: "¿Y EL TARDEO EN CASA?", notes: "Deja la pregunta abierta → comentarios" },
      { label: "7,0–8,0 s", function: "Cierre", action: "Capelino colocado en la S.", onScreenText: "COMENTA TU TIER.", notes: null },
    ],
    story: {
      hour: "20:30 + 22:00",
      steps: [
        { label: "Frame 1", function: "Apoyo R10", action: null, onScreenText: "«HOY HAY POLÉMICA.»", interaction: null, notes: null },
        { label: "Frame 2", function: null, action: null, onScreenText: "Repost R10.", interaction: null, notes: null },
        { label: "Frame 3", function: null, action: null, onScreenText: "«¿MESA AL SOL EN S?»", interaction: "Encuesta: Justísimo / Robo", notes: null },
      ],
    },
  },
  {
    key: "R11",
    date: "2026-10-30",
    day: "Viernes",
    hour: "14:30:00+01:00",
    family: "Capelino World",
    title: "COSAS QUE DAN MÁS MIEDO QUE HALLOWEEN",
    caption:
      "Cosas que dan más miedo que Halloween. 🎃🍊\n\n¿Cuál es la peor? Comenta un número.\n#CapelinoSpritz",
    objective: "Captación + identificación",
    kpi: "Compartidos + comentarios",
    keyword: "1 / 2 / 3 / 4",
    whoAppears: "Cara fija de Capelino (+1 adulto)",
    materials: "Salón retro con luz naranja de noche, disfraz mínimo, Capelino y Capelino 0,0 · Equipo: móvil, LED naranja",
    validate: `Humor de situaciones, nunca beber para superar nada. ${ADULTOS}`,
    editing: "Test: humor de identificación + estética Capelino World",
    cta: "«¿Cuál es la peor? Comenta un número.»",
    steps: [
      { label: "0,0–1,0 s", function: "Hook", action: "Luz naranja parpadea; la cara fija mira a cámara, asustada.", onScreenText: "COSAS QUE DAN MÁS MIEDO QUE HALLOWEEN:", notes: "Audio: sintetizador de peli retro" },
      { label: "1,0–6,0 s", function: "Lista", action: "4 escenas actuadas de 1,2 s.", onScreenText: "1. Que el grupo diga «ya veremos»\n2. Que te toque la terraza a la sombra\n3. Quedarse sin hielo\n4. Que llegue noviembre y no hayas probado el 0,0", notes: "Edición: número grande en cada escena" },
      { label: "6,0–8,0 s", function: "Marca", action: "Capelino iluminado desde abajo como objeto de peli de miedo retro.", onScreenText: "CAPELINO AFTER DARK.", notes: null },
    ],
    story: {
      hour: "14:30 + 20:30",
      steps: [
        { label: "Frame 1", function: "Apoyo R11", action: null, onScreenText: "Pantalla casi negra con brillo naranja: «AFTER DARK.»", interaction: null, notes: null },
        { label: "Frame 2", function: null, action: null, onScreenText: "Repost R11.", interaction: null, notes: null },
        { label: "Frame 3", function: null, action: null, onScreenText: "«¿CUÁL DA MÁS MIEDO?»", interaction: "Quiz: 1 / 2 / 3 / 4", notes: null },
      ],
    },
  },
];

const STORIES: Story[] = [
  {
    date: "2026-10-17", day: "Sábado", hour: "20:30:00+02:00", pillar: "COMUNIDAD / RESEARCH",
    title: "Reveal: ¿cuál era la 0,0?",
    caption: "«ERA LA [A/B].» + % de acierto en comentarios → «¿CUÁNDO ELIGES 0,0?»",
    objective: "Cerrar loop + research", kpi: "Respuestas pregunta",
    validate: "Usar las respuestas para futuros Reels del 0,0.",
    steps: [
      { label: "Frame 1", function: "Reveal", action: null, onScreenText: "«ERA LA [A/B].» + «Solo acertó el X % 👀»", interaction: null, notes: null },
      { label: "Frame 2", function: null, action: null, onScreenText: "«¿CUÁNDO ELIGES 0,0?»", interaction: "Pregunta", notes: null },
    ],
  },
  {
    date: "2026-10-18", day: "Domingo", hour: "19:30:00+02:00", pillar: "CARA DE MARCA",
    title: "Os presento a [nombre]",
    caption: "Selfie vídeo de la cara fija: «HOLA. A PARTIR DE AHORA ME VAIS A VER POR AQUÍ.» → «PREGÚNTAME LO QUE QUIERAS.»",
    objective: "Humanizar", kpi: "Respuestas + respuestas por DM",
    validate: "Elegir UNA persona fija (equipo o microcreador local) con cesión de imagen firmada y aspecto claramente +25.",
    steps: [
      { label: "Frame 1", function: "Presentación", action: "Selfie vídeo con luz de tarde, 5–8 s, tono natural.", onScreenText: "«HOLA. A PARTIR DE AHORA ME VAIS A VER POR AQUÍ.»", interaction: null, notes: null },
      { label: "Frame 2", function: null, action: null, onScreenText: "«PREGÚNTAME LO QUE QUIERAS (SOBRE CAPELINO).»", interaction: "Pregunta", notes: "Contestar las mejores en stories durante la semana." },
    ],
  },
  {
    date: "2026-10-19", day: "Lunes", hour: "20:30:00+02:00", pillar: "CO-CREACIÓN",
    title: "Teaser votación",
    caption: "Tres diseños desenfocados: «MAÑANA DECIDÍS VOSOTROS.»",
    objective: "Precalentar R08", kpi: "Recordatorios cuenta atrás",
    validate: "Imagen distinta a la del Reel.",
    steps: [
      { label: "Frame 1", function: "Teaser", action: null, onScreenText: "3 diseños desenfocados: «MAÑANA DECIDÍS VOSOTROS.»", interaction: "Cuenta atrás", notes: null },
    ],
  },
  {
    date: "2026-10-21", day: "Miércoles", hour: "20:30:00+02:00", pillar: "COMUNIDAD",
    title: "Recuento parcial",
    caption: "Marcador A/B/C con el % de comentarios hasta ahora + repost de 3 comentarios graciosos.",
    objective: "Empujar votación", kpi: "Taps hacia el Reel",
    validate: "Contar solo comentarios reales.",
    steps: [
      { label: "Frame 1", function: "Marcador", action: null, onScreenText: "«RECUENTO PARCIAL: A X % · B X % · C X %»", interaction: null, notes: null },
      { label: "Frame 2", function: null, action: null, onScreenText: "Captura de 3 comentarios + «Aún podéis darle la vuelta.»", interaction: "Sin sticker", notes: null },
    ],
  },
  {
    date: "2026-10-22", day: "Jueves", hour: "19:30:00+02:00", pillar: "DÓNDE TOMARLO",
    title: "¿Dónde te has tomado un Capelino?",
    caption: "Foto del producto en una barra: «¿DÓNDE HAS TOMADO CAPELINO?» → «MAÑANA OS PRESENTAMOS UNO.»",
    objective: "Recoger puntos de venta", kpi: "Respuestas pregunta",
    validate: "Las respuestas alimentan el destacado «DÓNDE TOMARLO» y la parte 2 del Collab.",
    steps: [
      { label: "Frame 1", function: "Pregunta", action: null, onScreenText: "«¿DÓNDE HAS TOMADO CAPELINO?»", interaction: "Pregunta", notes: null },
      { label: "Frame 2", function: null, action: null, onScreenText: "«MAÑANA OS PRESENTAMOS UNO.»", interaction: null, notes: null },
    ],
  },
  {
    date: "2026-10-24", day: "Sábado", hour: "20:30:00+02:00", pillar: "UGC",
    title: "Capelino spotted — Añade la tuya",
    caption: "Repost de menciones (bar del Collab / respuestas del jueves) + sticker «Añade la tuya: tu tardeo de hoy 🍊».",
    objective: "Generar UGC", kpi: "Participaciones «Añade la tuya»",
    validate: "Si no hay menciones, foto propia casual con «CAPELINO SPOTTED.»",
    steps: [
      { label: "Frame 1", function: "Spotted", action: null, onScreenText: "Repost de mención o foto casual: «CAPELINO SPOTTED.»", interaction: "Mención", notes: null },
      { label: "Frame 2", function: null, action: null, onScreenText: "«TU TARDEO DE HOY 🍊»", interaction: "Añade la tuya", notes: null },
    ],
  },
  {
    date: "2026-10-25", day: "Domingo", hour: "19:30:00+01:00", pillar: "RITUAL",
    title: "Perfect serve en 3 pasos",
    caption: "Vídeo de 4 s: hielo → Capelino → rodaja de naranja. Quiz: «¿QUÉ VA PRIMERO?»",
    objective: "Retención + aprendizaje", kpi: "Respuestas quiz + replays",
    validate: "Servir una sola copa; sirve igual para el 0,0.",
    steps: [
      { label: "Frame 1", function: "Ritual", action: "Clip 4 s en loop, macro.", onScreenText: "«EL CAPELINO PERFECTO, EN 3 PASOS.»", interaction: null, notes: null },
      { label: "Frame 2", function: null, action: null, onScreenText: "«¿QUÉ VA PRIMERO?»", interaction: "Quiz: Hielo / Capelino / Naranja", notes: null },
    ],
  },
  {
    date: "2026-10-26", day: "Lunes", hour: "20:30:00+01:00", pillar: "CO-CREACIÓN",
    title: "Última llamada para votar",
    caption: "Marcador A/B/C apretado: «QUEDAN HORAS.» + repost R08.",
    objective: "Último empujón a R08", kpi: "Taps hacia el Reel",
    validate: "Cerrar votación a las 23:59.",
    steps: [
      { label: "Frame 1", function: "Urgencia", action: null, onScreenText: "«QUEDAN HORAS. A X % · B X % · C X %»", interaction: "Cuenta atrás (23:59)", notes: null },
      { label: "Frame 2", function: null, action: null, onScreenText: "Repost R08.", interaction: null, notes: null },
    ],
  },
  {
    date: "2026-10-28", day: "Miércoles", hour: "20:30:00+01:00", pillar: "CO-CREACIÓN",
    title: "Ha ganado el diseño…",
    caption: "Reveal del ganador con % final → «LO HACEMOS DE VERDAD. OS ENSEÑAMOS EL PROCESO.»",
    objective: "Cumplir la promesa", kpi: "Reacciones slider",
    validate: "Anunciar solo si el cliente ha confirmado la producción.",
    steps: [
      { label: "Frame 1", function: "Ganador", action: null, onScreenText: "«HA GANADO EL [A/B/C] CON UN X %.»", interaction: null, notes: null },
      { label: "Frame 2", function: null, action: null, onScreenText: "«LO HACEMOS DE VERDAD. OS ENSEÑAMOS EL PROCESO.»", interaction: "Emoji slider 🍊", notes: "Abrir destacado «VOSOTROS DECIDÍS»." },
    ],
  },
  {
    date: "2026-10-29", day: "Jueves", hour: "19:30:00+01:00", pillar: "BTS / CARA DE MARCA",
    title: "BTS rodaje After Dark",
    caption: "La cara fija entre luces naranjas del rodaje: «MAÑANA SE PONE RARO.»",
    objective: "Precalentar R11", kpi: "Recordatorios cuenta atrás",
    validate: "No enseñar ninguna de las 4 escenas del Reel.",
    steps: [
      { label: "Frame 1", function: "Detrás de cámaras", action: "Clip 5 s del set con luz naranja.", onScreenText: "«MAÑANA SE PONE RARO.»", interaction: "Cuenta atrás", notes: null },
    ],
  },
  {
    date: "2026-10-31", day: "Sábado", hour: "20:30:00+01:00", pillar: "UGC",
    title: "Halloween — Tu Capelino After Dark",
    caption: "Bodegón naranja oscuro con producto + sticker «Añade la tuya: tu Capelino After Dark 🎃».",
    objective: "UGC + cierre de mes", kpi: "Participaciones «Añade la tuya»",
    validate: "Disfraces y escenas de adultos; nada infantil.",
    steps: [
      { label: "Frame 1", function: "Halloween", action: null, onScreenText: "Bodegón: «CAPELINO AFTER DARK.»", interaction: null, notes: null },
      { label: "Frame 2", function: null, action: null, onScreenText: "«TU CAPELINO AFTER DARK 🎃»", interaction: "Añade la tuya", notes: null },
    ],
  },
];

function iso(date: string, hour: string) {
  return new Date(`${date}T${hour}`).toISOString();
}

async function main() {
  const clientRs = await db.execute({ sql: `SELECT id FROM clients WHERE name = ?`, args: ["Capelino"] });
  const client = clientRs.rows[0] as unknown as { id: string } | undefined;
  if (!client) {
    console.error('✗ No existe ningún cliente llamado "Capelino".');
    process.exit(1);
  }
  const clientId = client.id;

  // ---- content_items: no tocar lo ya publicado ----
  const existingRs = await db.execute({
    sql: `SELECT id, title, scheduledAt, status FROM content_items WHERE clientId = ? AND scheduledAt >= ? AND scheduledAt < ?`,
    args: [clientId, RANGE_START, RANGE_END],
  });
  const existing = existingRs.rows as unknown as { id: string; title: string; scheduledAt: string; status: string }[];
  const published = existing.filter((r) => r.status === "PUBLISHED");
  const replaceable = existing.filter((r) => r.status !== "PUBLISHED");
  if (published.length > 0) {
    console.log(`⚠ ${published.length} pieza(s) ya publicadas en el rango — se dejan intactas:`);
    for (const r of published) console.log(`   - ${r.scheduledAt} · ${r.title}`);
  }
  for (const r of replaceable) {
    await db.execute({ sql: `DELETE FROM content_items WHERE id = ?`, args: [r.id] });
  }
  console.log(`✓ Borradas ${replaceable.length} pieza(s) antiguas del calendario (16–31 oct.).`);
  const publishedDates = new Set(published.map((r) => r.scheduledAt.slice(0, 10)));

  const insert = async (title: string, caption: string, mediaType: string, scheduledAt: string, notes: object, seed: string) => {
    const id = randomUUID();
    const ts = new Date().toISOString();
    await db.execute({
      sql: `INSERT INTO content_items
        (id, clientId, title, caption, mediaUrl, mediaType, platform, scheduledAt, status, publishedAt, errorMessage, productionNotes, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, NULL, ?, ?, ?)`,
      args: [id, clientId, title, caption, `https://picsum.photos/seed/${seed}/600/600`, mediaType, "INSTAGRAM", scheduledAt, "DRAFT", JSON.stringify(notes), ts, ts],
    });
    return id;
  };

  let inserted = 0;
  for (const f of FEED) {
    if (publishedDates.has(f.date)) {
      console.log(`⚠ Se omite ${f.key} (${f.date}): ya hay algo publicado ese día.`);
      continue;
    }
    const at = iso(f.date, f.hour);
    const feedId = await insert(f.title, f.caption, "VIDEO", at, {
      format: "REEL", concept: f.title, family: f.family, whoAppears: f.whoAppears, materials: f.materials,
      validateBeforePublish: f.validate, editing: f.editing, kpi: f.kpi, cta: f.cta, approval: "Pendiente",
      steps: f.steps.map((s) => ({ voiceover: null, ...s })),
    }, `capelino-oct-${f.key}`);
    await insert(`Apoyo ${f.key}`, f.story.steps.map((s) => s.onScreenText).join(" → "), "IMAGE", at, {
      format: "STORY", concept: `Apoyo ${f.key}`, kpi: f.kpi, approval: "Pendiente",
      steps: f.story.steps.map((s, i) => (i === f.story.steps.length - 1 ? { ...s, notes: `Hora: ${f.story.hour}. ${s.notes ?? ""}`.trim() } : s)),
      sourceItemId: feedId,
    }, `capelino-oct-${f.key}-story`);
    inserted += 2;
  }
  for (const s of STORIES) {
    if (publishedDates.has(s.date)) {
      console.log(`⚠ Se omite la story del ${s.date}: ya hay algo publicado ese día.`);
      continue;
    }
    await insert(s.title, s.caption, "IMAGE", iso(s.date, s.hour), {
      format: "STORY", concept: s.title, pillar: s.pillar, validateBeforePublish: s.validate, kpi: s.kpi, approval: "Pendiente",
      steps: s.steps,
    }, `capelino-story-${s.date}`);
    inserted++;
  }
  console.log(`✓ Insertadas ${inserted} piezas nuevas (feed + stories).`);

  // ---- plan_items: sustituir el rango completo ----
  const del = await db.execute({
    sql: `DELETE FROM plan_items WHERE clientId = ? AND date >= ? AND date < ?`,
    args: [clientId, RANGE_START, RANGE_END],
  });
  console.log(`✓ Borrados ${del.rowsAffected} elemento(s) antiguos del plan en este rango.`);

  const batchId = randomUUID();
  await db.execute({
    sql: `INSERT INTO plan_batches (id, clientId, periodDays, trendsSummary, model, createdAt) VALUES (?, ?, ?, ?, ?, ?)`,
    args: [
      batchId, clientId, 16,
      "Plan 16–31 oct. 2026 rehecho a partir del benchmark internacional de spritz (Ghia, Spritz Society, Ramona, Select, Amara Brava): cara fija de marca, co-creación con consecuencia real, 0,0 como palanca, Collab con bar + «dónde tomarlo», keyword por DM y «Añade la tuya» para UGC.",
      null, new Date().toISOString(),
    ],
  });

  const planRows = [
    ...FEED.map((f) => ({
      date: f.date, day: f.day, format: "Reel", family: f.family, topic: f.title, objective: f.objective,
      kpi: f.kpi, keyword: f.keyword, notes: f.validate,
    })),
    ...STORIES.map((s) => ({
      date: s.date, day: s.day, format: "Stories", family: s.pillar, topic: s.title, objective: s.objective,
      kpi: s.kpi, keyword: null, notes: s.validate,
    })),
  ].sort((a, b) => a.date.localeCompare(b.date));

  for (const p of planRows) {
    const ts = new Date().toISOString();
    await db.execute({
      sql: `INSERT INTO plan_items (id, clientId, planBatchId, date, day, format, family, topic, objective, kpi, keyword, notes, status, contentItemId, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, ?, ?)`,
      args: [randomUUID(), clientId, batchId, p.date, p.day, p.format, p.family, p.topic, p.objective, p.kpi, p.keyword, p.notes, "IDEA", ts, ts],
    });
  }
  console.log(`✓ Insertados ${planRows.length} elementos en "Plan de contenido".`);
  console.log("\nListo. Revisa el calendario de Capelino en Nexalya.");
}

main().catch((err) => {
  console.error("✗ ERROR:", err);
  process.exit(1);
});
