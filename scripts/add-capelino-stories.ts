// Crea las historias "sueltas" de Capelino que faltaban: los 21 días del
// calendario 21 sept.-20 oct. 2026 que NO tienen publicación de feed ese
// día (research, teasers, apoyo a un Reel de otro día, etc.) se quedaron
// sin ficha propia al ejecutar update-capelino-viral-plan.ts — ese script
// solo creó las 9 piezas de feed, y adjuntó las stories de apoyo dentro
// del guion de la pieza de feed del MISMO día (cuando lo había). Este
// script crea una ficha para cada uno de esos 21 días, con el texto
// exacto de cada frame y el hook, para que aparezcan en la nueva pestaña
// "Historias" y en el Calendario general (con el icono de Historia).
//
// Contenido tomado del Excel revisado
// "Capelino_Calendario_30_dias_VIRAL_STORIES_VARIADAS_21Sep_20Oct_2026"
// (versión 2, con las historias diversificadas para evitar que se repita
// tanto la encuesta / patrón visual): cada día tiene ahora un "Pilar"
// (categoría de contenido, p. ej. "BRAND WORLD", "LIFESTYLE", "DEBATE"...)
// que se guarda y se muestra como etiqueta junto al título de la pieza, y
// los textos de cada frame, el sticker y la hora se han reescrito para
// que no se repita el mismo patrón de encuesta día sí día también.
//
// Es SEGURO de ejecutar más de una vez: antes de insertar, borra
// cualquier ficha de tipo Historia que ya exista en Capelino para esas
// mismas 21 fechas (por si se ejecuta dos veces, o para sustituir las
// historias de la versión anterior por estas nuevas), y nunca toca las 9
// piezas de feed ni nada ya marcado como "Publicado".
//
// Uso:  npx tsx --env-file=.env.local scripts/add-capelino-stories.ts

import { createClient } from "@libsql/client";
import { randomUUID } from "node:crypto";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;
if (!url) throw new Error("Falta TURSO_DATABASE_URL en .env.local");
const db = createClient({ url, authToken });

type StoryItem = {
  title: string;
  caption: string;
  date: string;
  hour: string;
  scheduledAt: string;
  objetivo: string | null;
  productionNotesJson: string;
};

