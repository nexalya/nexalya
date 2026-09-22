import type { Client, PlanItem, IdeaBankItem, ContentItemWithClient } from "@/lib/db-turso";

/**
 * Generación del plan de contenido con IA.
 *
 * Usa la Messages API de Claude con la tool de búsqueda web (server-side:
 * Claude decide cuándo buscar y Anthropic ejecuta la búsqueda por su
 * cuenta, así que basta con UNA llamada, sin implementar un bucle de
 * tool-use nosotros mismos).
 *
 * Requiere la variable de entorno ANTHROPIC_API_KEY (ver README, sección
 * "Conectar la IA del plan de contenido"). Sin ella, generateContentPlan
 * lanza un error legible que la UI muestra al usuario.
 */

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const DEFAULT_MODEL = process.env.CLAUDE_MODEL || "claude-sonnet-5";

// Un paso del guion: una escena de un Reel, una diapositiva de un carrusel,
// o un frame de una story. Mismo formato para los tres casos — solo cambia
// lo que representa "label" (franja de tiempo, "Diapositiva N" o "Frame N").
export type ProductionStep = {
  label?: string;
  function?: string; // Hook | Desarrollo | CTA | Portada | ...
  action?: string; // qué grabar/diseñar exactamente
  onScreenText?: string;
  voiceover?: string;
  notes?: string;
};

export type ProductionSheet = {
  whoAppears?: string;
  materials?: string;
  validateBeforePublish?: string; // límites de marca a revisar antes de publicar
  approval?: string; // "Pendiente" por defecto
  steps?: ProductionStep[];
  // Stories de apoyo de ese mismo día (2-3 frames), igual que "Stories
  // diarias" en el Excel original: independientes del formato del feed.
  stories?: ProductionStep[];
};

export type PlanItemInput = {
  date: string; // YYYY-MM-DD
  day?: string;
  format?: string;
  family?: string;
  topic?: string;
  objective?: string;
  kpi?: string;
  keyword?: string;
  notes?: string;
  // Texto de la publicación ya redactado, listo para revisar y pulir. Con
  // esto el plan mensual no se queda solo en la tabla de temas: cada fila
  // se convierte directamente en un borrador real en el calendario (ver
  // app/api/clients/[id]/plan/route.ts).
  caption?: string;
  // Guion de producción (plano a plano / diapositiva a diapositiva / frame
  // a frame) para que el equipo sepa exactamente qué grabar o diseñar, sin
  // tener que inventarlo cada mes desde cero.
  production?: ProductionSheet;
};

export type IdeaBankItemInput = {
  priority?: string;
  family?: string;
  idea: string;
  hook?: string;
  execution?: string;
  resources?: string;
  duration?: string;
  objective?: string;
  whenToUse?: string;
};

export type GeneratedPlan = {
  trendsSummary: string;
  plan: PlanItemInput[];
  ideas: IdeaBankItemInput[];
  model: string;
};

const WEEKDAYS_ES = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

