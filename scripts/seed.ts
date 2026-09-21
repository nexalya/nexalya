import {
  resetAll,
  createClient,
  createContentItem,
  createPlanBatch,
  createPlanItem,
  createIdeaBankItem,
} from "../lib/db";
import {
  INNOVAPRO_PLAN,
  INNOVAPRO_CONTENT,
  CAPELINO_PLAN,
  CAPELINO_CONTENT,
  CAPELINO_IDEAS,
  INNOVAPRO_PRODUCTION,
  CAPELINO_PRODUCTION,
  INNOVAPRO_STORIES,
  CAPELINO_STORIES,
} from "./real-data";

/**
 * Siembra la base de datos con los DOS clientes reales de Innovapro
 * (Innovapro como marca propia y Capelino como cliente de la agencia),
 * usando el plan editorial que el equipo ya tenía definido en sus propios
 * Excel — no son datos de ejemplo ni contenido generado por IA.
 *
 * Sustituye al seed de demostración (Clínica Dental Sonrisa / PowerFit
 * Gimnasio) porque ya no hace falta: el software está listo para uso real.
 */

const WEEKDAYS_ES = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

function diaSemana(dateStr: string) {
  return WEEKDAYS_ES[new Date(`${dateStr}T00:00:00`).getDay()];
}

const INNOVAPRO_BRIEF = `Tono: técnico pero cercano, orientado a profesionales de centros de estética (no al consumidor final). Objetivo: pasar de la publicación a la conversación por DM/comentario con palabra clave, y de ahí a lead cualificado y demo.

Prioridad comercial de equipos (de mayor a menor): 1) SHR X Ultra, 2) SHR Xn, 3) SHR Xe, 4) HIFU V-10 MAX, 5) Diatermia C-10 Max, 6) ColdSculptor M40 Ultra, 7) Hidrapro H-20, 8) Diatermia T-4 Pro. La prioridad dirige la presencia, no implica que los modelos inferiores en la lista tengan peor calidad.

Reparto editorial (20 piezas de feed): 14 de aparatología (solo los ocho modelos priorizados), 2 de tratamientos, 2 de personas/modelos (confianza y experiencia real, sin testimonios inventados) y 2 de servicio técnico (respaldo, sin rodar el área técnica).

Límites importantes, no negociables: excluir promesas absolutas aunque aparezcan en la web (sin riesgo, indoloro para todos, resultado garantizado, amortización automática). No confirmar cifras contradictorias entre fuentes: número de cabezales de Hidrapro, profundidades de HIFU, kHz/MHz de T-4 Pro — omitir hasta confirmación técnica. Sobre servicio técnico: no prometer 24/7, reparación en 24h, gratuidad ni sustitución automática.

Sistema comercial: cada pieza lleva una palabra clave (ULTRA, XN, XE, HIFU, C10, M40, HIDRA, T4, PEEL, FACIAL, CENTRO, CABINA, RESPALDO). Al comentar o escribir por DM esa palabra clave se abre una conversación guiada (ver guiones de respuesta), se registra el origen y se sigue el embudo hasta demo/venta en el CRM. No hay bots conectados ni anuncios lanzados: todo el seguimiento es manual.

Fuente: fichas de producto de innovapro.es consultadas el 18/09/2026.`;

const CAPELINO_BRIEF = `AUDIENCIA — regla que no se puede saltar en ninguna pieza nueva: contenido y casting siempre dirigidos a público adulto. No presentar el alcohol como solución al estrés, mejora del rendimiento o vía de éxito social.

Objetivo del mes: captar no seguidores y convertir parte de esa atención en visitas al perfil y nuevos seguidores, sin perder el universo visual de Capelino.

Plan contratado: 1 historia al día (2-3 frames cuando hay encuesta/juego) + 2 publicaciones de feed por semana.

Distribución del feed: 9 piezas de captación, 1 de branding/cultura, 1 experimento interactivo. Prioridad: Reels; el carrusel se usa como test.

Regla creativa: primer segundo muy claro — producto, mano/POV, color naranja, movimiento o una pregunta visual. Evitar desarrollos largos antes del payoff.

Rol de Stories: comunidad + investigación (encuestas, A/B, preguntas, BTS y apoyo al Reel). Lo aprendido en Stories alimenta los siguientes Reels.

Familias de contenido: "Immediate Capelino" (producto inmediato/macro/POV, 4-7s), "Capelino Moment" (situación real, personas adultas, aperitivo, lifestyle), "Capelino World" (universo visual propio: surrealismo, retro, lugares imposibles), "The Capelino Test" (juego/elección/comentario/participación).

Baseline de Insights (19 ago-17 sep 2026): 13.422 reproducciones/30d, 3.125 espectadores/30d, 15 nuevos seguidores/30d (objetivo interno: 25), 4,8 seguidores por cada 1.000 espectadores (objetivo: 8), 46,5% de reproducciones desde no seguidores (objetivo: 60%), 389 interacciones/30d. Separar siempre orgánico propio, colaboración y pagado: las colaboraciones con microinfluencers pueden inflar el alcance sin aportar seguidores reales.`;

