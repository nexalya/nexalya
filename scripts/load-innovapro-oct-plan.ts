// Carga en Nexalya (Turso) el plan de contenido de Innovapro del 1 al 15
// de octubre de 2026, tal y como viene en el Excel "Growth OS" que
// preparaste (calendario + guiones plano a plano + stories diarias +
// copies + bloques de rodaje) — igual que se hizo para Tulaserclinic con
// load-tulaser-oct-plan.ts, pero aquí el contenido no lo redacta la IA:
// se traslada tal cual lo que ya tenías escrito en el Excel.
//
// Qué hace:
//  - 6 publicaciones de feed (R01, C01, R02, R03, C02, R04), cada una con
//    su guion plano a plano / diapositiva a diapositiva, su copy completo
//    (con CTA y hashtags) y su ficha de rodaje (quién aparece, qué
//    material preparar, qué validar antes de publicar) — sacada del
//    bloque de "05_Rodaje_recursos" que corresponde a cada pieza según la
//    columna "Uso".
//  - Para esos 6 días, las stories del Excel que acompañan esa misma
//    publicación (columna "Conecta con") se guardan como una historia
//    enlazada a la pieza, para que también aparezcan en la pestaña
//    "Historias".
//  - Para los otros 9 días del 1 al 15 (los que en el Excel no llevan
//    publicación de feed, solo stories), se crea una historia
//    independiente por día — incluidos los 2 días "teaser" que en el
//    Excel conectan con una publicación de OTRO día (5 oct → adelanta el
//    Reel de HIFU del 8; 9 oct → adelanta el carrusel SHR del 12).
//  - En total: 15 días con historias + 6 publicaciones de feed, sin
//    huecos — pensado para corregir también los días que antes no
//    salían en el calendario de Innovapro.
//
// OJO — esto es una ACTUALIZACIÓN completa del 1-15 de octubre de
// Innovapro: antes de insertar el contenido nuevo, este script BORRA
// cualquier publicación e historia de Innovapro ya existente en ese
// rango de fechas (venga de donde venga: de un plan generado por la IA
// antes, o de una carga anterior de este mismo script), para que el
// calendario quede exactamente como el Excel, sin duplicados ni piezas
// antiguas mezcladas. No toca nada fuera de esas fechas ni de otros
// clientes.
//
// Uso:  npx tsx --env-file=.env.local scripts/load-innovapro-oct-plan.ts

import { createClient } from "@libsql/client";
import { randomUUID } from "node:crypto";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;
if (!url) throw new Error("Falta TURSO_DATABASE_URL en .env.local");
const db = createClient({ url, authToken });

const SOURCE_TAG = "load-innovapro-oct-plan";
const CLIENT_NAME_MATCH = "innovapro";
const RANGE_START = "2026-10-01T00:00:00.000Z";
const RANGE_END = "2026-10-16T00:00:00.000Z";

type Step = {
  label: string;
  function: string;
  action: string;
  onScreenText?: string;
  interaction?: string;
  voiceover?: string;
  notes?: string;
};

type FeedItem = {
  id: string; // ID interno del Excel (R01, C01, ...) — solo para relacionar teasers, no se guarda tal cual
  date: string;
  time: string;
  pillar: string;
  area: string;
  format: "Reel" | "Carrusel";
  topic: string;
  objective: string;
  kpi: string;
  cta: string;
  duration: string;
  caption: string;
  whoAppears: string;
  materials: string;
  validateBeforePublish: string;
  steps: Step[];
  linkedStories: Step[];
};

type StandaloneDay = {
  date: string;
  topic: string;
  teaserFor: string | null; // ID de feed al que hace de teaser (o null)
  frames: Step[];
};