// Banco de 50 estructuras de hook (ganchos de apertura) para Reels que
// buscan viralidad — captación de seguidores o ventas. Vienen de una
// plantilla de referencia del sector (no son frases propias de ningún
// cliente): la IA las usa como INSPIRACIÓN de estructura, nunca literales
// — cada hueco ("_", "X", "Y", "[grupo]", "[plataforma]") se sustituye
// siempre por algo real y concreto de la marca en cuestión. Solo se usan
// cuando el objetivo de la pieza es de captación/alcance/ventas (ver
// buildPrompt) — el resto del plan sigue igual.
const VIRAL_HOOKS = [
  "No sé por qué no había hablado de esto antes, pero...",
  "¿Cómo es posible que esto no esté petándolo ya?",
  "¿Hay algo peor que _?",
  "No sé vosotros, pero yo siempre he pensado que...",
  "¿Alguien más se ha dado cuenta de que...?",
  "Nadie me va a quitar de la cabeza que _",
  "Tu recordatorio diario de que...",
  "No me puedo creer que acabe de hacer esto",
  "Si odias X, te va a encantar X",
  "Se ha cumplido mi peor pesadilla...",
  "Cosas que ojalá hubiera sabido antes, así que te las cuento:",
  "Ya no me lo guardo más para mí...",
  "Mi camino con _ ha sido una montaña rusa",
  "Esto es lo más fácil que vas a probar en tu vida",
  "Vamos a probar algo nuevo juntos",
  "Créeme: _ va a invadir tu feed en nada",
  "Esto no se lo he contado a nadie...",
  "He probado _ para que tú no tengas que hacerlo",
  "Siento ser yo quien te lo diga, pero...",
  "¿Por qué nadie está hablando de _?",
  "Opinión impopular: X es mejor que Y",
  "Esto me cambió por completo",
  "Sin ánimo de exagerar, pero...",
  "Esto es tu señal para hacer _ de una vez",
  "Cosas que nadie te cuenta sobre _",
  "Si te quedas con una cosa hoy, que sea esta",
  "Si eres _ y te cuesta _, esto te interesa",
  "El cambio que me hizo ganar _€",
  "Esto no debería ni poder contarlo",
  "Esto es solo para [grupo]. Si no lo eres, sigue deslizando...",
  "Te lo voy a decir con todo el cariño del mundo...",
  "_ vs _: ¿quién lo hace mejor?",
  "La forma más rápida de _",
  "No me odies, pero _",
  "Me juego lo que quieras a que _",
  "No tengo plan B, así que esto tiene que salir bien...",
  "Esto te va a cambiar la forma de _",
  "¿Soy el único que acaba de descubrir _?",
  "Bienvenido al lado de [plataforma] donde _",
  "Nadie me cree cuando les digo lo fácil que es _",
  "Esto tiene pinta de fallo en la Matrix, pero _",
  "Haz lo que quieras, pero _",
  "Se me ha acabado la paciencia...",
  "Y ya que estamos con _, te digo otra cosa: _",
  "No puedo parar de _",
  "Dame _ minutos y te convenzo de _",
  "He estado _ durante una semana y esto es lo que pasó",
  "Nadie me avisó de lo difícil que iba a ser _",
  "Llevo demasiado tiempo guardándome _",
  "Si hay algo que deberías estar haciendo ahora mismo, es esto...",
];

/**
 * Devuelve el desfase horario (en horas enteras) de Europe/Madrid respecto
 * a UTC para una fecha dada, calculado con Intl en vez de asumir un valor
 * fijo — así funciona igual en horario de invierno (CET, +01:00) que en
 * horario de verano (CEST, +02:00), sin tener que llevar la cuenta a mano
 * de cuándo cambia el reloj cada año.
 */
function madridOffsetHours(dateStr: string): number {
  const probe = new Date(`${dateStr}T12:00:00Z`);
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Madrid",
    timeZoneName: "shortOffset",
  }).formatToParts(probe);
  const tzPart = parts.find((p) => p.type === "timeZoneName")?.value || "GMT+1";
  const match = tzPart.match(/GMT([+-]\d+)/);
  return match ? parseInt(match[1], 10) : 1;
}

/**
 * Construye un ISO 8601 con el desfase horario de Madrid ya incluido
 * (p.ej. "2026-10-05T13:00:00+02:00"), para que la hora que se ve en el
 * calendario sea la hora real de Madrid y no se desplace 1-2h al
 * guardarse como si fuera UTC.
 */
export function madridScheduledAt(dateStr: string, hour: number, minute = 0): string {
  const offset = madridOffsetHours(dateStr);
  const sign = offset >= 0 ? "+" : "-";
  const abs = String(Math.abs(offset)).padStart(2, "0");
  return `${dateStr}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00${sign}${abs}:00`;
}

