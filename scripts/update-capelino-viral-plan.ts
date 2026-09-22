// Actualiza el calendario de Capelino (21 sept.–20 oct. 2026) con la nueva
// versión "más viralidad" que ha preparado el equipo (Excel
// Capelino_Calendario_30_dias_VIRAL_21Sep_20Oct_2026.xlsx): 9 piezas de feed
// (6 Reels + 2 carruseles + 1 post, cada una con su plano a plano / slide a
// slide, hook adaptado y copy) + 30 historias diarias de apoyo/research.
//
// Las 9 piezas de feed llevan aquí también su propia story de apoyo del
// mismo día (dentro de "productionNotes.stories"); el resto de historias
// (los otros 21 días sin publicación) se crean con
// scripts/add-capelino-stories.ts. El texto de esas stories de apoyo se
// actualizó con la revisión "STORIES_VARIADAS" del Excel (Excel
// Capelino_Calendario_30_dias_VIRAL_STORIES_VARIADAS_21Sep_20Oct_2026.xlsx):
// antes cada pieza de feed llevaba dos stories de apoyo (una antes y otra
// después de publicar); ahora es una sola story de apoyo, con texto e
// interacción reescritos para no repetir siempre el mismo patrón de
// encuesta. Las 9 piezas de feed en sí (guion, copy, hook) no han
// cambiado.
//
// Es SEGURO de ejecutar más de una vez: solo toca contenido de Capelino
// dentro de esta ventana de fechas, NUNCA borra una pieza ya marcada como
// "Publicado" (las deja tal cual y avisa por consola si choca con alguna
// fecha nueva), y sustituye plan_items/content_items previos de este rango
// por los nuevos.
//
// Uso:  npx tsx --env-file=.env.local scripts/update-capelino-viral-plan.ts

import { createClient } from "@libsql/client";
import { randomUUID } from "node:crypto";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;
if (!url) throw new Error("Falta TURSO_DATABASE_URL en .env.local");
const db = createClient({ url, authToken });

const RANGE_START = "2026-09-21T00:00:00";
const RANGE_END = "2026-10-21T00:00:00"; // exclusivo
const RANGE_START_DATE = "2026-09-21";
const RANGE_END_DATE = "2026-10-21"; // exclusivo

type NewContentItem = {
  idfeed: string;
  title: string;
  caption: string;
  mediaType: string;
  date: string;
  hour: string;
  scheduledAt: string;
  productionNotesJson: string;
};

type NewPlanItem = {
  date: string;
  day: string | null;
  format: string | null;
  family: string | null;
  topic: string | null;
  objective: string | null;
  kpi: string | null;
  keyword: string | null;
  notes: string | null;
};