const STORY_ITEMS: StoryItem[] = [
  {
    "title": "Hook research postapocalipsis",
    "caption": "Frame del vídeo con la nevera cayendo + texto: «SI ESTO TE SALE EN REELS…» → «¿QUÉ TE HARÍA PARARTE AQUÍ?»",
    "date": "2026-09-21",
    "hour": "19:30:00+02:00",
    "scheduledAt": "2026-09-21T19:30:00+02:00",
    "objetivo": "Research",
    "productionNotesJson": "{\"format\": \"STORY\", \"concept\": \"Hook research postapocalipsis\", \"pillar\": \"COMUNIDAD / RESEARCH\", \"validateBeforePublish\": \"Entender si el gancho principal es visual o narrativo.\", \"kpi\": \"Respuestas encuesta\", \"approval\": \"Pendiente\", \"steps\": [{\"label\": \"Frame 1\", \"function\": \"Hook research postapocalipsis\", \"action\": null, \"onScreenText\": \"Frame del vídeo con la nevera cayendo + texto: «SI ESTO TE SALE EN REELS…»\", \"interaction\": null, \"notes\": null}, {\"label\": \"Frame 2\", \"function\": null, \"action\": null, \"onScreenText\": \"«¿QUÉ TE HARÍA PARARTE AQUÍ?»\", \"interaction\": \"Encuesta: La escena 👀 / Quiero ver qué pasa\", \"notes\": \"Hora: 19:30. Entender si el gancho principal es visual o narrativo.\"}]}"
  },
  {
    "title": "Informe de daños",
    "caption": "Diseño limpio tipo ficha técnica: «DAÑOS: considerables. / CAPELINO: intacto.» + foto de una botella fría.",
    "date": "2026-09-23",
    "hour": "20:00:00+02:00",
    "scheduledAt": "2026-09-23T20:00:00+02:00",
    "objetivo": "Research",
    "productionNotesJson": "{\"format\": \"STORY\", \"concept\": \"Informe de daños\", \"pillar\": \"BRAND WORLD\", \"validateBeforePublish\": \"Convertir el concepto postapocalíptico en una pieza de universo de marca.\", \"kpi\": \"Respuestas + taps\", \"approval\": \"Pendiente\", \"steps\": [{\"label\": \"Frame 1\", \"function\": \"Informe de daños\", \"action\": null, \"onScreenText\": \"Diseño limpio tipo ficha técnica: «DAÑOS: considerables. / CAPELINO: intacto.» + foto de una botella fría.\", \"interaction\": \"Sin sticker\", \"notes\": \"Hora: 20:00. Convertir el concepto postapocalíptico en una pieza de universo de marca.\"}]}"
  },
  {
    "title": "Una foto, una frase",
    "caption": "Foto real de terraza al atardecer + «SEPTIEMBRE TIENE ALGO QUE AGOSTO NO.»",
    "date": "2026-09-24",
    "hour": "20:30:00+02:00",
    "scheduledAt": "2026-09-24T20:30:00+02:00",
    "objetivo": "Precalentar",
    "productionNotesJson": "{\"format\": \"STORY\", \"concept\": \"Una foto, una frase\", \"pillar\": \"LIFESTYLE\", \"validateBeforePublish\": \"Crear expectativa para R02 sin usar teaser clásico.\", \"kpi\": \"Cuenta atrás / respuestas\", \"approval\": \"Pendiente\", \"steps\": [{\"label\": \"Frame 1\", \"function\": \"Una foto, una frase\", \"action\": null, \"onScreenText\": \"Foto real de terraza al atardecer + «SEPTIEMBRE TIENE ALGO QUE AGOSTO NO.»\", \"interaction\": \"Sin sticker\", \"notes\": \"Hora: 20:30. Crear expectativa para R02 sin usar teaser clásico.\"}]}"
  },
  {
    "title": "La banda sonora de hoy",
    "caption": "Foto/vídeo real de Capelino con una canción seleccionada. → «¿QUÉ LE PEGA MÁS A ESTA ESCENA?»",
    "date": "2026-09-26",
    "hour": "20:30:00+02:00",
    "scheduledAt": "2026-09-26T20:30:00+02:00",
    "objetivo": "Research",
    "productionNotesJson": "{\"format\": \"STORY\", \"concept\": \"La banda sonora de hoy\", \"pillar\": \"MÚSICA / CULTURA\", \"validateBeforePublish\": \"Dar personalidad cultural a la marca sin hablar del producto.\", \"kpi\": \"Respuestas\", \"approval\": \"Pendiente\", \"steps\": [{\"label\": \"Frame 1\", \"function\": \"La banda sonora de hoy\", \"action\": null, \"onScreenText\": \"Foto/vídeo real de Capelino con una canción seleccionada.\", \"interaction\": null, \"notes\": null}, {\"label\": \"Frame 2\", \"function\": null, \"action\": null, \"onScreenText\": \"«¿QUÉ LE PEGA MÁS A ESTA ESCENA?»\", \"interaction\": \"Encuesta: Disco / Indie\", \"notes\": \"Hora: 20:30. Dar personalidad cultural a la marca sin hablar del producto.\"}]}"
  },
  {
    "title": "Elige una puerta",
    "caption": "Dos puertas distintas con estética Capelino: una naranja y una neutra. → «SOLO PUEDES ABRIR UNA.»",
    "date": "2026-09-27",
    "hour": "20:30:00+02:00",
    "scheduledAt": "2026-09-27T20:30:00+02:00",
    "objetivo": "Research",
    "productionNotesJson": "{\"format\": \"STORY\", \"concept\": \"Elige una puerta\", \"pillar\": \"JUEGO VISUAL\", \"validateBeforePublish\": \"Preparar el lenguaje visual de R03 de forma lúdica.\", \"kpi\": \"Respuestas\", \"approval\": \"Pendiente\", \"steps\": [{\"label\": \"Frame 1\", \"function\": \"Elige una puerta\", \"action\": null, \"onScreenText\": \"Dos puertas distintas con estética Capelino: una naranja y una neutra.\", \"interaction\": null, \"notes\": null}, {\"label\": \"Frame 2\", \"function\": null, \"action\": null, \"onScreenText\": \"«SOLO PUEDES ABRIR UNA.»\", \"interaction\": \"Encuesta: 🟧 / ⬜\", \"notes\": \"Hora: 20:30. Preparar el lenguaje visual de R03 de forma lúdica.\"}]}"
  },
  {
    "title": "Antes y después",
    "caption": "Frame limpio de una puerta normal: «ANTES.» → Versión intervenida con luz naranja: «DESPUÉS.»",
    "date": "2026-09-28",
    "hour": "20:30:00+02:00",
    "scheduledAt": "2026-09-28T20:30:00+02:00",
    "objetivo": "Curiosidad",
    "productionNotesJson": "{\"format\": \"STORY\", \"concept\": \"Antes y después\", \"pillar\": \"BTS / PROCESO\", \"validateBeforePublish\": \"Mostrar proceso creativo sin enseñar el reveal completo.\", \"kpi\": \"Cuenta atrás\", \"approval\": \"Pendiente\", \"steps\": [{\"label\": \"Frame 1\", \"function\": \"Antes y después\", \"action\": null, \"onScreenText\": \"Frame limpio de una puerta normal: «ANTES.»\", \"interaction\": null, \"notes\": null}, {\"label\": \"Frame 2\", \"function\": null, \"action\": null, \"onScreenText\": \"Versión intervenida con luz naranja: «DESPUÉS.»\", \"interaction\": \"Slider 🍊\", \"notes\": \"Hora: 20:30. Mostrar proceso creativo sin enseñar el reveal completo.\"}]}"
  },
  {
    "title": "Wallpaper Capelino",
    "caption": "Wallpaper vertical naranja minimal con botella pequeña y logo. → «MANTÉN PULSADO Y HAZ CAPTURA.»",
    "date": "2026-09-30",
    "hour": "20:00:00+02:00",
    "scheduledAt": "2026-09-30T20:00:00+02:00",
    "objetivo": "Serie",
    "productionNotesJson": "{\"format\": \"STORY\", \"concept\": \"Wallpaper Capelino\", \"pillar\": \"DISEÑO / UTILIDAD\", \"validateBeforePublish\": \"Crear una pieza guardable y diferente al contenido del feed.\", \"kpi\": \"Respuestas\", \"approval\": \"Pendiente\", \"steps\": [{\"label\": \"Frame 1\", \"function\": \"Wallpaper Capelino\", \"action\": null, \"onScreenText\": \"Wallpaper vertical naranja minimal con botella pequeña y logo.\", \"interaction\": null, \"notes\": null}, {\"label\": \"Frame 2\", \"function\": null, \"action\": null, \"onScreenText\": \"«MANTÉN PULSADO Y HAZ CAPTURA.»\", \"interaction\": \"Sin sticker\", \"notes\": \"Hora: 20:00. Crear una pieza guardable y diferente al contenido del feed.\"}]}"
  },
  {
    "title": "El detalle",
    "caption": "Macro de condensación y burbujas + «0 TEXTO NECESARIO.»",
    "date": "2026-10-01",
    "hour": "20:30:00+02:00",
    "scheduledAt": "2026-10-01T20:30:00+02:00",
    "objetivo": "Precalentar carrusel",
    "productionNotesJson": "{\"format\": \"STORY\", \"concept\": \"El detalle\", \"pillar\": \"PRODUCTO / SENSORIAL\", \"validateBeforePublish\": \"Generar deseo visual sin CTA ni encuesta.\", \"kpi\": \"Respuestas\", \"approval\": \"Pendiente\", \"steps\": [{\"label\": \"Frame 1\", \"function\": \"El detalle\", \"action\": null, \"onScreenText\": \"Macro de condensación y burbujas + «0 TEXTO NECESARIO.»\", \"interaction\": \"Sin sticker\", \"notes\": \"Hora: 20:30. Generar deseo visual sin CTA ni encuesta.\"}]}"
  },
  {
    "title": "Capelino visto por ahí",
    "caption": "Repost de una foto real de cliente/creador/local si existe; si no, foto espontánea propia + «SPOTTED.»",
    "date": "2026-10-03",
    "hour": "20:30:00+02:00",
    "scheduledAt": "2026-10-03T20:30:00+02:00",
    "objetivo": "Comunidad",
    "productionNotesJson": "{\"format\": \"STORY\", \"concept\": \"Capelino visto por ahí\", \"pillar\": \"UGC / SOCIAL\", \"validateBeforePublish\": \"Aportar prueba social y naturalidad.\", \"kpi\": \"Respuestas / DMs\", \"approval\": \"Pendiente\", \"steps\": [{\"label\": \"Frame 1\", \"function\": \"Capelino visto por ahí\", \"action\": null, \"onScreenText\": \"Repost de una foto real de cliente/creador/local si existe; si no, foto espontánea propia + «SPOTTED.»\", \"interaction\": \"Mención si aplica\", \"notes\": \"Hora: 20:30. Aportar prueba social y naturalidad.\"}]}"
  },
  {
    "title": "Escúchalo",
    "caption": "Vídeo de 4 s: hielo + vertido + burbujas. Texto pequeño: «SUBE EL VOLUMEN.»",
    "date": "2026-10-04",
    "hour": "19:30:00+02:00",
    "scheduledAt": "2026-10-04T19:30:00+02:00",
    "objetivo": "Retención Story",
    "productionNotesJson": "{\"format\": \"STORY\", \"concept\": \"Escúchalo\", \"pillar\": \"ASMR\", \"validateBeforePublish\": \"Trabajar sonido y repetición; nada de encuesta.\", \"kpi\": \"Replays Story / slider\", \"approval\": \"Pendiente\", \"steps\": [{\"label\": \"Frame 1\", \"function\": \"Escúchalo\", \"action\": null, \"onScreenText\": \"Vídeo de 4 s: hielo + vertido + burbujas. Texto pequeño: «SUBE EL VOLUMEN.»\", \"interaction\": \"Sin sticker\", \"notes\": \"Hora: 19:30. Trabajar sonido y repetición; nada de encuesta.\"}]}"
  },
  {
    "title": "Caza el naranja",
    "caption": "Collage de 6 objetos cotidianos, solo uno con naranja Capelino. → «¿CUÁNTO HAS TARDADO EN VERLO?»",
    "date": "2026-10-05",
    "hour": "20:30:00+02:00",
    "scheduledAt": "2026-10-05T20:30:00+02:00",
    "objetivo": "Curiosidad + recuerdo",
    "productionNotesJson": "{\"format\": \"STORY\", \"concept\": \"Caza el naranja\", \"pillar\": \"JUEGO / COLOR\", \"validateBeforePublish\": \"Introducir la idea de R04 como juego visual.\", \"kpi\": \"Respuestas\", \"approval\": \"Pendiente\", \"steps\": [{\"label\": \"Frame 1\", \"function\": \"Caza el naranja\", \"action\": null, \"onScreenText\": \"Collage de 6 objetos cotidianos, solo uno con naranja Capelino.\", \"interaction\": null, \"notes\": null}, {\"label\": \"Frame 2\", \"function\": null, \"action\": null, \"onScreenText\": \"«¿CUÁNTO HAS TARDADO EN VERLO?»\", \"interaction\": \"Slider 🍊\", \"notes\": \"Hora: 20:30. Introducir la idea de R04 como juego visual.\"}]}"
  },
  {
    "title": "El naranja se mete en todo",
    "caption": "Meme editorial: «YO: hoy voy neutro. / EL NARANJA: ni de broma.» + detalle de producto/objeto naranja.",
    "date": "2026-10-07",
    "hour": "20:00:00+02:00",
    "scheduledAt": "2026-10-07T20:00:00+02:00",
    "objetivo": "Research",
    "productionNotesJson": "{\"format\": \"STORY\", \"concept\": \"El naranja se mete en todo\", \"pillar\": \"HUMOR\", \"validateBeforePublish\": \"Meter humor de marca sin depender de interacción.\", \"kpi\": \"Respuestas\", \"approval\": \"Pendiente\", \"steps\": [{\"label\": \"Frame 1\", \"function\": \"El naranja se mete en todo\", \"action\": null, \"onScreenText\": \"Meme editorial: «YO: hoy voy neutro. / EL NARANJA: ni de broma.» + detalle de producto/objeto naranja.\", \"interaction\": \"Sin sticker\", \"notes\": \"Hora: 20:00. Meter humor de marca sin depender de interacción.\"}]}"
  },
  {
    "title": "3 cosas que son muy Capelino",
    "caption": "Textura 1: luz dorada. → Textura 2: naranja brillante. → Textura 3: retro + producto. Texto final: «Esto es Capelino sin decir Capelino.»",
    "date": "2026-10-08",
    "hour": "20:30:00+02:00",
    "scheduledAt": "2026-10-08T20:30:00+02:00",
    "objetivo": "Precalentar",
    "productionNotesJson": "{\"format\": \"STORY\", \"concept\": \"3 cosas que son muy Capelino\", \"pillar\": \"MOODBOARD\", \"validateBeforePublish\": \"Construir códigos visuales de marca.\", \"kpi\": \"Cuenta atrás\", \"approval\": \"Pendiente\", \"steps\": [{\"label\": \"Frame 1\", \"function\": \"3 cosas que son muy Capelino\", \"action\": null, \"onScreenText\": \"Textura 1: luz dorada.\", \"interaction\": null, \"notes\": null}, {\"label\": \"Frame 2\", \"function\": null, \"action\": null, \"onScreenText\": \"Textura 2: naranja brillante.\", \"interaction\": null, \"notes\": null}, {\"label\": \"Frame 3\", \"function\": null, \"action\": null, \"onScreenText\": \"Textura 3: retro + producto. Texto final: «Esto es Capelino sin decir Capelino.»\", \"interaction\": \"Sin sticker\", \"notes\": \"Hora: 20:30. Construir códigos visuales de marca.\"}]}"
  },
  {
    "title": "Sin set",
    "caption": "Foto de persona adulta con Capelino, gesto natural. Texto: «SIN SET.» → Segundo plano espontáneo + «SIN POSE.»",
    "date": "2026-10-10",
    "hour": "20:30:00+02:00",
    "scheduledAt": "2026-10-10T20:30:00+02:00",
    "objetivo": "Humanizar",
    "productionNotesJson": "{\"format\": \"STORY\", \"concept\": \"Sin set\", \"pillar\": \"PERSONAS / IRL\", \"validateBeforePublish\": \"Humanizar la marca con personas, no solo producto.\", \"kpi\": \"Respuestas / taps\", \"approval\": \"Pendiente\", \"steps\": [{\"label\": \"Frame 1\", \"function\": \"Sin set\", \"action\": null, \"onScreenText\": \"Foto de persona adulta con Capelino, gesto natural. Texto: «SIN SET.»\", \"interaction\": null, \"notes\": null}, {\"label\": \"Frame 2\", \"function\": null, \"action\": null, \"onScreenText\": \"Segundo plano espontáneo + «SIN POSE.»\", \"interaction\": \"Sin sticker\", \"notes\": \"Hora: 20:30. Humanizar la marca con personas, no solo producto.\"}]}"
  },
  {
    "title": "El plan del domingo",
    "caption": "Tres mini fotos en collage: libro / música / terraza. → «ELIGE EL PLAN. NOSOTROS PONEMOS EL NARANJA.»",
    "date": "2026-10-11",
    "hour": "19:30:00+02:00",
    "scheduledAt": "2026-10-11T19:30:00+02:00",
    "objetivo": "Identificación",
    "productionNotesJson": "{\"format\": \"STORY\", \"concept\": \"El plan del domingo\", \"pillar\": \"CULTURA / PLANES\", \"validateBeforePublish\": \"Hablar de estilos de plan, no de consumo.\", \"kpi\": \"Respuestas\", \"approval\": \"Pendiente\", \"steps\": [{\"label\": \"Frame 1\", \"function\": \"El plan del domingo\", \"action\": null, \"onScreenText\": \"Tres mini fotos en collage: libro / música / terraza.\", \"interaction\": null, \"notes\": null}, {\"label\": \"Frame 2\", \"function\": null, \"action\": null, \"onScreenText\": \"«ELIGE EL PLAN. NOSOTROS PONEMOS EL NARANJA.»\", \"interaction\": \"Encuesta: Calma / Calle\", \"notes\": \"Hora: 19:30. Hablar de estilos de plan, no de consumo.\"}]}"
  },
  {
    "title": "Lo que no sale en el Reel",
    "caption": "Vídeo BTS de 3 s colocando mesa/luz. → Toma fallida simpática o cambio de encuadre + «MAÑANA VES EL RESULTADO.»",
    "date": "2026-10-12",
    "hour": "20:30:00+02:00",
    "scheduledAt": "2026-10-12T20:30:00+02:00",
    "objetivo": "Curiosidad estacional",
    "productionNotesJson": "{\"format\": \"STORY\", \"concept\": \"Lo que no sale en el Reel\", \"pillar\": \"BTS / RODAJE\", \"validateBeforePublish\": \"Dar cercanía y mostrar trabajo real.\", \"kpi\": \"Cuenta atrás\", \"approval\": \"Pendiente\", \"steps\": [{\"label\": \"Frame 1\", \"function\": \"Lo que no sale en el Reel\", \"action\": null, \"onScreenText\": \"Vídeo BTS de 3 s colocando mesa/luz.\", \"interaction\": null, \"notes\": null}, {\"label\": \"Frame 2\", \"function\": null, \"action\": null, \"onScreenText\": \"Toma fallida simpática o cambio de encuadre + «MAÑANA VES EL RESULTADO.»\", \"interaction\": \"Sin sticker\", \"notes\": \"Hora: 20:30. Dar cercanía y mostrar trabajo real.\"}]}"
  },
  {
    "title": "Soundtrack Capelino",
    "caption": "Vídeo lento de producto + canción A. → «¿CAMBIAMOS EL MOOD?» + canción B en el segundo frame.",
    "date": "2026-10-14",
    "hour": "20:30:00+02:00",
    "scheduledAt": "2026-10-14T20:30:00+02:00",
    "objetivo": "Cerrar loop",
    "productionNotesJson": "{\"format\": \"STORY\", \"concept\": \"Soundtrack Capelino\", \"pillar\": \"MÚSICA / IDENTIDAD\", \"validateBeforePublish\": \"Aprender preferencias musicales y reforzar cultura de marca.\", \"kpi\": \"Taps / respuestas\", \"approval\": \"Pendiente\", \"steps\": [{\"label\": \"Frame 1\", \"function\": \"Soundtrack Capelino\", \"action\": null, \"onScreenText\": \"Vídeo lento de producto + canción A.\", \"interaction\": null, \"notes\": null}, {\"label\": \"Frame 2\", \"function\": null, \"action\": null, \"onScreenText\": \"«¿CAMBIAMOS EL MOOD?» + canción B en el segundo frame.\", \"interaction\": \"Encuesta: A / B\", \"notes\": \"Hora: 20:30. Aprender preferencias musicales y reforzar cultura de marca.\"}]}"
  },
  {
    "title": "Un objeto, una sombra",
    "caption": "Foto editorial de botella o copa con una sombra fuerte y geometría naranja. Sin titular, solo logo pequeño.",
    "date": "2026-10-15",
    "hour": "20:00:00+02:00",
    "scheduledAt": "2026-10-15T20:00:00+02:00",
    "objetivo": "Precalentar juego",
    "productionNotesJson": "{\"format\": \"STORY\", \"concept\": \"Un objeto, una sombra\", \"pillar\": \"FOTO / DETALLE\", \"validateBeforePublish\": \"Dar descanso visual y mantener sensación premium.\", \"kpi\": \"Cuenta atrás\", \"approval\": \"Pendiente\", \"steps\": [{\"label\": \"Frame 1\", \"function\": \"Un objeto, una sombra\", \"action\": null, \"onScreenText\": \"Foto editorial de botella o copa con una sombra fuerte y geometría naranja. Sin titular, solo logo pequeño.\", \"interaction\": \"Sin sticker\", \"notes\": \"Hora: 20:00. Dar descanso visual y mantener sensación premium.\"}]}"
  },
  {
    "title": "Lo que elegisteis",
    "caption": "Diseño de resultado con la combinación más repetida. → Foto real que represente esa combinación + «VALE. TENÉIS UN PATRÓN.»",
    "date": "2026-10-17",
    "hour": "20:30:00+02:00",
    "scheduledAt": "2026-10-17T20:30:00+02:00",
    "objetivo": "Recompensar",
    "productionNotesJson": "{\"format\": \"STORY\", \"concept\": \"Lo que elegisteis\", \"pillar\": \"COMUNIDAD\", \"validateBeforePublish\": \"Cerrar el loop y demostrar que se escucha a la audiencia.\", \"kpi\": \"Taps\", \"approval\": \"Pendiente\", \"steps\": [{\"label\": \"Frame 1\", \"function\": \"Lo que elegisteis\", \"action\": null, \"onScreenText\": \"Diseño de resultado con la combinación más repetida.\", \"interaction\": null, \"notes\": null}, {\"label\": \"Frame 2\", \"function\": null, \"action\": null, \"onScreenText\": \"Foto real que represente esa combinación + «VALE. TENÉIS UN PATRÓN.»\", \"interaction\": \"Sin sticker\", \"notes\": \"Hora: 20:30. Cerrar el loop y demostrar que se escucha a la audiencia.\"}]}"
  },
  {
    "title": "3 pasos, 3 planos",
    "caption": "Plano 1: hielo. → Plano 2: Capelino. → Plano 3: naranja. Texto final: «SIN MÁS.»",
    "date": "2026-10-18",
    "hour": "19:30:00+02:00",
    "scheduledAt": "2026-10-18T19:30:00+02:00",
    "objetivo": "Retención",
    "productionNotesJson": "{\"format\": \"STORY\", \"concept\": \"3 pasos, 3 planos\", \"pillar\": \"RITUAL VISUAL\", \"validateBeforePublish\": \"Contenido sensorial simple y elegante; variar respecto a encuestas.\", \"kpi\": \"Replays Story\", \"approval\": \"Pendiente\", \"steps\": [{\"label\": \"Frame 1\", \"function\": \"3 pasos, 3 planos\", \"action\": null, \"onScreenText\": \"Plano 1: hielo.\", \"interaction\": null, \"notes\": null}, {\"label\": \"Frame 2\", \"function\": null, \"action\": null, \"onScreenText\": \"Plano 2: Capelino.\", \"interaction\": null, \"notes\": null}, {\"label\": \"Frame 3\", \"function\": null, \"action\": null, \"onScreenText\": \"Plano 3: naranja. Texto final: «SIN MÁS.»\", \"interaction\": \"Sin sticker\", \"notes\": \"Hora: 19:30. Contenido sensorial simple y elegante; variar respecto a encuestas.\"}]}"
  },
  {
    "title": "Está delante de ti",
    "caption": "Escena retro completa con Capelino escondido + «ESTÁ AQUÍ. NO TE DIGO DÓNDE.»",
    "date": "2026-10-19",
    "hour": "20:30:00+02:00",
    "scheduledAt": "2026-10-19T20:30:00+02:00",
    "objetivo": "Reto",
    "productionNotesJson": "{\"format\": \"STORY\", \"concept\": \"Está delante de ti\", \"pillar\": \"JUEGO / TEASER\", \"validateBeforePublish\": \"Precalentar R06 con una imagen distinta al vídeo.\", \"kpi\": \"Cuenta atrás\", \"approval\": \"Pendiente\", \"steps\": [{\"label\": \"Frame 1\", \"function\": \"Está delante de ti\", \"action\": null, \"onScreenText\": \"Escena retro completa con Capelino escondido + «ESTÁ AQUÍ. NO TE DIGO DÓNDE.»\", \"interaction\": \"Sin sticker\", \"notes\": \"Hora: 20:30. Precalentar R06 con una imagen distinta al vídeo.\"}]}"
  }
];