/**
 * Hora de publicación por defecto para un borrador auto-generado, según
 * el formato: los reels (vídeo) se proponen por la tarde-noche, el resto
 * a mediodía. Son solo valores de partida — el equipo puede cambiarlos.
 */
export function defaultHourForFormat(format?: string): number {
  return (format || "").toLowerCase().includes("reel") ? 20 : 13;
}

/**
 * Intenta sacar el formato (Reel/Carrusel/Post/Historia) guardado en
 * productionNotes de una pieza, igual que hace el badge del calendario
 * (ver app/clients/[id]/page.tsx) — para poder agrupar el rendimiento
 * real por formato en el resumen que se manda a la IA.
 */
function formatFromProductionNotes(productionNotes: string | null): string {
  if (productionNotes) {
    try {
      const parsed = JSON.parse(productionNotes) as { format?: string | null };
      if (parsed.format) return parsed.format;
    } catch {
      // no es JSON válido, seguimos con el fallback
    }
  }
  return "";
}

/**
 * Resume el rendimiento REAL (no estimado) de las publicaciones ya
 * publicadas y con métricas — vía Instagram conectado (ver
 * /api/content/[id]/link-instagram) o tecleadas a mano — para que el
 * generador de plan pueda razonar qué formatos/temas repetir o
 * abandonar, en vez de proponer a ciegas cada vez.
 */
function buildPerformanceContext(items: ContentItemWithClient[]): string {
  const withMetrics = items
    .filter(
      (i) =>
        i.status === "PUBLISHED" &&
        (i.reach != null || i.likes != null || i.comments != null || i.saves != null || i.shares != null)
    )
    .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime())
    .slice(0, 15);

  if (withMetrics.length === 0) {
    return "Todavía no hay publicaciones con métricas reales registradas para esta cuenta — no hay " +
      "datos propios de rendimiento que analizar por ahora, así que apóyate solo en las tendencias " +
      "del sector y el criterio profesional.";
  }

  const lines = withMetrics.map((i) => {
    const format = formatFromProductionNotes(i.productionNotes) || (i.mediaType === "VIDEO" ? "Reel" : "Post");
    const date = i.scheduledAt.slice(0, 10);
    const metrics = [
      i.reach != null ? `alcance ${i.reach}` : null,
      i.likes != null ? `likes ${i.likes}` : null,
      i.comments != null ? `comentarios ${i.comments}` : null,
      i.saves != null ? `guardados ${i.saves}` : null,
      i.shares != null ? `compartidos ${i.shares}` : null,
      i.profileVisits != null ? `visitas a perfil ${i.profileVisits}` : null,
      i.followersGained != null ? `seguidores ganados ${i.followersGained}` : null,
    ]
      .filter(Boolean)
      .join(", ");
    return `- ${date} · ${format} · "${i.title}" → ${metrics || "sin métricas numéricas, solo publicada"}`;
  });

  return `Resultados REALES (de Instagram, no estimados) de las últimas publicaciones de esta
cuenta, de más reciente a más antigua:
${lines.join("\n")}

Antes de proponer nada, analiza qué formato/tema/ángulo dio mejor resultado (más alcance,
guardados o comentarios en relación al resto) y cuál dio peor, y que se note en el plan: repite
o escala lo que funcionó, y cambia de ángulo o formato lo que no. Si detectas un patrón claro,
dilo explícitamente en "trendsSummary".`;
}