const NEW_CONTENT: NewContentItem[] = [
  {
    "idfeed": "R01",
    "title": "NEVERA POSTAPOCALÍPTICA",
    "caption": "Vale. Esto no estaba en el guion. 🍊\n\n¿Qué te hizo quedarte: el impacto o abrir la puerta?\n\n#CapelinoSpritz",
    "mediaType": "VIDEO",
    "date": "2026-09-22",
    "hour": "20:30:00+02:00",
    "scheduledAt": "2026-09-22T20:30:00+02:00",
    "productionNotesJson": "{\"format\": \"REEL\", \"concept\": \"NEVERA POSTAPOCALÍPTICA\", \"whoAppears\": \"0\", \"materials\": \"Vídeo postapocalíptico existente · Equipo: Premiere/CapCut\", \"validateBeforePublish\": \"Vídeo ya producido: añadir hook, revisar que el primer impacto ocurra antes de 1 s y exportar 9:16.\", \"editing\": \"Test: Impacto visual + curiosity gap\", \"kpi\": \"Retención + % no seguidores + compartidos\", \"cta\": null, \"approval\": \"Pendiente\", \"steps\": [{\"label\": \"0,0–1,0 s\", \"function\": \"WTF visual + parar scroll\", \"action\": \"Abrir directamente con la caída; no enseñar logo ni intro antes.\", \"onScreenText\": \"VALE, ESTO NO ESTABA EN EL GUION.\", \"voiceover\": null, \"notes\": \"Cámara: Plano general vertical; nevera grande y legible. · Audio: Impacto grave + viento · Edición: Corte directo desde frame 0 · Checklist: Movimiento ya activo en frame 1\"}, {\"label\": \"1,0–3,0 s\", \"function\": \"Aumentar tensión\", \"action\": \"Acelerar ligeramente el movimiento.\", \"onScreenText\": \"—\", \"voiceover\": null, \"notes\": \"Cámara: Seguimiento / zoom muy leve · Audio: Riser · Edición: Sin transición · Checklist: No meter más texto\"}, {\"label\": \"3,0–4,5 s\", \"function\": \"Curiosity gap\", \"action\": \"Golpe fuerte y pausa de 0,2 s.\", \"onScreenText\": \"ESPERA A QUE SE ABRA.\", \"voiceover\": null, \"notes\": \"Cámara: Plano medio / frontal · Audio: Impacto + silencio corto · Edición: Micro pausa · Checklist: Texto visible 1 s\"}, {\"label\": \"4,5–6,5 s\", \"function\": \"Recompensa\", \"action\": \"Abrir rápido y dejar hero visual.\", \"onScreenText\": \"—\", \"voiceover\": null, \"notes\": \"Cámara: Plano frontal / producto · Audio: Whoosh + brillo · Edición: Reveal limpio · Checklist: Botellas reconocibles\"}, {\"label\": \"6,5–7,5 s\", \"function\": \"Marca / recuerdo\", \"action\": \"Mantener 1 s.\", \"onScreenText\": \"VALE. AHORA SÍ.\", \"voiceover\": null, \"notes\": \"Cámara: Hero final · Audio: Hit final · Edición: Loop opcional · Checklist: No saturar CTA\"}], \"stories\": [{\"label\": \"Frame 1\", \"function\": \"Boletín de última hora\", \"action\": null, \"onScreenText\": \"Diseño tipo breaking news: «ÚLTIMA HORA: HA CAÍDO ALGO NARANJA.» + frame de humo/nevera.\", \"interaction\": null, \"notes\": null}, {\"label\": \"Frame 2\", \"function\": null, \"action\": null, \"onScreenText\": \"Repost del Reel con texto pequeño: «El resto está en el vídeo.»\", \"interaction\": \"Sin sticker\", \"notes\": \"Hora: 20:45. Apoyar el Reel sin repetir la misma encuesta del día anterior.\"}]}"
  },
  {
    "idfeed": "R02",
    "title": "OPINIÓN IMPPOPULAR: SEPTIEMBRE > AGOSTO",
    "caption": "Opinión impopular: septiembre tiene mejores tardes que agosto. 🍊\n\n¿Sí o no?\n\n#CapelinoSpritz",
    "mediaType": "VIDEO",
    "date": "2026-09-25",
    "hour": "14:30:00+02:00",
    "scheduledAt": "2026-09-25T14:30:00+02:00",
    "productionNotesJson": "{\"format\": \"REEL\", \"concept\": \"OPINIÓN IMPPOPULAR: SEPTIEMBRE > AGOSTO\", \"whoAppears\": \"2 adultos\", \"materials\": \"Producto, gafas, llaves, snacks, mesa · Equipo: Móvil/cámara, 2x/macro, micro ambiente\", \"validateBeforePublish\": \"Grabar golden hour real, versión POV y versión lateral; sacar 10 recursos extra.\", \"editing\": \"Test: Opinión estacional vs lifestyle neutro\", \"kpi\": \"Compartidos + comentarios + follows/1.000\", \"cta\": null, \"approval\": \"Pendiente\", \"steps\": [{\"label\": \"0,0–1,2 s\", \"function\": \"Parar por opinión\", \"action\": \"Movimiento natural.\", \"onScreenText\": \"OPINIÓN IMPPOPULAR:\", \"voiceover\": null, \"notes\": \"Cámara: POV / cámara en mano · Audio: Ambiente terraza · Edición: Corte seco · Checklist: Adultos claros\"}, {\"label\": \"1,2–2,5 s\", \"function\": \"Producto integrado\", \"action\": \"Otra mano coloca copa.\", \"onScreenText\": \"SEPTIEMBRE TIENE MEJORES TARDES…\", \"voiceover\": null, \"notes\": \"Cámara: POV cercano · Audio: Copa sobre mesa · Edición: Cut on action · Checklist: Copa legible\"}, {\"label\": \"2,5–4,0 s\", \"function\": \"Completar idea\", \"action\": \"Colocar un plato / naranja.\", \"onScreenText\": \"…QUE AGOSTO.\", \"voiceover\": null, \"notes\": \"Cámara: Cenital corto · Audio: Ambiente · Edición: Montaje rápido · Checklist: Texto grande\"}, {\"label\": \"4,0–6,0 s\", \"function\": \"Identificación\", \"action\": \"Nada de mirar a cámara.\", \"onScreenText\": \"—\", \"voiceover\": null, \"notes\": \"Cámara: Plano medio / 2x · Audio: Ambiente · Edición: B-roll · Checklist: Naturalidad\"}, {\"label\": \"6,0–8,5 s\", \"function\": \"Comentario / compartir\", \"action\": \"Acercamiento muy suave.\", \"onScreenText\": \"¿SÍ O NO?\", \"voiceover\": null, \"notes\": \"Cámara: Hero lifestyle · Audio: Beat final · Edición: Cierre · Checklist: Pregunta simple\"}], \"stories\": [{\"label\": \"Frame 1\", \"function\": \"Opinión impopular\", \"action\": null, \"onScreenText\": \"«OPINIÓN IMPPOPULAR: SEPTIEMBRE TIENE MEJORES TARDES QUE AGOSTO.»\", \"interaction\": null, \"notes\": null}, {\"label\": \"Frame 2\", \"function\": null, \"action\": null, \"onScreenText\": \"Foto de copa en terraza + «¿TE COMPRO LA TEORÍA?»\", \"interaction\": \"Encuesta: Sí / Ni de broma\", \"notes\": \"Hora: 17:30. Provocar posicionamiento y conversación alrededor del Reel.\"}]}"
  },
  {
    "idfeed": "R03",
    "title": "INTERRUPCIÓN CAPELINO #01 — PUERTA",
    "caption": "Yo abriría la puerta. Sin preguntas. 🍊\n\n¿Tú la abrirías?\n\n#CapelinoSpritz",
    "mediaType": "VIDEO",
    "date": "2026-09-29",
    "hour": "20:30:00+02:00",
    "scheduledAt": "2026-09-29T20:30:00+02:00",
    "productionNotesJson": "{\"format\": \"REEL\", \"concept\": \"INTERRUPCIÓN CAPELINO #01 — PUERTA\", \"whoAppears\": \"0–1 adulto\", \"materials\": \"Puerta, producto, objetos naranja, fondos, copa · Equipo: Trípode, LED, cámara/móvil, IA/composición\", \"validateBeforePublish\": \"Pomo, placa limpia, interior/IA, producto. Mantener sorpresa antes del segundo 1,2.\", \"editing\": \"Test: Reveal <1,2 s + mundo surreal\", \"kpi\": \"Compartidos + % no seguidores + comentarios\", \"cta\": null, \"approval\": \"Pendiente\", \"steps\": [{\"label\": \"0,0–0,8 s\", \"function\": \"Curiosidad inmediata\", \"action\": \"Girar desde frame 0.\", \"onScreenText\": \"¿SOY EL ÚNICO QUE ABRIRÍA ESTA PUERTA…\", \"voiceover\": null, \"notes\": \"Cámara: Primerísimo plano · Audio: Clic pomo · Edición: Sin intro · Checklist: Texto arriba\"}, {\"label\": \"0,8–1,3 s\", \"function\": \"Completar hook\", \"action\": \"Abrir rápido.\", \"onScreenText\": \"…SIN PREGUNTAR?\", \"voiceover\": null, \"notes\": \"Cámara: Plano fijo · Audio: Whoosh · Edición: Transición práctica · Checklist: Reveal ya visible\"}, {\"label\": \"1,3–3,6 s\", \"function\": \"Sorpresa\", \"action\": \"Entrar 5–10 cm con cámara.\", \"onScreenText\": \"—\", \"voiceover\": null, \"notes\": \"Cámara: Plano general vertical · Audio: Ambiente surreal · Edición: Composición integrada · Checklist: Perspectiva coherente\"}, {\"label\": \"3,6–5,5 s\", \"function\": \"Brand reveal\", \"action\": \"Micro paneo.\", \"onScreenText\": \"—\", \"voiceover\": null, \"notes\": \"Cámara: Plano medio · Audio: Burbujas / ambiente · Edición: Corte suave · Checklist: Producto natural\"}, {\"label\": \"5,5–7,0 s\", \"function\": \"Comentario\", \"action\": \"Freeze 0,3 s.\", \"onScreenText\": \"¿PUERTA EQUIVOCADA?\", \"voiceover\": null, \"notes\": \"Cámara: Plano general · Audio: Hit final · Edición: Cierre · Checklist: Texto grande\"}], \"stories\": [{\"label\": \"Frame 1\", \"function\": \"Capelino Interrupts\", \"action\": null, \"onScreenText\": \"Pantalla naranja con sello: «CAPELINO INTERRUPTS #01»\", \"interaction\": null, \"notes\": null}, {\"label\": \"Frame 2\", \"function\": null, \"action\": null, \"onScreenText\": \"Repost R03 + «Hoy la realidad vuelve a fallar.»\", \"interaction\": \"Sin sticker\", \"notes\": \"Hora: 21:00. Dar nombre de serie y reforzar reconocimiento.\"}]}"
  },
  {
    "idfeed": "C01",
    "title": "DICES «ME DA IGUAL» Y LUEGO ELIGES TODO",
    "caption": "Dices «me da igual» hasta que aparecen dos opciones. 🍊\n\nComenta solo tus 3 letras. Sin explicaciones.\n\n#CapelinoSpritz",
    "mediaType": "IMAGE",
    "date": "2026-10-02",
    "hour": "14:30:00+02:00",
    "scheduledAt": "2026-10-02T14:30:00+02:00",
    "productionNotesJson": "{\"format\": \"CARRUSEL\", \"concept\": \"DICES «ME DA IGUAL» Y LUEGO ELIGES TODO\", \"whoAppears\": \"0–1 adulto\", \"materials\": \"Puerta, producto, objetos naranja, fondos, copa · Equipo: Trípode, LED, cámara/móvil, IA/composición\", \"validateBeforePublish\": \"6 slides, fotos propias, titular grande, última slide con CTA de 3 letras.\", \"editing\": null, \"kpi\": \"Comentarios + guardados + visitas perfil\", \"cta\": \"«Comenta solo tus 3 letras. Sin explicaciones.»\", \"approval\": \"Pendiente\", \"steps\": [{\"label\": \"Slide 1\", \"function\": \"Hook\", \"action\": \"Producto + dos escenas A/B\", \"onScreenText\": \"TE LO DIGO CON CARIÑO:\\nDICES «ME DA IGUAL»\\nY LUEGO ELIGES TODO.\", \"voiceover\": null, \"notes\": \"Diseño: Fondo claro/naranja; titular enorme. · Interacción: Deslizar · CTA: — · Preparar: Foto hero + 2 mini escenas · Checklist: Se entiende sin leer copy\"}, {\"label\": \"Slide 2\", \"function\": \"Elección 1\", \"action\": \"Atardecer vs luces de noche\", \"onScreenText\": \"A: TARDE\\nB: NOCHE\", \"voiceover\": null, \"notes\": \"Diseño: Split 50/50. · Interacción: Elegir letra · CTA: — · Preparar: 2 fotos propias · Checklist: Ambas opciones atractivas\"}, {\"label\": \"Slide 3\", \"function\": \"Elección 2\", \"action\": \"Terraza vs interior\", \"onScreenText\": \"A: TERRAZA\\nB: INTERIOR\", \"voiceover\": null, \"notes\": \"Diseño: Split 50/50. · Interacción: Elegir letra · CTA: — · Preparar: 2 fotos propias · Checklist: Adultos / lifestyle\"}, {\"label\": \"Slide 4\", \"function\": \"Elección 3\", \"action\": \"Retro vs editorial\", \"onScreenText\": \"A: RETRO\\nB: EDITORIAL\", \"voiceover\": null, \"notes\": \"Diseño: Dos universos de marca. · Interacción: Elegir letra · CTA: — · Preparar: 2 creatividades · Checklist: Ambos reconocibles como Capelino\"}, {\"label\": \"Slide 5\", \"function\": \"Tensión\", \"action\": \"Tres huecos de letras\", \"onScreenText\": \"VALE. AHORA NO DIGAS «ME DA IGUAL».\", \"voiceover\": null, \"notes\": \"Diseño: Diseño gráfico simple. · Interacción: Preparar comentario · CTA: — · Preparar: Diseño · Checklist: Una sola frase\"}, {\"label\": \"Slide 6\", \"function\": \"CTA\", \"action\": \"Producto hero\", \"onScreenText\": \"COMENTA SOLO TUS 3 LETRAS.\\nSIN EXPLICACIONES.\", \"voiceover\": null, \"notes\": \"Diseño: Naranja + producto abajo. · Interacción: Comentario · CTA: A-B-A / B-B-A… · Preparar: Hero product · Checklist: CTA enorme\"}], \"stories\": [{\"label\": \"Frame 1\", \"function\": \"Tres decisiones\", \"action\": null, \"onScreenText\": \"«HOY NO TE PREGUNTAMOS QUÉ TE GUSTA. TE OBLIGAMOS A ELEGIR.»\", \"interaction\": null, \"notes\": null}, {\"label\": \"Frame 2\", \"function\": null, \"action\": null, \"onScreenText\": \"Repost C01 + «3 elecciones. 3 letras.»\", \"interaction\": \"Sin sticker\", \"notes\": \"Hora: 16:00. Llevar al carrusel con una mecánica clara, sin duplicar sus slides.\"}]}"
  },
  {
    "idfeed": "R04",
    "title": "LA REGLA NARANJA",
    "caption": "Aviso: después de esto vas a empezar a ver naranja en todas partes. 🍊\n\n#CapelinoSpritz",
    "mediaType": "VIDEO",
    "date": "2026-10-06",
    "hour": "20:30:00+02:00",
    "scheduledAt": "2026-10-06T20:30:00+02:00",
    "productionNotesJson": "{\"format\": \"REEL\", \"concept\": \"LA REGLA NARANJA\", \"whoAppears\": \"0–1 adulto\", \"materials\": \"Puerta, producto, objetos naranja, fondos, copa · Equipo: Trípode, LED, cámara/móvil, IA/composición\", \"validateBeforePublish\": \"Mismo encuadre, movimiento y tamaño en todos los objetos; cierre con producto.\", \"editing\": \"Test: Match cuts + color-recognition\", \"kpi\": \"Replays + guardados + visitas perfil\", \"cta\": null, \"approval\": \"Pendiente\", \"steps\": [{\"label\": \"0,0–1,0 s\", \"function\": \"Intriga\", \"action\": \"Movimiento hacia cámara.\", \"onScreenText\": \"HAY UN PROBLEMA:\", \"voiceover\": null, \"notes\": \"Cámara: Muy cerrado · Audio: Beat · Edición: Cut · Checklist: Mismo eje\"}, {\"label\": \"1,0–2,0 s\", \"function\": \"Patrón\", \"action\": \"Repetir gesto.\", \"onScreenText\": \"AHORA VAS A VER ESTE NARANJA…\", \"voiceover\": null, \"notes\": \"Cámara: Muy cerrado · Audio: Beat · Edición: Match cut · Checklist: Tamaño idéntico\"}, {\"label\": \"2,0–3,2 s\", \"function\": \"Reveal marca\", \"action\": \"Mismo movimiento.\", \"onScreenText\": \"…EN TODAS PARTES.\", \"voiceover\": null, \"notes\": \"Cámara: Primer plano · Audio: Beat · Edición: Match cut · Checklist: Continuidad\"}, {\"label\": \"3,2–4,6 s\", \"function\": \"Reconocimiento\", \"action\": \"Giro 5 grados.\", \"onScreenText\": \"—\", \"voiceover\": null, \"notes\": \"Cámara: Producto · Audio: Textura sonora · Edición: Cut on beat · Checklist: Etiqueta centrada\"}, {\"label\": \"4,6–6,0 s\", \"function\": \"Recuerdo / replay\", \"action\": \"Acercamiento.\", \"onScreenText\": \"TE LO DIJE.\", \"voiceover\": null, \"notes\": \"Cámara: Hero · Audio: Beat final · Edición: Loop · Checklist: Cierre breve\"}], \"stories\": [{\"label\": \"Frame 1\", \"function\": \"La regla naranja\", \"action\": null, \"onScreenText\": \"Vídeo corto de 2 match cuts que no aparecen completos en el Reel.\", \"interaction\": null, \"notes\": null}, {\"label\": \"Frame 2\", \"function\": null, \"action\": null, \"onScreenText\": \"Repost R04 + «AVISADO QUEDAS: AHORA LO VAS A VER EN TODAS PARTES.»\", \"interaction\": \"Sin sticker\", \"notes\": \"Hora: 21:00. Extender el concepto del Reel con material exclusivo de Stories.\"}]}"
  },
  {
    "idfeed": "P01",
    "title": "OPINIÓN IMPPOPULAR — EL VERANO CAMBIA DE HORARIO",
    "caption": "Opinión impopular: octubre todavía sabe a tarde larga. 🍊\n\n¿Te compro la teoría?\n\n#CapelinoSpritz",
    "mediaType": "IMAGE",
    "date": "2026-10-09",
    "hour": "14:30:00+02:00",
    "scheduledAt": "2026-10-09T14:30:00+02:00",
    "productionNotesJson": "{\"format\": \"POST ESTÁTICO\", \"concept\": \"OPINIÓN IMPPOPULAR — EL VERANO CAMBIA DE HORARIO\", \"whoAppears\": \"0–1 adulto\", \"materials\": \"Puerta, producto, objetos naranja, fondos, copa · Equipo: Trípode, LED, cámara/móvil, IA/composición\", \"validateBeforePublish\": \"Foto 1080×1350, titular Belgrad, logo pequeño, margen para interfaz.\", \"editing\": null, \"kpi\": \"Compartidos + guardados + visitas perfil\", \"cta\": \"Pregunta en copy: «¿Te compro la teoría?»\", \"approval\": \"Pendiente\", \"steps\": [{\"label\": \"Paso 1\", \"function\": \"Elegir una foto con sensación de tarde\", \"action\": \"Botella/copa + luz cálida.\", \"onScreenText\": \"—\", \"voiceover\": null, \"notes\": \"Diseño: No escoger un bodegón demasiado publicitario. · Archivo: Foto vertical HQ · Revisión: Luz creíble / etiqueta legible · Objetivo: Que parezca una idea, no un anuncio\"}, {\"label\": \"Paso 2\", \"function\": \"Construir el hook\", \"action\": \"Producto 30–35%; mucho aire para texto.\", \"onScreenText\": \"OPINIÓN IMPPOPULAR:\", \"voiceover\": null, \"notes\": \"Diseño: Titular grande en 1 bloque. · Archivo: 1080×1350 · Revisión: Lectura inmediata · Objetivo: Parar el scroll\"}, {\"label\": \"Paso 3\", \"function\": \"Completar la frase\", \"action\": \"Mismo visual.\", \"onScreenText\": \"EL VERANO NO SE ACABA.\\nCAMBIA DE HORARIO.\", \"voiceover\": null, \"notes\": \"Diseño: Belgrad; máximo 3 líneas fuertes. · Archivo: PSD/Figma · Revisión: Legible al 25% de zoom · Objetivo: Compartibilidad\"}, {\"label\": \"Paso 4\", \"function\": \"Añadir marca\", \"action\": \"Logo pequeño + naranja Capelino.\", \"onScreenText\": \"—\", \"voiceover\": null, \"notes\": \"Diseño: No competir con el hook. · Archivo: Arte final · Revisión: Logo nítido · Objetivo: Reconocimiento\"}, {\"label\": \"Paso 5\", \"function\": \"Preparar copy\", \"action\": \"—\", \"onScreenText\": \"Opinión impopular: octubre todavía sabe a tarde larga. 🍊\\n#CapelinoSpritz\", \"voiceover\": null, \"notes\": \"Diseño: Copy breve. · Archivo: Texto listo · Revisión: Tono adulto / sin claims · Objetivo: Conversación\"}, {\"label\": \"Paso 6\", \"function\": \"Publicar\", \"action\": \"Post 1080×1350.\", \"onScreenText\": \"—\", \"voiceover\": null, \"notes\": \"Diseño: Feed 14:30; Story 16:00 con encuesta «¿Te compro la teoría?» · Archivo: Instagram · Revisión: Revisar recorte grid · Objetivo: Compartidos / perfil\"}, {\"label\": \"Paso 7\", \"function\": \"Medir 24 h\", \"action\": \"—\", \"onScreenText\": \"—\", \"voiceover\": null, \"notes\": \"Diseño: Registrar alcance, compartidos, guardados y visitas. · Archivo: Tracker · Revisión: Separar orgánico/collab/paid · Objetivo: Aprendizaje\"}], \"stories\": [{\"label\": \"Frame 1\", \"function\": \"La frase del día\", \"action\": null, \"onScreenText\": \"Post tipográfico independiente: «EL VERANO NO SE ACABA. CAMBIA DE HORARIO.»\", \"interaction\": null, \"notes\": null}, {\"label\": \"Frame 2\", \"function\": null, \"action\": null, \"onScreenText\": \"Repost P01 pequeño, sin cubrir la creatividad.\", \"interaction\": \"Sin sticker\", \"notes\": \"Hora: 16:00. Hacer que la idea viva también fuera del post.\"}]}"
  },
  {
    "idfeed": "R05",
    "title": "CAPELINO IRL — OCTUBRE",
    "caption": "Nadie me avisó de que octubre iba a seguir teniendo estas tardes. 🍊\n\n¿Más real o más surreal?\n\n#CapelinoSpritz #CapelinoIRL",
    "mediaType": "VIDEO",
    "date": "2026-10-13",
    "hour": "20:30:00+02:00",
    "scheduledAt": "2026-10-13T20:30:00+02:00",
    "productionNotesJson": "{\"format\": \"REEL\", \"concept\": \"CAPELINO IRL — OCTUBRE\", \"whoAppears\": \"2 adultos\", \"materials\": \"Producto, mesa, props retro, snacks · Equipo: Móvil/cámara, LED, trípode\", \"validateBeforePublish\": \"Rodaje natural; microgestos, macro, luz de tarde, nada de poses publicitarias.\", \"editing\": \"Test: Real vs conceptual\", \"kpi\": \"Compartidos + follows/1.000\", \"cta\": null, \"approval\": \"Pendiente\", \"steps\": [{\"label\": \"0,0–1,2 s\", \"function\": \"Hook estacional\", \"action\": \"Mano adulta coloca copa.\", \"onScreenText\": \"NADIE ME AVISÓ DE QUE OCTUBRE…\", \"voiceover\": null, \"notes\": \"Cámara: Cámara en mano · Audio: Ambiente real · Edición: Corte natural · Checklist: Luz cálida\"}, {\"label\": \"1,2–2,8 s\", \"function\": \"Construir contexto\", \"action\": \"Manos colocan elementos.\", \"onScreenText\": \"…IBA A SEGUIR TENIENDO…\", \"voiceover\": null, \"notes\": \"Cámara: Plano medio · Audio: Ambiente · Edición: B-roll · Checklist: Nada posado\"}, {\"label\": \"2,8–4,2 s\", \"function\": \"Recompensa visual\", \"action\": \"Giro leve de copa.\", \"onScreenText\": \"…ESTAS TARDES.\", \"voiceover\": null, \"notes\": \"Cámara: Macro · Audio: Sonido detalle · Edición: Corte al beat · Checklist: Producto impecable\"}, {\"label\": \"4,2–6,0 s\", \"function\": \"Humanidad\", \"action\": \"Conversación natural.\", \"onScreenText\": \"—\", \"voiceover\": null, \"notes\": \"Cámara: 2x / plano medio · Audio: Ambiente · Edición: B-roll · Checklist: Adultos claros\"}, {\"label\": \"6,0–7,5 s\", \"function\": \"Identificación\", \"action\": \"Gesto natural.\", \"onScreenText\": \"—\", \"voiceover\": null, \"notes\": \"Cámara: POV lateral · Audio: Copa / mesa · Edición: Cut on action · Checklist: Sin consumo prolongado\"}, {\"label\": \"7,5–9,0 s\", \"function\": \"Marca\", \"action\": \"Plano fijo.\", \"onScreenText\": \"CAPELINO IRL.\", \"voiceover\": null, \"notes\": \"Cámara: Plano general · Audio: Música baja · Edición: Cierre · Checklist: Texto pequeño\"}], \"stories\": [{\"label\": \"Frame 1\", \"function\": \"Octubre real\", \"action\": null, \"onScreenText\": \"Foto fija diferente a la portada del Reel + «NADIE ME AVISÓ DE ESTAS TARDES.»\", \"interaction\": null, \"notes\": null}, {\"label\": \"Frame 2\", \"function\": null, \"action\": null, \"onScreenText\": \"Repost R05 con «CAPELINO IRL.»\", \"interaction\": \"Sin sticker\", \"notes\": \"Hora: 21:00. Apoyar R05 desde un ángulo editorial, no con encuesta.\"}]}"
  },
  {
    "idfeed": "C02",
    "title": "NO ME CREO QUE ELIJAS LA MISMA LETRA 3 VECES",
    "caption": "Dos segundos por elección. No vale volver atrás. 🍊\n\nComenta AAA, BBB o tu mezcla.\n\n#CapelinoSpritz",
    "mediaType": "IMAGE",
    "date": "2026-10-16",
    "hour": "14:30:00+02:00",
    "scheduledAt": "2026-10-16T14:30:00+02:00",
    "productionNotesJson": "{\"format\": \"CARRUSEL\", \"concept\": \"NO ME CREO QUE ELIJAS LA MISMA LETRA 3 VECES\", \"whoAppears\": \"2 adultos\", \"materials\": \"Producto, mesa, props retro, snacks · Equipo: Móvil/cámara, LED, trípode\", \"validateBeforePublish\": \"6 slides, tipografía enorme, imágenes comparables, CTA final de 3 letras.\", \"editing\": null, \"kpi\": \"Comentarios + guardados\", \"cta\": \"«Comenta AAA, BBB o tu mezcla.»\", \"approval\": \"Pendiente\", \"steps\": [{\"label\": \"Slide 1\", \"function\": \"Hook reto\", \"action\": \"Producto oculto entre 2 universos\", \"onScreenText\": \"NO ME CREO QUE ELIJAS\\nLA MISMA LETRA\\n3 VECES.\", \"voiceover\": null, \"notes\": \"Diseño: Fondo naranja oscuro / editorial. · Interacción: Deslizar · CTA: — · Preparar: Foto hero · Checklist: Reto directo\"}, {\"label\": \"Slide 2\", \"function\": \"Elección rápida 1\", \"action\": \"Atardecer vs after dark\", \"onScreenText\": \"A: ATARDECER\\nB: AFTER DARK\", \"voiceover\": null, \"notes\": \"Diseño: 2 s por slide. · Interacción: Elegir · CTA: — · Preparar: 2 fotos · Checklist: No poner explicación\"}, {\"label\": \"Slide 3\", \"function\": \"Elección rápida 2\", \"action\": \"Minimal vs aperitivo\", \"onScreenText\": \"A: MINIMAL\\nB: APERITIVO\", \"voiceover\": null, \"notes\": \"Diseño: Split. · Interacción: Elegir · CTA: — · Preparar: 2 fotos · Checklist: Producto integrado\"}, {\"label\": \"Slide 4\", \"function\": \"Elección rápida 3\", \"action\": \"Real vs surreal\", \"onScreenText\": \"A: REAL\\nB: SURREAL\", \"voiceover\": null, \"notes\": \"Diseño: Foto real vs IA/3D Capelino. · Interacción: Elegir · CTA: — · Preparar: 2 visuales · Checklist: Calidad equivalente\"}, {\"label\": \"Slide 5\", \"function\": \"Resultado\", \"action\": \"AAA / BBB / mezcla\", \"onScreenText\": \"¿AAA, BBB O MEZCLA?\", \"voiceover\": null, \"notes\": \"Diseño: Diseño con tres letras grandes. · Interacción: Preparar comentario · CTA: — · Preparar: Diseño · Checklist: No dar personalidad inventada\"}, {\"label\": \"Slide 6\", \"function\": \"CTA\", \"action\": \"Producto + letras\", \"onScreenText\": \"COMENTA TUS 3 LETRAS.\\nNO VALE CAMBIARLAS.\", \"voiceover\": null, \"notes\": \"Diseño: Fondo limpio. · Interacción: Comentario · CTA: 3 letras · Preparar: Hero product · Checklist: CTA claro\"}], \"stories\": [{\"label\": \"Frame 1\", \"function\": \"No vale volver atrás\", \"action\": null, \"onScreenText\": \"«2 SEGUNDOS POR ELECCIÓN. NO VALE VOLVER.»\", \"interaction\": null, \"notes\": null}, {\"label\": \"Frame 2\", \"function\": null, \"action\": null, \"onScreenText\": \"Repost C02 + «AAA, BBB O MEZCLA.»\", \"interaction\": \"Sin sticker\", \"notes\": \"Hora: 16:00. Convertir el carrusel en reto sin duplicar el contenido.\"}]}"
  },
  {
    "idfeed": "R06",
    "title": "ENCUENTRA CAPELINO",
    "caption": "No me creo que lo hayas visto a la primera. 🍊\n\nComenta 🍊 si encontraste Capelino antes del zoom.\n\n#CapelinoSpritz",
    "mediaType": "VIDEO",
    "date": "2026-10-20",
    "hour": "20:30:00+02:00",
    "scheduledAt": "2026-10-20T20:30:00+02:00",
    "productionNotesJson": "{\"format\": \"REEL\", \"concept\": \"ENCUENTRA CAPELINO\", \"whoAppears\": \"2 adultos\", \"materials\": \"Producto, mesa, props retro, snacks · Equipo: Móvil/cámara, LED, trípode\", \"validateBeforePublish\": \"Producto visible pero no obvio. No mover la cámara durante los 3 s.\", \"editing\": \"Test: Reto visual vs Reel pasivo\", \"kpi\": \"Retención + replays + comentarios\", \"cta\": null, \"approval\": \"Pendiente\", \"steps\": [{\"label\": \"0,0–1,0 s\", \"function\": \"Reto inmediato\", \"action\": \"Nada se mueve.\", \"onScreenText\": \"NO ME CREO QUE ENCUENTRES CAPELINO…\", \"voiceover\": null, \"notes\": \"Cámara: Plano fijo · Audio: Tick · Edición: Sin transición · Checklist: Botella visible pero difícil\"}, {\"label\": \"1,0–3,8 s\", \"function\": \"Retención + replay\", \"action\": \"Mantener cámara fija.\", \"onScreenText\": \"…EN 3 SEGUNDOS.\", \"voiceover\": null, \"notes\": \"Cámara: Plano fijo · Audio: Cuenta atrás · Edición: Overlay · Checklist: No mover escena\"}, {\"label\": \"3,8–5,0 s\", \"function\": \"Recompensa\", \"action\": \"Zoom digital.\", \"onScreenText\": \"—\", \"voiceover\": null, \"notes\": \"Cámara: Punch-in · Audio: Whoosh · Edición: Zoom · Checklist: Punto exacto\"}, {\"label\": \"5,0–6,0 s\", \"function\": \"Satisfacción\", \"action\": \"Luz/círculo discreto.\", \"onScreenText\": \"AQUÍ.\", \"voiceover\": null, \"notes\": \"Cámara: Plano detalle · Audio: Hit · Edición: Freeze corto · Checklist: No infantilizar\"}, {\"label\": \"6,0–7,0 s\", \"function\": \"Comentario\", \"action\": \"Freeze.\", \"onScreenText\": \"¿LO VISTE?\", \"voiceover\": null, \"notes\": \"Cámara: Plano fijo · Audio: Beat final · Edición: Loop · Checklist: CTA mínimo\"}], \"stories\": [{\"label\": \"Frame 1\", \"function\": \"¿Lo viste?\", \"action\": null, \"onScreenText\": \"Repost R06 sin reveal, empezando en el contador.\", \"interaction\": null, \"notes\": null}, {\"label\": \"Frame 2\", \"function\": null, \"action\": null, \"onScreenText\": \"Frame final independiente + «SI LO VISTE ANTES DEL ZOOM: 🍊»\", \"interaction\": \"Reacción/emoji 🍊\", \"notes\": \"Hora: 21:00. Conseguir repetición y respuesta sin volver a usar encuesta A/B.\"}]}"
  }
];