const FEED_ITEMS: FeedItem[] = [
  {
    "id": "R01",
    "date": "2026-10-01",
    "time": "21:15",
    "pillar": "SHR X Ultra",
    "area": "Reach → Consideración",
    "format": "Reel",
    "topic": "Tu equipo más rentable no es el que más promete. Es el que puedes convertir en más servicios.",
    "objective": "Alcance + negocio",
    "kpi": "Compartidos + DMs",
    "cta": "Escribe «ULTRA» y te enviamos información según tu centro.",
    "duration": "16–20 s",
    "caption": "Una inversión en aparatología no debería medirse solo por lo que pone en la ficha técnica.\n\nLa pregunta real es: ¿cuántos servicios puedes construir alrededor de ella y cuánto encaja con la forma de trabajar de tu centro?\n\nSHR X Ultra está pensada para centros que quieren crecer con una plataforma que tenga recorrido, no con una máquina que se quede corta demasiado pronto.\n\nEscribe «ULTRA» por DM y te enviamos información según tu centro.\n#AparatologíaEstética #EstéticaProfesional #EstéticaAvanzada #CentrosDeEstética #SHR #InnovaPro",
    "whoAppears": "No hace falta persona hablando.",
    "materials": "Hero de cada equipo, pantallas, laterales, manípulos, encendidos, desplazamiento suave alrededor del equipo. Planos imprescindibles: Frontal 3/4 · detalle logo · pantalla · manípulos · plano vertical de 5–7 s limpio. Localización: Showroom. Recursos: Showroom + máquina real + manípulos + tratamiento propio. Sin vídeo externo/IA.",
    "validateBeforePublish": "No vídeo externo/IA. Mantener diseño real de máquinas. Nota estratégica: Ángulo B2B nuevo: uso/recorrido en vez de listado de prestaciones.",
    "steps": [
      {
        "label": "0–2s",
        "function": "Hook",
        "action": "Primer plano de máquina y manípulos (showroom)",
        "onScreenText": "NO COMPRES SOLO POTENCIA"
      },
      {
        "label": "2–6s",
        "function": "Desarrollo",
        "action": "Plano medio de la máquina mientras suena la voz en off",
        "voiceover": "Cuando inviertes, no mires solo la ficha técnica"
      },
      {
        "label": "6–11s",
        "function": "Desarrollo",
        "action": "Mostrar distintos manípulos y uso real del equipo",
        "onScreenText": "COMPRA RECORRIDO"
      },
      {
        "label": "11–15s",
        "function": "Desarrollo",
        "action": "Continúa mostrando el equipo en uso mientras suena la voz en off",
        "voiceover": "Mira cuántos servicios puedes construir alrededor de ella"
      },
      {
        "label": "15–18s",
        "function": "CTA",
        "action": "Plano hero de X Ultra + CTA en pantalla",
        "onScreenText": "SHR X ULTRA",
        "notes": "CTA: Escribe «ULTRA» y te enviamos información según tu centro. Hook B / prueba: «¿Comprarías una máquina para usarla solo en un tratamiento?»"
      }
    ],
    "linkedStories": [
      {
        "label": "Frame 1/3",
        "function": "Teaser",
        "action": "Hero X Ultra + manípulos",
        "onScreenText": "¿Una máquina para un solo servicio… o una plataforma con recorrido?",
        "interaction": "Encuesta: «1 servicio / Más recorrido»",
        "notes": "Hora: 12:30 · CTA: Ver Reel / DM ULTRA"
      },
      {
        "label": "Frame 2/3",
        "function": "Educación",
        "action": "Close-ups propios",
        "onScreenText": "Antes de mirar potencia, mira cómo encaja en tu carta de servicios.",
        "interaction": "Slider 🔥",
        "notes": "Hora: 18:30"
      },
      {
        "label": "Frame 3/3",
        "function": "Conversión",
        "action": "Portada del Reel",
        "onScreenText": "Hoy te enseñamos por qué la elección de aparatología empieza por el modelo de negocio.",
        "interaction": "Compartir Reel",
        "notes": "Hora: 20:30 · CTA: DM «ULTRA»"
      }
    ]
  },
  {
    "id": "C01",
    "date": "2026-10-04",
    "time": "21:00",
    "pillar": "Compra inteligente",
    "area": "Consideración → Lead",
    "format": "Carrusel",
    "topic": "5 preguntas que deberías hacer antes de invertir en aparatología.",
    "objective": "Guardados + leads",
    "kpi": "Guardados + DMs",
    "cta": "Escribe «GUÍA» y te ayudamos a ordenar qué necesitas comparar.",
    "duration": "7 slides",
    "caption": "Antes de comprar aparatología, hay preguntas más importantes que «¿cuánta potencia tiene?».\n\nFormación, soporte, consumibles, uso real y encaje con tu modelo de centro pueden marcar la diferencia entre una buena compra y una máquina infrautilizada.\n\nGuarda este carrusel para tu próxima comparación.\n\nSi quieres ordenar tu decisión, escribe «GUÍA» por DM.\n#AparatologíaEstética #GestiónDeCentros #EstéticaProfesional #NegocioEstético #CentrosDeEstética #InnovaPro",
    "whoAppears": "Equipo interno.",
    "materials": "Equipo trabajando, recepción, showroom, manos preparando documentación, entrega/formación si procede. Planos imprescindibles: Planos humanos cortos + recursos de marca. Localización: Showroom / oficina. Recursos: Fotografía propia de máquinas + recursos gráficos corporativos.",
    "validateBeforePublish": "NO grabar servicio técnico/taller. No mostrar procesos internos sensibles. Nota estratégica: El carrusel debe sentirse como herramienta, no catálogo.",
    "steps": [
      {
        "label": "Diapositiva 1",
        "function": "Portada",
        "action": "Fondo limpio corporativo",
        "onScreenText": "5 PREGUNTAS ANTES DE COMPRAR"
      },
      {
        "label": "Diapositiva 2",
        "function": "Desarrollo",
        "action": "Máquina / close-up + frase corta",
        "onScreenText": "¿Qué tratamientos voy a poder construir?"
      },
      {
        "label": "Diapositiva 3",
        "function": "Desarrollo",
        "action": "Máquina / close-up + frase corta",
        "onScreenText": "¿Qué formación recibo?"
      },
      {
        "label": "Diapositiva 4",
        "function": "Desarrollo",
        "action": "Máquina / close-up + frase corta",
        "onScreenText": "¿Qué soporte tendré después?"
      },
      {
        "label": "Diapositiva 5",
        "function": "Desarrollo",
        "action": "Máquina / close-up + frase corta",
        "onScreenText": "¿Qué consumibles / mantenimiento exige?"
      },
      {
        "label": "Diapositiva 6",
        "function": "Desarrollo",
        "action": "Máquina / close-up + frase corta",
        "onScreenText": "¿Encaja con mi volumen real de clientes?"
      },
      {
        "label": "Diapositiva 7",
        "function": "CTA",
        "action": "Slide final con CTA",
        "onScreenText": "La máquina correcta depende del modelo de centro",
        "notes": "CTA: Escribe «GUÍA» y te ayudamos a ordenar qué necesitas comparar."
      }
    ],
    "linkedStories": [
      {
        "label": "Frame 1/3",
        "function": "Teaser",
        "action": "Detalle máquina",
        "onScreenText": "Comprar por ficha técnica es fácil. Comprar para tu negocio es otra cosa.",
        "interaction": "Encuesta: «¿Te ha pasado? Sí / No»",
        "notes": "Hora: 12:30"
      },
      {
        "label": "Frame 2/3",
        "function": "Educación",
        "action": "Mini lista editorial",
        "onScreenText": "Formación, soporte, consumibles, uso real y recorrido. Las 5 preguntas están en el carrusel de hoy.",
        "interaction": "Quiz: «¿Cuál se olvida más?»",
        "notes": "Hora: 18:30"
      },
      {
        "label": "Frame 3/3",
        "function": "Conversión",
        "action": "Portada carrusel",
        "onScreenText": "Guárdalo antes de comparar tu próxima máquina.",
        "interaction": "Compartir publicación",
        "notes": "Hora: 20:15 · CTA: DM «GUÍA»"
      }
    ]
  },
  {
    "id": "R02",
    "date": "2026-10-06",
    "time": "21:15",
    "pillar": "ColdSculptor M40 Ultra",
    "area": "Reach → Deseo",
    "format": "Reel",
    "topic": "El cliente no llega diciendo «quiero criolipólisis». Llega diciendo «quiero trabajar esta zona».",
    "objective": "Alcance + deseo",
    "kpi": "Compartidos + alcance",
    "cta": "DM «M40» para ver cómo encajarlo en tu carta de servicios.",
    "duration": "17–20 s",
    "caption": "El cliente no llega pidiendo criolipólisis. Llega con un objetivo: trabajar una zona, reducir grasa localizada, mejorar el aspecto corporal o complementar su rutina.\n\nPor eso la tecnología debe convertirse en una estrategia de cabina fácil de entender.\n\nColdSculptor M40 Ultra permite plantear trabajo de grasa localizada y estimulación muscular dentro de una misma propuesta profesional.\n\nDM «M40» y te contamos cómo encajarlo en tu carta de servicios.\n#ColdSculptor #AparatologíaEstética #EstéticaCorporal #RemodelaciónCorporal #EstéticaProfesional #InnovaPro",
    "whoAppears": "Profesional + cliente con permiso.",
    "materials": "Aplicación real de crio + palas Sculptor. Manos del profesional y detalles de colocación. Planos imprescindibles: Close-up piel/manípulo · plano medio cabina · equipo completo · detalle palas. Localización: Cabina real. Recursos: Recursos reales propios. Evitar promesas de resultado cuantificadas.",
    "validateBeforePublish": "Sin promesas visuales falsas; usar material real. Nota estratégica: Itera un tema ganador, pero cambia el relato: del nombre técnico al objetivo del cliente.",
    "steps": [
      {
        "label": "0–3s",
        "function": "Hook",
        "action": "Problema visual: zona corporal a tratar"
      },
      {
        "label": "3–7s",
        "function": "Desarrollo",
        "action": "Manípulos de criolipólisis en uso"
      },
      {
        "label": "7–11s",
        "function": "Desarrollo",
        "action": "Palas Sculptor en uso",
        "onScreenText": "GRASA LOCALIZADA + TRABAJO MUSCULAR"
      },
      {
        "label": "11–15s",
        "function": "Desarrollo",
        "action": "Continúa el tratamiento mientras suena la voz en off",
        "onScreenText": "1 ESTRATEGIA DE CABINA",
        "voiceover": "Reducción de grasa localizada + trabajo muscular dentro de una estrategia de cabina"
      },
      {
        "label": "15–19s",
        "function": "CTA",
        "action": "Equipo completo + CTA en pantalla",
        "notes": "CTA: DM «M40» para ver cómo encajarlo en tu carta de servicios. Hook B / prueba: «Dos objetivos que el cliente entiende mejor que dos nombres de tecnología»"
      }
    ],
    "linkedStories": [
      {
        "label": "Frame 1/3",
        "function": "Problema",
        "action": "Plano corporal real",
        "onScreenText": "Tu cliente no suele pedir «tecnología». Pide un objetivo.",
        "interaction": "Encuesta: «Volumen / Tono»",
        "notes": "Hora: 12:30"
      },
      {
        "label": "Frame 2/3",
        "function": "Educación",
        "action": "M40 + manípulos",
        "onScreenText": "Por eso la comunicación debe empezar por lo que quiere conseguir, no por el nombre del manípulo.",
        "interaction": "",
        "notes": "Hora: 18:30"
      },
      {
        "label": "Frame 3/3",
        "function": "Conversión",
        "action": "Portada Reel",
        "onScreenText": "Hoy: grasa localizada + trabajo muscular dentro de una estrategia de cabina.",
        "interaction": "Compartir Reel",
        "notes": "Hora: 20:30 · CTA: DM «M40»"
      }
    ]
  },
  {
    "id": "R03",
    "date": "2026-10-08",
    "time": "21:15",
    "pillar": "HIFU V-10 MAX",
    "area": "Reach → Autoridad",
    "format": "Reel",
    "topic": "El error es ofrecer HIFU como si todas las zonas necesitaran lo mismo.",
    "objective": "Autoridad + alcance",
    "kpi": "Retención + DMs",
    "cta": "Escribe «HIFU» y te enviamos la información técnica.",
    "duration": "18–22 s",
    "caption": "El HIFU no se entiende solo por la potencia.\n\nZona, plano y objetivo cambian la forma de trabajar. Por eso, disponer de distintas profundidades tiene sentido cuando sabes cuándo utilizar cada una.\n\nHIFU V-10 MAX lleva esa decisión a un protocolo más preciso y adaptable.\n\nEscribe «HIFU» y te enviamos la información técnica.\n#HIFU #HIFUV10MAX #AparatologíaEstética #EstéticaAvanzada #MedicinaEstética #InnovaPro",
    "whoAppears": "Profesional + cliente con permiso.",
    "materials": "Manípulo, cartuchos/transductores, pantalla, facial y corporal. Planos imprescindibles: Macro manípulo · cambio de cartucho · desplazamiento · plano hero final. Localización: Cabina / showroom. Recursos: Vídeo propio; gráficos simples de profundidad si se usan, siempre de marca.",
    "validateBeforePublish": "No modificar transductores; gráficos solo complementarios. Nota estratégica: Contenido técnico pero traducido a decisión clínica/comercial.",
    "steps": [
      {
        "label": "0–2s",
        "function": "Hook",
        "action": "Close-up del manípulo HIFU",
        "onScreenText": "NO TODO HIFU SE TRABAJA IGUAL"
      },
      {
        "label": "2–6s",
        "function": "Desarrollo",
        "action": "Plano medio mientras suena la voz en off",
        "voiceover": "La clave está en elegir plano y objetivo"
      },
      {
        "label": "6–12s",
        "function": "Desarrollo",
        "action": "Mostrar cartuchos y profundidades de forma visual",
        "onScreenText": "PLANO · ZONA · OBJETIVO"
      },
      {
        "label": "12–16s",
        "function": "Desarrollo",
        "action": "Tratamiento facial y corporal"
      },
      {
        "label": "16–20s",
        "function": "CTA",
        "action": "Equipo V-10 MAX + logo TECMOVE + CTA en pantalla",
        "onScreenText": "V-10 MAX",
        "notes": "CTA: Escribe «HIFU» y te enviamos la información técnica. Hook B / prueba: «4 profundidades no significan 4 tratamientos iguales»"
      }
    ],
    "linkedStories": [
      {
        "label": "Frame 1/3",
        "function": "Teaser",
        "action": "Cartuchos HIFU",
        "onScreenText": "4 profundidades no significan 4 tratamientos iguales.",
        "interaction": "Quiz: «¿De qué depende?»",
        "notes": "Hora: 12:30"
      },
      {
        "label": "Frame 2/3",
        "function": "Autoridad",
        "action": "Tratamiento propio",
        "onScreenText": "Plano + zona + objetivo. Así se construye una indicación con sentido.",
        "interaction": "",
        "notes": "Hora: 18:30"
      },
      {
        "label": "Frame 3/3",
        "function": "Conversión",
        "action": "Portada Reel",
        "onScreenText": "Te lo enseñamos en el Reel de hoy.",
        "interaction": "Compartir Reel",
        "notes": "Hora: 20:30 · CTA: DM «HIFU»"
      }
    ]
  },
  {
    "id": "C02",
    "date": "2026-10-12",
    "time": "21:15",
    "pillar": "SHR X Ultra / Xn / Xe",
    "area": "Consideración → Lead",
    "format": "Carrusel",
    "topic": "No necesitas saber qué SHR es «mejor». Necesitas saber qué debe resolver en tu centro.",
    "objective": "Guardados + lead",
    "kpi": "Guardados + leads",
    "cta": "DM «SHR» + te hacemos 3 preguntas y te orientamos.",
    "duration": "7 slides",
    "caption": "Xn, Xe o X Ultra.\n\nLa pregunta no es cuál es «mejor». La pregunta es cuál encaja con tu volumen de trabajo, los servicios que quieres ofrecer, tu espacio, tu inversión y el recorrido que buscas para el centro.\n\nEn este carrusel te dejamos 3 escenarios para saber qué deberías comparar antes de elegir.\n\nEscribe «SHR» por DM y te hacemos 3 preguntas para orientarte.\n#SHR #DepilaciónProfesional #AparatologíaEstética #CentrosDeEstética #EstéticaProfesional #InnovaPro",
    "whoAppears": "No hace falta persona hablando.",
    "materials": "Hero de cada equipo, pantallas, laterales, manípulos, encendidos, desplazamiento suave alrededor del equipo. Planos imprescindibles: Frontal 3/4 · detalle logo · pantalla · manípulos · plano vertical de 5–7 s limpio. Localización: Showroom. Recursos: Fotos propias X Ultra/Xn/Xe + diseño comparativo limpio.",
    "validateBeforePublish": "No vídeo externo/IA. Mantener diseño real de máquinas. Nota estratégica: Renueva la comparativa anterior: no competir por especificaciones, sino por adecuación al centro.",
    "steps": [
      {
        "label": "Diapositiva 1",
        "function": "Portada",
        "action": "Fondo limpio corporativo",
        "onScreenText": "3 ESCENARIOS PARA ELEGIR TU SHR"
      },
      {
        "label": "Diapositiva 2",
        "function": "Desarrollo",
        "action": "Escenario 1",
        "onScreenText": "Tu prioridad es volumen de depilación"
      },
      {
        "label": "Diapositiva 3",
        "function": "Desarrollo",
        "action": "Escenario 2",
        "onScreenText": "Quieres ampliar tu carta de servicios"
      },
      {
        "label": "Diapositiva 4",
        "function": "Desarrollo",
        "action": "Escenario 3",
        "onScreenText": "Buscas una inversión con recorrido"
      },
      {
        "label": "Diapositiva 5",
        "function": "Desarrollo",
        "action": "Pregunta de diagnóstico",
        "onScreenText": "¿Presupuesto, espacio o ritmo de trabajo?"
      },
      {
        "label": "Diapositiva 6",
        "function": "Desarrollo",
        "action": "Cierre conceptual",
        "onScreenText": "Xn, Xe o X Ultra: la elección empieza por tu modelo de trabajo"
      },
      {
        "label": "Diapositiva 7",
        "function": "CTA",
        "action": "Slide final con CTA",
        "notes": "CTA: DM «SHR» + te hacemos 3 preguntas y te orientamos."
      }
    ],
    "linkedStories": [
      {
        "label": "Frame 1/3",
        "function": "Teaser",
        "action": "Tres equipos / detalles",
        "onScreenText": "Xn, Xe o X Ultra: la pregunta no es cuál es mejor. Es qué necesitas resolver.",
        "interaction": "Encuesta: «¿Estás comparando? Sí / Aún no»",
        "notes": "Hora: 12:30"
      },
      {
        "label": "Frame 2/3",
        "function": "Educación",
        "action": "Diseño checklist",
        "onScreenText": "Volumen, servicios, espacio, inversión y recorrido: compara variables, no solo nombres.",
        "interaction": "Slider",
        "notes": "Hora: 18:30"
      },
      {
        "label": "Frame 3/3",
        "function": "Conversión",
        "action": "Portada carrusel",
        "onScreenText": "Hoy te dejamos 3 escenarios para ordenar la decisión.",
        "interaction": "Compartir publicación",
        "notes": "Hora: 20:30 · CTA: DM «SHR»"
      }
    ]
  },
  {
    "id": "R04",
    "date": "2026-10-14",
    "time": "21:15",
    "pillar": "C-10 Max",
    "area": "Consideración → Conversión",
    "format": "Reel",
    "topic": "La diatermia no se vende sola. Se vende cuando el cliente entiende el protocolo.",
    "objective": "Autoridad + negocio",
    "kpi": "DMs + guardados",
    "cta": "DM «C10» y te enseñamos cómo presentarlo dentro de tu carta.",
    "duration": "18–22 s",
    "caption": "Tener diatermia no significa que esté integrada en tu negocio.\n\nLa diferencia está en cómo la incorporas a protocolos faciales y corporales, cómo la explicas y en qué momento del recorrido del cliente la utilizas.\n\nC-10 Max gana valor cuando deja de ser «una sesión» y pasa a formar parte de una estrategia de tratamiento.\n\nDM «C10» y te enseñamos cómo presentarlo dentro de tu carta.\n#Diatermia #C10Max #EstéticaProfesional #AparatologíaEstética #ProtocolosEstéticos #InnovaPro",
    "whoAppears": "Profesional + cliente con permiso.",
    "materials": "Tratamientos facial y corporal, manípulo, pantalla, cambio de zona. Planos imprescindibles: Plano facial · corporal · detalle equipo · plano manos profesional. Localización: Cabina real. Recursos: Tratamientos y máquina propios. No prometer resultados médicos.",
    "validateBeforePublish": "Recursos propios. Nota estratégica: Aprovecha la tracción reciente del C-10, pero con enfoque de negocio y protocolo.",
    "steps": [
      {
        "label": "0–3s",
        "function": "Hook",
        "action": "Tratamiento facial/corporal en curso",
        "onScreenText": "NO VENDAS SOLO SESIONES"
      },
      {
        "label": "3–7s",
        "function": "Desarrollo",
        "action": "Plano medio mientras suena la voz en off",
        "voiceover": "Una tecnología puede entrar en muchos momentos del recorrido del cliente"
      },
      {
        "label": "7–13s",
        "function": "Desarrollo",
        "action": "Mostrar 2–3 aplicaciones sin saturar",
        "onScreenText": "DISEÑA PROTOCOLOS"
      },
      {
        "label": "13–18s",
        "function": "Desarrollo",
        "action": "Continúa mientras suena la voz en off",
        "voiceover": "La diferencia está en cómo la integras"
      },
      {
        "label": "18–21s",
        "function": "CTA",
        "action": "Equipo + CTA en pantalla",
        "onScreenText": "C-10 MAX",
        "notes": "CTA: DM «C10» y te enseñamos cómo presentarlo dentro de tu carta."
      }
    ],
    "linkedStories": [
      {
        "label": "Frame 1/3",
        "function": "Teaser",
        "action": "Tratamiento C-10",
        "onScreenText": "¿Qué es más difícil: vender una sesión o explicar un protocolo?",
        "interaction": "Encuesta: «Sesión / Protocolo»",
        "notes": "Hora: 12:30"
      },
      {
        "label": "Frame 2/3",
        "function": "Negocio",
        "action": "Facial + corporal",
        "onScreenText": "La tecnología tiene más valor cuando el cliente entiende para qué entra en su recorrido.",
        "interaction": "",
        "notes": "Hora: 18:30"
      },
      {
        "label": "Frame 3/3",
        "function": "Conversión",
        "action": "Portada Reel",
        "onScreenText": "Reel nuevo: cómo pasar de «tener diatermia» a integrarla de verdad.",
        "interaction": "Compartir Reel",
        "notes": "Hora: 20:30 · CTA: DM «C10»"
      }
    ]
  }
];