function buildPrompt(
  client: Client,
  periodDays: number,
  recentContext: string,
  performanceContext: string
) {
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);

  let pillars: ContentPillar[] = [];
  try {
    pillars = client.contentPillars ? JSON.parse(client.contentPillars) : [];
  } catch {
    pillars = [];
  }
  const pillarsBlock = pillars.length
    ? `Universo de marca ya definido — usa estas series como líneas editoriales ("family")\n  en vez de inventar otras nuevas, repartiendo las piezas del plan según su mezcla:\n${pillars
        .map((p) => `  - ${p.name} (~${p.mixPercent}%): ${p.description}`)
        .join("\n")}`
    : "Universo de marca: todavía no definido para este cliente — propón tú líneas\n  editoriales coherentes y anúncialas en trendsSummary, para poder fijarlas después.";

  return `Eres la o el estratega de contenido de una agencia de marketing. Tienes que crear
un plan de contenido de ${periodDays} días para esta marca, empezando el ${todayStr}.

FICHA DE LA MARCA
- Nombre: ${client.name}
- Sector: ${client.sector || "no especificado"}
- Cuenta de Instagram: ${client.igHandle || "no especificada"}
- Web: ${client.website || "no especificada"}
- Público objetivo: ${client.targetAudience || "no especificado; usa buen criterio para el sector indicado"}
- Competencia / diferenciación: ${client.competitors || "no especificada"}
- Tono de voz: ${client.toneOfVoice || "no especificado; usa un tono profesional y cercano"}
- Qué evitar / límites no negociables (legal, marca, sensibilidad): ${client.avoidTopics || "ninguno indicado"}
- Identidad visual (colores, estética, qué NO usar visualmente): ${client.visualIdentity || "no especificada"}
- Notas internas: ${client.notes || "ninguna"}
- Notas adicionales del brief: ${client.brandBrief || "ninguna"}
- ${pillarsBlock}

Trata "Qué evitar / límites no negociables" como límites DUROS, no como sugerencias: si
incluye normativa citada (por sector regulado), respétala literalmente en cada pieza, no
solo de forma genérica. Si la ficha marca una diferenciación frente a la competencia, que se
note en el ángulo de las piezas, no solo en el tono. Si falta algún dato para una pieza
concreta (una cifra, un plazo, un resultado) y no está en la ficha ni en el contexto, no lo
inventes: dilo explícitamente en la pieza (por ejemplo en "notes" o "validateBeforePublish")
en vez de rellenarlo con un dato plausible.

${recentContext}

${performanceContext}

TAREA
1. Busca en la web tendencias de contenido ACTUALES (de esta semana o el último mes) para
   el sector de esta marca en redes sociales (formatos que están funcionando, temas de
   conversación, retos o sonidos si aplica). Usa la tool de búsqueda web para esto. Si la
   ficha de la marca nombra competidores concretos, busca también qué están publicando
   ellos ahora mismo (qué formatos usan, qué ángulos, con qué frecuencia) para que el plan
   se diferencie de verdad, no solo lo diga de boquilla. Combina esto con el análisis de
   rendimiento propio de más abajo: no son dos cosas separadas, el plan final tiene que
   reflejar ambas cosas a la vez.
2. Con esas tendencias y la ficha de la marca, crea un calendario editorial de ${periodDays}
   días: entre 2 y 4 publicaciones de feed por semana (reels, carruseles o posts) más una
   nota de qué contar en stories esos días. No repitas siempre el mismo formato ni el mismo
   tema. Para cada pieza, redacta también el texto de la publicación (caption) ya casi listo
   para publicar, respetando el tono del brief de marca: esto se guarda directamente como
   borrador en el calendario, así que tiene que poder usarse revisando solo detalles, no
   reescribiéndolo desde cero.
3. Cuando el "objective" de una pieza sea de captación de seguidores, alcance o ventas (no
   para piezas de comunidad, información de servicio, etc.), usa este banco de estructuras
   de hook viral como INSPIRACIÓN para el gancho inicial (el "topic", el arranque del
   "caption" y el primer paso "Hook" de production.steps) — adapta siempre la estructura a
   esta marca en concreto y a su tono: nunca dejes huecos sin rellenar (nada de "_", "X",
   "Y", "[grupo]" o "[plataforma]" literales en el resultado final) y no repitas la misma
   estructura de hook dos veces en el mismo plan:
${VIRAL_HOOKS.map((h) => `   - ${h}`).join("\n")}
4. Para cada pieza, añade también un guion de producción ("production") para que el equipo
   sepa exactamente qué grabar o diseñar, sin tener que improvisarlo el día de la grabación:
   - Si el formato es Reel: una lista de pasos "steps", uno por escena, con franja de tiempo
     (label, ej. "0-4 s"), función (Hook / Desarrollo / CTA), qué grabar exactamente (action),
     texto en pantalla (onScreenText), voz en off o diálogo literal (voiceover) y notas de
     edición (notes). Entre 4 y 7 escenas según la duración.
   - Si el formato es Carrusel o Post: una lista de "steps", uno por diapositiva, con label
     ("Diapositiva 1", "Diapositiva 2"...), función (Portada / Desarrollo / CTA), el texto
     literal para diseñar (onScreenText) y qué foto o composición usar (action). Entre 4 y 6
     diapositivas.
   Además, casi siempre (salvo que ese día no toque nada en stories), añade "stories": una
   lista de 2-3 frames de apoyo para ESE MISMO DÍA — independiente del formato del feed, con
   label ("Frame 1", "Frame 2"...), texto literal (onScreenText), qué mostrar (action) y qué
   interacción usar si aplica (notes, ej. "Encuesta: Sí / No", "Cuenta atrás").
   Añade también quién aparece en la pieza (whoAppears), qué material o atrezzo hay que
   preparar (materials), y qué límites del brief de marca hay que revisar antes de publicar
   esta pieza en concreto (validateBeforePublish) — esto es lo más importante: respeta
   siempre los límites no negociables del brief, no los repitas genéricos si el brief da
   detalle concreto.
5. Añade también un "banco de ideas" de reserva: 4 a 6 ideas adicionales, con más detalle de
   ejecución, para sustituir piezas que no funcionen o para escalar las que funcionen bien.
6. Responde ÚNICAMENTE con un bloque de código \`\`\`json que contenga un objeto con esta forma
   exacta (sin texto antes ni después del bloque de código):

{
  "trendsSummary": "3-5 frases: qué tendencias/competencia encontraste, qué patrón de rendimiento propio detectaste (qué funcionó y qué no, con datos si los hay) y cómo influyó todo eso en el plan",
  "plan": [
    {
      "date": "YYYY-MM-DD",
      "format": "Reel | Carrusel | Post | Stories",
      "family": "línea editorial o familia de contenido",
      "topic": "tema o hook concreto de la pieza",
      "objective": "objetivo de esta pieza (captación, comunidad, venta...)",
      "kpi": "métrica principal a vigilar",
      "keyword": "palabra clave corta para identificarla",
      "notes": "qué contar en las stories de ese día, o instrucciones para el equipo",
      "caption": "texto de la publicación ya redactado en español, tono de la marca: 2-4 frases + llamada a la acción + hasta 5 hashtags relevantes. Debe poder publicarse casi tal cual, solo revisando",
      "production": {
        "whoAppears": "quién aparece en la pieza (persona, solo producto, voz en off...)",
        "materials": "material, atrezzo o localización que hay que preparar antes de grabar/diseñar",
        "validateBeforePublish": "límites concretos del brief de marca a revisar antes de publicar esta pieza",
        "approval": "Pendiente",
        "steps": [
          {
            "label": "franja de tiempo o 'Diapositiva N' o 'Frame N' según el formato",
            "function": "Hook | Desarrollo | CTA | Portada",
            "action": "qué grabar o diseñar exactamente en este paso",
            "onScreenText": "texto literal en pantalla de este paso, si lo hay",
            "voiceover": "voz en off o diálogo literal de este paso, si lo hay (solo Reels)",
            "notes": "nota de edición o de interacción de este paso"
          }
        ],
        "stories": [
          {
            "label": "Frame 1",
            "onScreenText": "texto literal de este frame de story",
            "action": "qué mostrar en este frame",
            "notes": "interacción si aplica (encuesta, caja de preguntas, cuenta atrás...)"
          }
        ]
      }
    }
  ],
  "ideas": [
    {
      "priority": "Alta | Media | Baja",
      "family": "línea editorial",
      "idea": "nombre corto de la idea",
      "hook": "frase gancho",
      "execution": "cómo se ejecuta en pocas palabras",
      "resources": "qué necesita (localización, atrezzo...)",
      "duration": "duración estimada si es vídeo",
      "objective": "objetivo",
      "whenToUse": "cuándo usarla (ej. si tal pieza funciona bien)"
    }
  ]
}`;
}