function main() {
  resetAll();

  // ---------------- INNOVAPRO (marca propia) ----------------
  const innovapro = createClient({
    name: "Innovapro",
    sector: "Fabricación y venta de aparatología estética (láser, HIFU, diatermia, criolipólisis)",
    notes:
      "Cliente real: Innovapro (la propia empresa). Fuente: sistema de contenido interno del equipo y fichas de producto de innovapro.es consultadas el 18/09/2026. Fechas propuestas, no publicaciones programadas — no se ha activado ninguna automatización.",
    brandBrief: INNOVAPRO_BRIEF,
    planPeriodDays: 30,
  });

  const innoBatch = createPlanBatch({
    clientId: innovapro.id,
    periodDays: 30,
    model: null,
    trendsSummary:
      "Plan real ya definido por el equipo de Innovapro (no generado por IA): ventana 21 sept.–20 oct. 2026, 20 piezas de feed (14 aparatología, 2 tratamientos, 2 personas/modelos, 2 servicio técnico) más historias de apoyo cada día. Al pulsar \"Actualizar plan\" con la IA conectada, este calendario se sustituirá por uno nuevo generado a partir de tendencias actuales — de momento se mantiene tal cual lo dejó el equipo.",
  });

  for (const row of INNOVAPRO_PLAN) {
    createPlanItem({
      clientId: innovapro.id,
      planBatchId: innoBatch.id,
      date: row.date,
      day: row.day ?? diaSemana(row.date),
      format: row.format,
      family: row.family,
      topic: row.topic,
      objective: row.objective,
      kpi: row.kpi,
      keyword: row.keyword,
      notes: row.notes,
      status: "IDEA",
    });
  }

  for (const row of INNOVAPRO_CONTENT) {
    const production = INNOVAPRO_PRODUCTION[row.idfeed];
    const stories = INNOVAPRO_STORIES[row.date];
    const productionWithStories =
      production || stories ? { ...(production ?? {}), stories } : null;
    createContentItem({
      clientId: innovapro.id,
      title: row.title,
      caption: row.caption,
      mediaUrl: `https://picsum.photos/seed/inno-${row.idfeed}/600/600`,
      mediaType: row.mediaType,
      platform: "INSTAGRAM",
      scheduledAt: `${row.date}T${row.hour}`,
      status: "DRAFT",
      productionNotes: productionWithStories ? JSON.stringify(productionWithStories) : null,
    });
  }

  // ---------------- CAPELINO (cliente de la agencia) ----------------
  const capelino = createClient({
    name: "Capelino",
    sector: "Bebida / aperitivo (bebida alcohólica) — contenido siempre para audiencia adulta",
    notes:
      "Cliente real: Capelino. Fuente: calendario de captación ya definido por el equipo (21 sept.-31 oct. 2026), con baseline de Insights del 19 ago.-17 sep. 2026. Estado: pendiente, sin programar ni publicar.",
    brandBrief: CAPELINO_BRIEF,
    planPeriodDays: 30,
  });

  const capBatch = createPlanBatch({
    clientId: capelino.id,
    periodDays: 30,
    model: null,
    trendsSummary:
      "Plan real ya definido por el equipo (no generado por IA): calendario de captación 21 sept.-31 oct. 2026, 1 historia/día + 11 publicaciones de feed (9 de captación, 1 de branding, 1 experimento interactivo). Baseline de Insights 19 ago.-17 sep. 2026: 13.422 reproducciones, 15 nuevos seguidores, 4,8 seguidores por 1.000 espectadores. Objetivo del mes: subir a 25 nuevos seguidores y 8 seguidores por 1.000 espectadores. Recuerda: contenido siempre para público adulto, nunca presentar el alcohol como solución al estrés o vía de éxito social.",
  });

  for (const row of CAPELINO_PLAN) {
    createPlanItem({
      clientId: capelino.id,
      planBatchId: capBatch.id,
      date: row.date,
      day: row.day ?? diaSemana(row.date),
      format: row.format,
      family: row.family,
      topic: row.topic,
      objective: row.objective,
      kpi: row.kpi,
      keyword: row.keyword,
      notes: row.notes,
      status: "IDEA",
    });
  }

  for (const row of CAPELINO_CONTENT) {
    const production = CAPELINO_PRODUCTION[row.idfeed];
    const stories = CAPELINO_STORIES[row.date];
    const productionWithStories =
      production || stories ? { ...(production ?? {}), stories } : null;
    createContentItem({
      clientId: capelino.id,
      title: row.title,
      caption: row.caption,
      mediaUrl: `https://picsum.photos/seed/capelino-${row.idfeed}/600/600`,
      mediaType: row.mediaType,
      platform: "INSTAGRAM",
      scheduledAt: `${row.date}T${row.hour}`,
      status: "DRAFT",
      productionNotes: productionWithStories ? JSON.stringify(productionWithStories) : null,
    });
  }

  for (const idea of CAPELINO_IDEAS) {
    createIdeaBankItem({
      clientId: capelino.id,
      planBatchId: capBatch.id,
      priority: idea.priority,
      family: idea.family,
      idea: idea.idea,
      hook: idea.hook,
      execution: idea.execution,
      resources: idea.resources,
      duration: idea.duration,
      objective: idea.objective,
      whenToUse: idea.whenToUse,
    });
  }

  // No se registra lastPlanGeneratedAt: este plan lo hizo el equipo, no la IA.
  // No se crean follower_snapshots: no tenemos un recuento real de seguidores
  // que aportar todavía, y no vamos a inventarlo.

  console.log(
    `Seed real completo: 2 clientes (Innovapro, Capelino), ${INNOVAPRO_PLAN.length + CAPELINO_PLAN.length} elementos de plan, ${INNOVAPRO_CONTENT.length + CAPELINO_CONTENT.length} piezas en calendario, ${CAPELINO_IDEAS.length} ideas de reserva.`
  );
}

main();