const STANDALONE_DAYS: StandaloneDay[] = [
  {
    "date": "2026-10-02",
    "topic": "Negocio",
    "teaserFor": null,
    "frames": [
      {
        "label": "Frame 1/2",
        "function": "Interacción",
        "action": "Fondo showroom + máquina",
        "onScreenText": "Una máquina parada no factura. ¿Cuántas horas al día se usa tu equipo principal?",
        "interaction": "Encuesta: «<3 h / 3–6 h / +6 h»",
        "notes": "Hora: 12:30"
      },
      {
        "label": "Frame 2/2",
        "function": "Lead",
        "action": "Texto sobre recurso real",
        "onScreenText": "Si quieres, te ayudamos a detectar qué servicio te falta para aprovechar mejor tu cabina.",
        "interaction": "Caja: «¿Qué tratamientos ofreces ahora?»",
        "notes": "Hora: 20:30 · CTA: Responder caja"
      }
    ]
  },
  {
    "date": "2026-10-03",
    "topic": "Asesoramiento",
    "teaserFor": null,
    "frames": [
      {
        "label": "Frame 1/2",
        "function": "Confianza",
        "action": "Equipo comercial / showroom",
        "onScreenText": "Antes de recomendarte una máquina, necesitamos entender 3 cosas: qué tienes, qué te piden y qué quieres crecer.",
        "interaction": "",
        "notes": "Hora: 13:00"
      },
      {
        "label": "Frame 2/2",
        "function": "Lead",
        "action": "Diseño limpio",
        "onScreenText": "Dinos tu tratamiento más vendido y te decimos qué variable miraríamos al elegir aparatología.",
        "interaction": "Caja de preguntas",
        "notes": "Hora: 20:30 · CTA: Responder"
      }
    ]
  },
  {
    "date": "2026-10-05",
    "topic": "HIFU V-10 MAX",
    "teaserFor": "R03",
    "frames": [
      {
        "label": "Frame 1/2",
        "function": "Curiosidad",
        "action": "Manípulo HIFU",
        "onScreenText": "¿Crees que todas las zonas se trabajan a la misma profundidad?",
        "interaction": "Encuesta: «Sí / No»",
        "notes": "Hora: 12:30"
      },
      {
        "label": "Frame 2/2",
        "function": "Educación",
        "action": "Cartuchos/transductores",
        "onScreenText": "La respuesta es NO. Zona, plano y objetivo cambian la decisión. El jueves lo vemos visualmente.",
        "interaction": "Cuenta atrás / recordatorio",
        "notes": "Hora: 20:30"
      }
    ]
  },
  {
    "date": "2026-10-07",
    "topic": "ColdSculptor",
    "teaserFor": null,
    "frames": [
      {
        "label": "Frame 1/2",
        "function": "Educación",
        "action": "Tratamiento real",
        "onScreenText": "Mito: la remodelación corporal solo se comunica antes del verano.",
        "interaction": "Encuesta: «Mito / Realidad»",
        "notes": "Hora: 12:30"
      },
      {
        "label": "Frame 2/2",
        "function": "Negocio",
        "action": "Showroom / tratamiento",
        "onScreenText": "La necesidad existe todo el año. Lo que cambia es cómo presentas el protocolo.",
        "interaction": "Pregunta: «¿Lo comunicas todo el año?»",
        "notes": "Hora: 20:30"
      }
    ]
  },
  {
    "date": "2026-10-09",
    "topic": "SHR Xn",
    "teaserFor": "C02",
    "frames": [
      {
        "label": "Frame 1/2",
        "function": "Consideración",
        "action": "Detalle Xn",
        "onScreenText": "No elijas tu SHR por el nombre del modelo.",
        "interaction": "",
        "notes": "Hora: 12:30"
      },
      {
        "label": "Frame 2/2",
        "function": "Lead",
        "action": "Diseño con 3 opciones",
        "onScreenText": "¿Qué pesa más en tu decisión? volumen de trabajo, servicios que quieres añadir o inversión.",
        "interaction": "Encuesta / quiz 3 opciones",
        "notes": "Hora: 20:30 · CTA: DM «SHR»"
      }
    ]
  },
  {
    "date": "2026-10-10",
    "topic": "Hidrapro H-20",
    "teaserFor": null,
    "frames": [
      {
        "label": "Frame 1/2",
        "function": "Negocio",
        "action": "Hidrapro en cabina",
        "onScreenText": "Un tratamiento de entrada puede ser el inicio de un recorrido, no el final.",
        "interaction": "Encuesta: «Entrada / Protocolo»",
        "notes": "Hora: 12:30"
      },
      {
        "label": "Frame 2/2",
        "function": "Lead",
        "action": "Recurso facial propio",
        "onScreenText": "¿Qué tratamiento utilizas para captar a un cliente nuevo en tu centro?",
        "interaction": "Caja de preguntas",
        "notes": "Hora: 20:30 · CTA: Responder"
      }
    ]
  },
  {
    "date": "2026-10-11",
    "topic": "T-4 Pro",
    "teaserFor": null,
    "frames": [
      {
        "label": "Frame 1/2",
        "function": "Interacción",
        "action": "T-4 Pro / manípulo",
        "onScreenText": "En tu centro, ¿la diatermia se trabaja más en facial, corporal o ambos?",
        "interaction": "Encuesta: «Facial / Corporal / Ambos»",
        "notes": "Hora: 12:30"
      },
      {
        "label": "Frame 2/2",
        "function": "Autoridad",
        "action": "Tratamiento propio",
        "onScreenText": "La tecnología gana valor cuando sabes dónde integrarla dentro de tus protocolos.",
        "interaction": "",
        "notes": "Hora: 20:30 · CTA: DM «T4»"
      }
    ]
  },
  {
    "date": "2026-10-13",
    "topic": "Postventa",
    "teaserFor": null,
    "frames": [
      {
        "label": "Frame 1/2",
        "function": "Confianza",
        "action": "Equipo/showroom, no taller",
        "onScreenText": "Comprar la máquina es el día 1.",
        "interaction": "",
        "notes": "Hora: 12:30"
      },
      {
        "label": "Frame 2/2",
        "function": "Conversión",
        "action": "Equipo comercial / pantalla de soporte",
        "onScreenText": "Después importan la formación, el acompañamiento y el soporte. Eso también forma parte de la inversión.",
        "interaction": "Caja: «¿Qué valoras más después de comprar?»",
        "notes": "Hora: 20:30 · CTA: DM «SOPORTE»"
      }
    ]
  },
  {
    "date": "2026-10-15",
    "topic": "Captación",
    "teaserFor": null,
    "frames": [
      {
        "label": "Frame 1/3",
        "function": "Lead",
        "action": "Showroom amplio",
        "onScreenText": "¿Estás pensando en incorporar aparatología antes de cerrar el año?",
        "interaction": "Encuesta: «Sí / Estoy valorando»",
        "notes": "Hora: 12:30"
      },
      {
        "label": "Frame 2/3",
        "function": "Diagnóstico",
        "action": "Diseño 1-2-3",
        "onScreenText": "Te hacemos un mapa rápido: 1) qué tienes 2) qué vendes más 3) qué quieres añadir.",
        "interaction": "",
        "notes": "Hora: 18:30"
      },
      {
        "label": "Frame 3/3",
        "function": "Conversión",
        "action": "Equipo comercial / marca",
        "onScreenText": "Escríbenos «MAPA» y te hacemos las primeras preguntas antes de pasarte con un asesor.",
        "interaction": "Caja: «MAPA»",
        "notes": "Hora: 20:30 · CTA: DM «MAPA»"
      }
    ]
  }
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
  console.log(`Actualizando plan de octubre (1-15) para "${client.name}" (${client.id})…`);

  // Borra TODO lo que ya hubiera para Innovapro en ese rango de fechas
  // (piezas de feed e historias, generadas por la IA o por una ejecución
  // anterior de este script), para dejar el calendario exactamente como
  // el Excel — sin huecos ni duplicados.
  const existingRs = await db.execute({
    sql: `SELECT id FROM content_items WHERE clientId = ? AND scheduledAt >= ? AND scheduledAt < ?`,
    args: [client.id, RANGE_START, RANGE_END],
  });
  const existingIds = (existingRs.rows as unknown as { id: string }[]).map((r) => r.id);
  for (const id of existingIds) {
    await db.execute({ sql: `DELETE FROM plan_items WHERE contentItemId = ?`, args: [id] });
    await db.execute({ sql: `DELETE FROM content_items WHERE id = ?`, args: [id] });
  }
  if (existingIds.length > 0) {
    console.log(`✓ Eliminadas ${existingIds.length} pieza(s) que ya existían para Innovapro entre el 1 y el 15 de octubre.`);
  }

  const nowIso = new Date().toISOString();
  const batchId = randomUUID();
  await db.execute({
    sql: `INSERT INTO plan_batches (id, clientId, periodDays, trendsSummary, model, createdAt) VALUES (?, ?, ?, ?, ?, ?)`,
    args: [
      batchId,
      client.id,
      15,
      "Plan trasladado tal cual desde el Excel \"Growth OS\" preparado a mano: 6 piezas de feed (SHR X Ultra, compra inteligente, ColdSculptor M40 Ultra, HIFU V-10 MAX, familia SHR, C-10 Max) con guion plano a plano / diapositiva a diapositiva, copy y ficha de rodaje por pieza, más historias diarias del 1 al 15 (incluye 2 días teaser que adelantan una pieza de feed próxima).",
      "manual",
      nowIso,
    ],
  });

  const contentIdByFeedId: Record<string, string> = {};

  let feedCreated = 0;
  for (const item of FEED_ITEMS) {
    const isReel = item.format === "Reel";
    const contentId = randomUUID();
    contentIdByFeedId[item.id] = contentId;
    const scheduledAt = new Date(`${item.date}T${item.time}:00`).toISOString();

    const productionNotes = {
      format: item.format,
      concept: item.topic,
      pillar: item.pillar,
      area: item.area,
      duration: item.duration,
      approval: "Pendiente",
      whoAppears: item.whoAppears,
      materials: item.materials,
      validateBeforePublish: item.validateBeforePublish,
      kpi: item.kpi,
      cta: item.cta,
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
        `https://picsum.photos/seed/innovapro-oct-${contentId}/600/600`,
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
        `Guion completo, copy y ficha de rodaje en el detalle de la pieza. [${SOURCE_TAG}]`,
        contentId,
        nowIso,
        nowIso,
      ],
    });

    // Historia independiente del mismo día, enlazada a esta pieza de feed,
    // para que también aparezca en la pestaña "Historias".
    if (item.linkedStories.length > 0) {
      const storyId = randomUUID();
      const storyNotes = {
        format: "STORY",
        concept: `Stories del ${item.date} — apoyo a "${item.topic}"`,
        approval: "Pendiente",
        steps: item.linkedStories,
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
          `https://picsum.photos/seed/innovapro-oct-story-${storyId}/600/600`,
          "IMAGE",
          "INSTAGRAM",
          scheduledAt,
          JSON.stringify(storyNotes),
          nowIso,
          nowIso,
        ],
      });
    }

    feedCreated++;
  }

  let storiesCreated = 0;
  for (const day of STANDALONE_DAYS) {
    const storyId = randomUUID();
    const scheduledAt = new Date(`${day.date}T12:30:00`).toISOString();
    const teaserNote = day.teaserFor
      ? ` Adelanta la publicación "${
          FEED_ITEMS.find((f) => f.id === day.teaserFor)?.topic ?? day.teaserFor
        }" (${day.teaserFor}), programada para el ${
          FEED_ITEMS.find((f) => f.id === day.teaserFor)?.date ?? "?"
        }.`
      : "";
    const productionNotes = {
      format: "STORY",
      concept: day.topic + teaserNote,
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
        `https://picsum.photos/seed/innovapro-oct-story-${storyId}/600/600`,
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

  console.log(`✓ ${feedCreated} publicaciones de feed creadas (Calendario + Plan de contenido IA), cada una con su guion, copy y ficha de rodaje.`);
  console.log(`✓ ${feedCreated} historias enlazadas a esas publicaciones + ${storiesCreated} historias independientes (incluye 2 teaser) = ${feedCreated + storiesCreated} historias en total.`);
  console.log(`✓ Del 1 al 15 de octubre quedan cubiertos los 15 días, sin huecos.`);
  console.log(`✓ Ya debería verse todo en Nexalya para ${client.name}.`);
}

main().catch((err) => {
  console.error("✗ ERROR:", err);
  process.exit(1);
});