export async function generateContentPlan(
  client: Client,
  opts?: {
    recentPlanItems?: PlanItem[];
    recentIdeas?: IdeaBankItem[];
    // Publicaciones ya reales (con o sin métricas) del calendario de este
    // cliente, para poder analizar qué funcionó — ver buildPerformanceContext.
    recentPublishedItems?: ContentItemWithClient[];
  }
): Promise<GeneratedPlan> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Falta ANTHROPIC_API_KEY. Añade tu clave de API en el archivo .env.local (ver README) y reinicia el servidor."
    );
  }

  const periodDays = client.planPeriodDays || 30;

  let recentContext = "Esta es la primera vez que se genera un plan para esta marca.";
  if (opts?.recentPlanItems?.length) {
    const sample = opts.recentPlanItems
      .slice(-10)
      .map((p) => `- ${p.date}: ${p.format ?? ""} · ${p.topic ?? ""}`)
      .join("\n");
    recentContext = `Ya se publicaron o planificaron estas piezas recientemente; NO las repitas:\n${sample}`;
  }

  const performanceContext = buildPerformanceContext(opts?.recentPublishedItems ?? []);

  const prompt = buildPrompt(client, periodDays, recentContext, performanceContext);

  const res = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      // Con el guion de producción (plano a plano / diapositiva a
      // diapositiva) por pieza, la respuesta es bastante más larga que
      // antes de tener solo el tema y el copy.
      max_tokens: 8192,
      messages: [{ role: "user", content: prompt }],
      tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 5 }],
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Error llamando a la API de Claude (${res.status}): ${errBody.slice(0, 300)}`);
  }

  const data = await res.json();
  const textBlocks: string[] = (data.content || [])
    .filter((b: { type: string }) => b.type === "text")
    .map((b: { text: string }) => b.text);
  const fullText = textBlocks.join("\n");

  const match = fullText.match(/```json\s*([\s\S]*?)\s*```/) || fullText.match(/(\{[\s\S]*\})/);
  if (!match) {
    throw new Error("Claude no devolvió el plan en el formato esperado. Respuesta: " + fullText.slice(0, 500));
  }

  let parsed: { trendsSummary?: string; plan?: PlanItemInput[]; ideas?: IdeaBankItemInput[] };
  try {
    parsed = JSON.parse(match[1]);
  } catch {
    throw new Error("No se pudo interpretar el JSON devuelto por Claude.");
  }

  const plan = (parsed.plan || []).map((p) => ({
    ...p,
    day: p.day || WEEKDAYS_ES[new Date(p.date).getDay()],
  }));

  return {
    trendsSummary: parsed.trendsSummary || "",
    plan,
    ideas: parsed.ideas || [],
    model: DEFAULT_MODEL,
  };
}

// ---------- Analizar una marca ya existente (botón "Analizar con IA") ----------
//
// Para un cliente nuevo, en vez de arrancar de un brief en blanco: si ya
// tiene Instagram o web, le pedimos a Claude que los busque y lea, y que
// proponga un borrador de las preguntas del brief. El equipo revisa y
// corrige antes de guardar — esto no sustituye su criterio, solo evita
// partir de cero. Usa una llamada a la API por análisis (con búsqueda
// web), igual que generar un plan.

// Una "serie" del universo de marca: una línea de contenido recurrente con
// nombre propio (ej. "Mitos vs. Realidad", "The Capelino Effect") y el
// porcentaje de la mezcla de contenido que le corresponde. La suma de
// mixPercent de todas las series de un cliente debería rondar el 100%,
// pero no se fuerza en código — es una guía para el generador de plan, no
// una regla matemática exacta.
export type ContentPillar = {
  name: string;
  description: string;
  mixPercent: number;
};

export type BrandAnalysis = {
  targetAudience: string;
  competitors: string;
  avoidTopics: string;
  toneOfVoice: string;
  visualIdentity: string;
  contentPillars: ContentPillar[];
  summary: string;
};

export async function analyzeExistingBrand(input: {
  name: string;
  sector?: string | null;
  igHandle?: string | null;
  website?: string | null;
}): Promise<BrandAnalysis> {
  if (!input.igHandle && !input.website) {
    throw new Error("Añade la cuenta de Instagram o la web del cliente para poder analizarla.");
  }
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Falta ANTHROPIC_API_KEY. Añade tu clave de API en el archivo .env.local (ver README) y reinicia el servidor."
    );
  }

  const prompt = `Eres la o el estratega de contenido de una agencia de marketing. Un cliente