const NEW_PLAN: NewPlanItem[] = [
  {
    "date": "2026-09-21",
    "day": "Lunes",
    "format": "Stories",
    "family": null,
    "topic": "Hook research postapocalipsis",
    "objective": "Research",
    "kpi": "Respuestas encuesta",
    "keyword": null,
    "notes": "Entender si el gancho principal es visual o narrativo."
  },
  {
    "date": "2026-09-22",
    "day": "Martes",
    "format": "Reel",
    "family": null,
    "topic": "NEVERA POSTAPOCALÍPTICA",
    "objective": "Captación",
    "kpi": "Retención + % no seguidores + compartidos",
    "keyword": null,
    "notes": "Vídeo ya producido: añadir hook, revisar que el primer impacto ocurra antes de 1 s y exportar 9:16."
  },
  {
    "date": "2026-09-23",
    "day": "Miércoles",
    "format": "Stories",
    "family": null,
    "topic": "Informe de daños",
    "objective": "Research",
    "kpi": "Respuestas + taps",
    "keyword": null,
    "notes": "Convertir el concepto postapocalíptico en una pieza de universo de marca."
  },
  {
    "date": "2026-09-24",
    "day": "Jueves",
    "format": "Stories",
    "family": null,
    "topic": "Una foto, una frase",
    "objective": "Precalentar",
    "kpi": "Cuenta atrás / respuestas",
    "keyword": null,
    "notes": "Crear expectativa para R02 sin usar teaser clásico."
  },
  {
    "date": "2026-09-25",
    "day": "Viernes",
    "format": "Reel",
    "family": null,
    "topic": "OPINIÓN IMPPOPULAR: SEPTIEMBRE > AGOSTO",
    "objective": "Captación",
    "kpi": "Compartidos + comentarios + follows/1.000",
    "keyword": null,
    "notes": "Grabar golden hour real, versión POV y versión lateral; sacar 10 recursos extra."
  },
  {
    "date": "2026-09-26",
    "day": "Sábado",
    "format": "Stories",
    "family": null,
    "topic": "La banda sonora de hoy",
    "objective": "Research",
    "kpi": "Respuestas",
    "keyword": null,
    "notes": "Dar personalidad cultural a la marca sin hablar del producto."
  },
  {
    "date": "2026-09-27",
    "day": "Domingo",
    "format": "Stories",
    "family": null,
    "topic": "Elige una puerta",
    "objective": "Research",
    "kpi": "Respuestas",
    "keyword": null,
    "notes": "Preparar el lenguaje visual de R03 de forma lúdica."
  },
  {
    "date": "2026-09-28",
    "day": "Lunes",
    "format": "Stories",
    "family": null,
    "topic": "Antes y después",
    "objective": "Curiosidad",
    "kpi": "Cuenta atrás",
    "keyword": null,
    "notes": "Mostrar proceso creativo sin enseñar el reveal completo."
  },
  {
    "date": "2026-09-29",
    "day": "Martes",
    "format": "Reel",
    "family": null,
    "topic": "INTERRUPCIÓN CAPELINO #01 — PUERTA",
    "objective": "Captación",
    "kpi": "Compartidos + % no seguidores + comentarios",
    "keyword": null,
    "notes": "Pomo, placa limpia, interior/IA, producto. Mantener sorpresa antes del segundo 1,2."
  },
  {
    "date": "2026-09-30",
    "day": "Miércoles",
    "format": "Stories",
    "family": null,
    "topic": "Wallpaper Capelino",
    "objective": "Serie",
    "kpi": "Respuestas",
    "keyword": null,
    "notes": "Crear una pieza guardable y diferente al contenido del feed."
  },
  {
    "date": "2026-10-01",
    "day": "Jueves",
    "format": "Stories",
    "family": null,
    "topic": "El detalle",
    "objective": "Precalentar carrusel",
    "kpi": "Respuestas",
    "keyword": null,
    "notes": "Generar deseo visual sin CTA ni encuesta."
  },
  {
    "date": "2026-10-02",
    "day": "Viernes",
    "format": "Carrusel",
    "family": null,
    "topic": "DICES «ME DA IGUAL» Y LUEGO ELIGES TODO",
    "objective": "Comentarios + guardados",
    "kpi": "Comentarios + guardados + visitas perfil",
    "keyword": null,
    "notes": "6 slides, fotos propias, titular grande, última slide con CTA de 3 letras."
  },
  {
    "date": "2026-10-03",
    "day": "Sábado",
    "format": "Stories",
    "family": null,
    "topic": "Capelino visto por ahí",
    "objective": "Comunidad",
    "kpi": "Respuestas / DMs",
    "keyword": null,
    "notes": "Aportar prueba social y naturalidad."
  },
  {
    "date": "2026-10-04",
    "day": "Domingo",
    "format": "Stories",
    "family": null,
    "topic": "Escúchalo",
    "objective": "Retención Story",
    "kpi": "Replays Story / slider",
    "keyword": null,
    "notes": "Trabajar sonido y repetición; nada de encuesta."
  },
  {
    "date": "2026-10-05",
    "day": "Lunes",
    "format": "Stories",
    "family": null,
    "topic": "Caza el naranja",
    "objective": "Curiosidad + recuerdo",
    "kpi": "Respuestas",
    "keyword": null,
    "notes": "Introducir la idea de R04 como juego visual."
  },
  {
    "date": "2026-10-06",
    "day": "Martes",
    "format": "Reel",
    "family": null,
    "topic": "LA REGLA NARANJA",
    "objective": "Captación + recuerdo",
    "kpi": "Replays + guardados + visitas perfil",
    "keyword": null,
    "notes": "Mismo encuadre, movimiento y tamaño en todos los objetos; cierre con producto."
  },
  {
    "date": "2026-10-07",
    "day": "Miércoles",
    "format": "Stories",
    "family": null,
    "topic": "El naranja se mete en todo",
    "objective": "Research",
    "kpi": "Respuestas",
    "keyword": null,
    "notes": "Meter humor de marca sin depender de interacción."
  },
  {
    "date": "2026-10-08",
    "day": "Jueves",
    "format": "Stories",
    "family": null,
    "topic": "3 cosas que son muy Capelino",
    "objective": "Precalentar",
    "kpi": "Cuenta atrás",
    "keyword": null,
    "notes": "Construir códigos visuales de marca."
  },
  {
    "date": "2026-10-09",
    "day": "Viernes",
    "format": "Post",
    "family": null,
    "topic": "OPINIÓN IMPPOPULAR — EL VERANO CAMBIA DE HORARIO",
    "objective": "Compartidos + perfil",
    "kpi": "Compartidos + guardados + visitas perfil",
    "keyword": null,
    "notes": "Foto 1080×1350, titular Belgrad, logo pequeño, margen para interfaz."
  },
  {
    "date": "2026-10-10",
    "day": "Sábado",
    "format": "Stories",
    "family": null,
    "topic": "Sin set",
    "objective": "Humanizar",
    "kpi": "Respuestas / taps",
    "keyword": null,
    "notes": "Humanizar la marca con personas, no solo producto."
  },
  {
    "date": "2026-10-11",
    "day": "Domingo",
    "format": "Stories",
    "family": null,
    "topic": "El plan del domingo",
    "objective": "Identificación",
    "kpi": "Respuestas",
    "keyword": null,
    "notes": "Hablar de estilos de plan, no de consumo."
  },
  {
    "date": "2026-10-12",
    "day": "Lunes",
    "format": "Stories",
    "family": null,
    "topic": "Lo que no sale en el Reel",
    "objective": "Curiosidad estacional",
    "kpi": "Cuenta atrás",
    "keyword": null,
    "notes": "Dar cercanía y mostrar trabajo real."
  },
  {
    "date": "2026-10-13",
    "day": "Martes",
    "format": "Reel",
    "family": null,
    "topic": "CAPELINO IRL — OCTUBRE",
    "objective": "Captación + afinidad",
    "kpi": "Compartidos + follows/1.000",
    "keyword": null,
    "notes": "Rodaje natural; microgestos, macro, luz de tarde, nada de poses publicitarias."
  },
  {
    "date": "2026-10-14",
    "day": "Miércoles",
    "format": "Stories",
    "family": null,
    "topic": "Soundtrack Capelino",
    "objective": "Cerrar loop",
    "kpi": "Taps / respuestas",
    "keyword": null,
    "notes": "Aprender preferencias musicales y reforzar cultura de marca."
  },
  {
    "date": "2026-10-15",
    "day": "Jueves",
    "format": "Stories",
    "family": null,
    "topic": "Un objeto, una sombra",
    "objective": "Precalentar juego",
    "kpi": "Cuenta atrás",
    "keyword": null,
    "notes": "Dar descanso visual y mantener sensación premium."
  },
  {
    "date": "2026-10-16",
    "day": "Viernes",
    "format": "Carrusel",
    "family": null,
    "topic": "NO ME CREO QUE ELIJAS LA MISMA LETRA 3 VECES",
    "objective": "Comentarios + guardados",
    "kpi": "Comentarios + guardados",
    "keyword": null,
    "notes": "6 slides, tipografía enorme, imágenes comparables, CTA final de 3 letras."
  },
  {
    "date": "2026-10-17",
    "day": "Sábado",
    "format": "Stories",
    "family": null,
    "topic": "Lo que elegisteis",
    "objective": "Recompensar",
    "kpi": "Taps",
    "keyword": null,
    "notes": "Cerrar el loop y demostrar que se escucha a la audiencia."
  },
  {
    "date": "2026-10-18",
    "day": "Domingo",
    "format": "Stories",
    "family": null,
    "topic": "3 pasos, 3 planos",
    "objective": "Retención",
    "kpi": "Replays Story",
    "keyword": null,
    "notes": "Contenido sensorial simple y elegante; variar respecto a encuestas."
  },
  {
    "date": "2026-10-19",
    "day": "Lunes",
    "format": "Stories",
    "family": null,
    "topic": "Está delante de ti",
    "objective": "Reto",
    "kpi": "Cuenta atrás",
    "keyword": null,
    "notes": "Precalentar R06 con una imagen distinta al vídeo."
  },
  {
    "date": "2026-10-20",
    "day": "Martes",
    "format": "Reel",
    "family": null,
    "topic": "ENCUENTRA CAPELINO",
    "objective": "Captación + juego",
    "kpi": "Retención + replays + comentarios",
    "keyword": null,
    "notes": "Producto visible pero no obvio. No mover la cámara durante los 3 s."
  }
];