async function main() {
  const clientRs = await db.execute({ sql: `SELECT id FROM clients WHERE name = ?`, args: ["Capelino"] });
  const client = clientRs.rows[0] as unknown as { id: string } | undefined;
  if (!client) {
    console.error('✗ No existe ningún cliente llamado "Capelino".');
    process.exit(1);
  }
  const clientId = client.id;

  const dates = STORY_ITEMS.map((s) => s.date);
  const existingRs = await db.execute({
    sql: `SELECT id, title, scheduledAt, status, productionNotes FROM content_items
          WHERE clientId = ? AND scheduledAt >= ? AND scheduledAt < ?`,
    args: [clientId, "2026-09-21T00:00:00", "2026-10-21T00:00:00"],
  });
  const existing = existingRs.rows as unknown as {
    id: string; title: string; scheduledAt: string; status: string; productionNotes: string | null;
  }[];

  // Solo borramos fichas que ya sean de tipo "Historia" en esas fechas
  // (por si se re-ejecuta el script, o para sustituir las historias de la
  // versión anterior por las nuevas), nunca las 9 piezas de feed ni nada
  // publicado.
  let removed = 0;
  for (const r of existing) {
    const day = r.scheduledAt.slice(0, 10);
    if (!dates.includes(day)) continue;
    if (r.status === "PUBLISHED") continue;
    let isStory = false;
    try {
      isStory = r.productionNotes ? JSON.parse(r.productionNotes)?.format === "STORY" : false;
    } catch {
      isStory = false;
    }
    if (!isStory) continue;
    await db.execute({ sql: `DELETE FROM content_items WHERE id = ?`, args: [r.id] });
    removed++;
  }
  if (removed > 0) console.log(`✓ Borradas ${removed} historia(s) antiguas para sustituirlas por las nuevas.`);

  let inserted = 0;
  for (const item of STORY_ITEMS) {
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
        `https://picsum.photos/seed/capelino-story-${item.date}/600/600`,
        "IMAGE",
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
  console.log(`✓ Creadas ${inserted} historias nuevas (21 días sin publicación de feed), con pilares variados.`);
  console.log('\nYa deberían verse en la pestaña "Historias" de Capelino y en el Calendario general.');
}

main().catch((err) => {
  console.error("✗ ERROR:", err);
  process.exit(1);
});