${input.igHandle || input.website ? "ya tiene presencia online" : "es una marca nueva"} y hay
que preparar el brief de marca antes de generar su primer plan de contenido. No te limites a
rellenar campos sueltos: el objetivo es un análisis tan afinado como el que haría alguien que
conoce bien la marca, no una suposición genérica de agencia.

DATOS DEL CLIENTE
- Nombre: ${input.name || "no especificado"}
- Sector: ${input.sector || "no especificado"}
- Cuenta de Instagram: ${input.igHandle || "no especificada"}
- Web: ${input.website || "no especificada"}

TAREA

1. Busca en la web la cuenta de Instagram y/o la web indicadas (y cualquier otra presencia
   pública relevante de esta marca: Google, prensa del sector, etc.). Fíjate en qué publican,
   cómo hablan, a quién parecen dirigirse, y cómo se ven visualmente. Si no encuentras nada
   público (cuenta nueva, privada, o web sin contenido), dilo claramente en el resumen y
   propón valores razonables basados solo en el sector, dejando claro que son una suposición
   de partida a validar con el cliente, no un hallazgo. No inventes datos concretos (cifras de
   seguidores, resultados, fechas) que no hayas encontrado de verdad.

2. Competencia real, no solo una lista de nombres. Busca 2-4 competidores directos reales de
   esta marca (mismo sector, zona o público). Para cada uno, mira brevemente qué están
   haciendo en redes (temas, tono, formatos). Con eso, en vez de limitarte a nombrarlos,
   propón en qué terreno debería diferenciarse ESTA marca de ellos — un ángulo, tono o tipo de
   contenido que los competidores no estén ocupando ya. Esa diferenciación es el dato más
   importante del campo "competitors", más que la lista en sí.