async function main() {
  const clientRs = await db.execute({
    sql: `SELECT id FROM clients WHERE name = ?`,
    args: ["Capelino"],
  });
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
    console.log(`⚠ ${published.length} pieza(s) ya marcadas como "Publicado" en este rango — se dejan intactas, no se tocan:`);
    for (const r of published) console.log(`   - ${r.scheduledAt} · ${r.title}`);
  }

  for (const r of replaceable) {
    await db.execute({ sql: `DELETE FROM content_items WHERE id = ?`, args: [r.id] });
  }
  console.log(`✓ Borradas ${replaceable.length} pieza(s) antiguas del calendario (21 sept.–20 oct.) para sustituir por la versión viral.`);

  // Días publicados que colisionan con una fecha nueva: no insertar ahí para no duplicar.
  const publishedDates = new Set(published.map((r) => r.scheduledAt.slice(0, 10)));

  let inserted = 0;
  let skipped = 0;
  for (const item of NEW_CONTENT) {
    if (publishedDates.has(item.date)) {
      console.log(`⚠ Se omite ${item.idfeed} (${item.date}): ya hay una pieza publicada ese día.`);
      skipped++;
      continue;
    }
    const id = randomUUID();
    const ts = new Date().toISOString();
    await db.execute({
      sql: `INSERT INTO content_items
        (id, clientId, title, caption, mediaUrl, mediaType, platform, scheduledAt, status, publishedAt, errorMessage, productionNotes, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, NULL, ?, ?, ?)`,
      args: [
        id,
        clientId,
        item.title,
        item.caption,
        `https://picsum.photos/seed/capelino-viral-${item.idfeed}/600/600`,
        item.mediaType,
        "INSTAGRAM",
        new Date(item.scheduledAt).toISOString(),
        "DRAFT",
        item.productionNotesJson,
        ts,
        ts,
      ],
    });
    inserted++;
  }
  console.log(`✓ Insertadas ${inserted} piezas nuevas de feed (${skipped} omitidas por colisión con algo ya publicado).`);

  // ---- plan_items: sustituir el rango completo ----
  const oldPlanRs = await db.execute({
    sql: `SELECT id FROM plan_items WHERE clientId = ? AND date >= ? AND date < ?`,
    args: [clientId, RANGE_START_DATE, RANGE_END_DATE],
  });
  const oldPlanIds = (oldPlanRs.rows as unknown as { id: string }[]).map((r) => r.id);
  for (const id of oldPlanIds) {
    await db.execute({ sql: `DELETE FROM plan_items WHERE id = ?`, args: [id] });
  }
  console.log(`✓ Borrados ${oldPlanIds.length} elemento(s) antiguos del "Plan de contenido IA" en este rango.`);

  const batchId = randomUUID();
  const batchTs = new Date().toISOString();
  await db.execute({
    sql: `INSERT INTO plan_batches (id, clientId, periodDays, trendsSummary, model, createdAt) VALUES (?, ?, ?, ?, ?, ?)`,
    args: [
      batchId,
      clientId,
      30,
      "Plan actualizado a partir del Excel \"Capelino_Calendario_30_dias_VIRAL_21Sep_20Oct_2026\" (no generado por IA): misma ventana 21 sept.-20 oct. 2026, con nueva capa de hooks virales (curiosidad, opinión, reto, identificación, sorpresa visual) adaptados al tono Capelino para aumentar alcance a no seguidores y captación de nuevos seguidores.",
      null,
      batchTs,
    ],
  });

  for (const p of NEW_PLAN) {
    const id = randomUUID();
    const ts = new Date().toISOString();
    await db.execute({
      sql: `INSERT INTO plan_items (id, clientId, planBatchId, date, day, format, family, topic, objective, kpi, keyword, notes, status, contentItemId, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, ?, ?)`,
      args: [
        id, clientId, batchId, p.date, p.day, p.format, p.family, p.topic, p.objective, p.kpi, p.keyword, p.notes,
        "IDEA", ts, ts,
      ],
    });
  }
  console.log(`✓ Insertados ${NEW_PLAN.length} elementos nuevos en "Plan de contenido IA".`);

  console.log("\nListo. Revisa el calendario y \"Guion y rodaje\" de Capelino en Nexalya.");
}

main().catch((err) => {
  console.error("✗ ERROR:", err);
  process.exit(1);
});