3. Investigación de normativa si el sector está regulado. Antes de escribir "avoidTopics",
   valora si el sector de esta marca tiene restricciones legales de publicidad en España/UE
   (alcohol, tabaco, juego y apuestas, productos sanitarios o tratamientos estéticos/médicos,
   servicios financieros o de inversión, productos dirigidos a menores, suplementos con
   reclamos de salud...). Si es así, busca en la web la normativa real aplicable (Ley General
   de Publicidad, autorregulación del sector, Autocontrol, normativa autonómica si aplica,
   etc.) y cita en "avoidTopics" las restricciones concretas que encuentres (ej. "no asociar
   el consumo a mejora del rendimiento, éxito social o efectos estimulantes/sedantes — Ley
   34/1988 y normativa autonómica"), no una advertencia genérica de "cumplir la ley". Si el
   sector no está regulado de forma especial, indica solo los límites propios de marca/marca
   personal que veas (reclamos sin evidencia, temas sensibles, mencionar competidores por
   nombre, etc.) sin inventar normativa que no aplica.

4. Universo de marca: propón entre 3 y 5 series de contenido recurrentes con nombre propio
   (ej. "Antes/Después", "Mitos vs. Realidad", un formato-entrevista con nombre...), pensadas
   para esta marca y sector concretos — no genéricas de cualquier cuenta. Para cada serie,
   escribe de qué trata en una frase y qué porcentaje de la mezcla total de contenido le
   correspondería, de forma que los porcentajes de todas las series sumen (aproximadamente)
   100. Esto es lo que mantendrá consistencia entre lotes de plan generados en momentos
   distintos, en vez de improvisar líneas editoriales nuevas cada vez.

5. Responde ÚNICAMENTE con un bloque de código \`\`\`json con esta forma exacta (sin texto
   antes ni después):

{
  "summary": "2-3 frases: qué encontraste (o que no encontraste nada) y de dónde sale cada dato",
  "targetAudience": "público objetivo: quién los sigue o a quién parecen dirigirse (edad, intereses, necesidad que cubren)",
  "competitors": "quiénes son los competidores reales, qué hacen, y sobre todo cómo debería diferenciarse esta marca de ellos",
  "toneOfVoice": "cómo hablan: formal/cercano, con humor o serio, tuteo o usted, rasgos concretos del tono que ya usan",
  "avoidTopics": "límites no negociables: normativa real citada si el sector está regulado, más los límites propios de marca",
  "visualIdentity": "colores, estética y estilo visual que ya usan (o, si no hay nada público, una propuesta razonable para el sector)",
  "contentPillars": [
    { "name": "nombre de la serie", "description": "de qué trata en una frase", "mixPercent": 30 }
  ]
}`;

  const res = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      // Con la investigación de competencia/normativa y el universo de
      // marca (varias series con descripción), la respuesta es más larga
      // que el brief original de 5 campos sueltos.
      max_tokens: 3072,
      messages: [{ role: "user", content: prompt }],
      tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 8 }],
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Error llamando a la API de Claude (${res.status}): ${errBody.slice(0, 300)}`);
  }

  const data = await res.json();
  const textBlocks: string[] = (data.content || [])
    .filter((b: { type: string }) => b.type === "text")
    .map((b: { text: string }) => b.text);
  const fullText = textBlocks.join("\n");

  const match = fullText.match(/```json\s*([\s\S]*?)\s*```/) || fullText.match(/(\{[\s\S]*\})/);
  if (!match) {
    throw new Error("Claude no devolvió el análisis en el formato esperado. Respuesta: " + fullText.slice(0, 500));
  }

  let parsed: Partial<BrandAnalysis>;
  try {
    parsed = JSON.parse(match[1]);
  } catch {
    throw new Error("No se pudo interpretar el JSON devuelto por Claude.");
  }

  const rawPillars: unknown = (parsed as { contentPillars?: unknown }).contentPillars;
  const contentPillars: ContentPillar[] = Array.isArray(rawPillars)
    ? rawPillars
        .filter((p): p is Record<string, unknown> => !!p && typeof p === "object")
        .map((p) => ({
          name: String(p.name || "").trim(),
          description: String(p.description || "").trim(),
          mixPercent: Number(p.mixPercent) || 0,
        }))
        .filter((p) => p.name)
    : [];

  return {
    summary: parsed.summary || "",
    targetAudience: parsed.targetAudience || "",
    competitors: parsed.competitors || "",
    toneOfVoice: parsed.toneOfVoice || "",
    avoidTopics: parsed.avoidTopics || "",
    visualIdentity: parsed.visualIdentity || "",
    contentPillars,
  };
}
