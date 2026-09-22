import type { ReactNode } from "react";
import { PLATFORM_LABELS, type Platform } from "@/lib/types";
import StatusBadge from "@/components/StatusBadge";

// Todo el detalle de una pieza (guion, plano a plano, stories, copies,
// material a preparar...). Vive aparte porque se usa en DOS sitios: la
// pestaña "Guion y rodaje" (una por una, en una página) y el desplegable
// de cada fila del calendario (ver CalendarRow.tsx) — para no repetir
// ~250 líneas de JSX en dos archivos que tendrían que mantenerse en sync.

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("es-ES", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  }).format(new Date(iso));
}

type ProductionStep = {
  label?: string | null;
  function?: string | null;
  action?: string | null;
  onScreenText?: string | null;
  voiceover?: string | null;
  notes?: string | null;
};

type ScreenTextLine = {
  label?: string | null;
  text?: string | null;
};

// Distintos clientes traen guiones con forma distinta: Innovapro llega con tabla
// plano a plano (steps); otros clientes, como TulaserClinic, llegan con texto en
// pantalla cronometrado + locución literal en un único bloque. Todos los campos
// son opcionales a propósito para que cada pieza muestre solo lo que trae.
type ProductionSheet = {
  format?: string | null;
  concept?: string | null;
  pillar?: string | null;
  area?: string | null;
  duration?: string | null;
  audioType?: string | null;
  whoAppears?: string | null;
  materials?: string | null;
  validateBeforePublish?: string | null;
  editing?: string | null;
  kpi?: string | null;
  cta?: string | null;
  approval?: string | null;
  steps?: ProductionStep[];
  stories?: ProductionStep[];
  structureNote?: string | null;
  screenText?: ScreenTextLine[];
  voiceoverScript?: string | null;
  visualOpening?: string | null;
  visualRest?: string | null;
  closingCta?: string | null;
  voiceDirection?: string | null;
};

function parseProduction(raw: string | null): ProductionSheet | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ProductionSheet;
  } catch {
    return null;
  }
}

function StepsTable({ steps, voiceoverColumn }: { steps: ProductionStep[]; voiceoverColumn: boolean }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs text-slate-500">
          <tr>
            <th className="p-2">Paso</th>
            <th className="p-2">Función</th>
            <th className="p-2">Qué grabar / diseñar</th>
            <th className="p-2">Texto en pantalla</th>
            {voiceoverColumn && <th className="p-2">Voz / diálogo</th>}
            <th className="p-2">Notas</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {steps.map((step, idx) => (
            <tr key={idx}>
              <td className="p-2 whitespace-nowrap text-slate-500">{step.label || `#${idx + 1}`}</td>
              <td className="p-2 text-slate-500">{step.function || ""}</td>
              <td className="p-2 max-w-xs">{step.action || ""}</td>
              <td className="p-2 max-w-xs text-slate-600">{step.onScreenText || ""}</td>
              {voiceoverColumn && <td className="p-2 max-w-xs text-slate-500">{step.voiceover || ""}</td>}
              <td className="p-2 max-w-xs text-slate-400">{step.notes || ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return <h3 className="text-sm font-semibold text-slate-700 mt-2">{children}</h3>;
}

function ScreenTextTable({ lines }: { lines: ScreenTextLine[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs text-slate-500">
          <tr>
            <th className="p-2 whitespace-nowrap">Tiempo</th>
            <th className="p-2">Texto exacto en pantalla</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {lines.map((l, idx) => (
            <tr key={idx}>
              <td className="p-2 whitespace-nowrap text-slate-500">{l.label || `#${idx + 1}`}</td>
              <td className="p-2 text-slate-700">{l.text || ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ProductionDetail({
  item,
}: {
  item: {
    title: string;
    caption: string;
    mediaType: string;
    platform: string;
    productionNotes: string | null;
    scheduledAt: string;
    // El estado real de la pieza (el mismo que el desplegable de arriba del
    // todo) — la insignia de esta cabecera se pinta a partir de AQUÍ, no del
    // campo "approval" suelto del guion, para que nunca puedan contradecirse
    // (antes podía decir "Diseño terminado" arriba y "Pendiente" aquí abajo).
    status: string;
  };
}) {
  const production = parseProduction(item.productionNotes);
  const isStory = production?.format === "STORY";
  const isReel = item.mediaType === "VIDEO" && !isStory;
  const hasSteps = !!production?.steps?.length;
  const hasStoriesSection = !!production?.stories?.length;
  const hasScreenText = !!production?.screenText?.length;
  const hasExactScript =
    hasScreenText || !!production?.voiceoverScript || !!production?.visualOpening || !!production?.visualRest;

  return (
    <div className="space-y-4">
      {/* Cabecera de la pieza */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium">{item.title}</span>
            <span className="text-xs text-slate-400">
              {PLATFORM_LABELS[item.platform as Platform] ?? item.platform}
            </span>
            <span className="text-xs rounded-full px-2 py-0.5 bg-slate-100 text-slate-600">
              {isStory ? "Story" : isReel ? "Vídeo / Reel" : "Imagen / Carrusel"}
            </span>
            {production?.pillar && (
              <span className="text-xs rounded-full px-2 py-0.5 bg-indigo-50 text-indigo-700">
                {production.pillar}
              </span>
            )}
            {production?.area && (
              <span className="text-xs rounded-full px-2 py-0.5 bg-slate-100 text-slate-500">
                {production.area}
              </span>
            )}
            {production?.duration && <span className="text-xs text-slate-400">{production.duration}</span>}
          </div>
          <p className="text-xs text-slate-400 mt-1 capitalize">
            {formatDate(item.scheduledAt)}
            {production?.concept ? ` · ${production.concept}` : ""}
            {production?.audioType ? ` · Audio: ${production.audioType}` : ""}
          </p>
        </div>
        <StatusBadge status={item.status} />
      </div>

      {!production && (
        <div className="text-sm text-slate-400 bg-slate-50 rounded-lg p-3">
          Esta pieza todavía no tiene guion de producción (las creadas a mano con
          &quot;+ Programar contenido&quot; no lo llevan; genera el plan con la IA para que
          aparezca aquí).
        </div>
      )}

      {hasSteps && (
        <div>
          <SectionTitle>
            {isStory ? "Story: frame a frame" : isReel ? "Reels: plano a plano" : "Post: diapositiva a diapositiva"}
          </SectionTitle>
          <StepsTable steps={production!.steps!} voiceoverColumn={isReel} />
        </div>
      )}

      {hasStoriesSection && (
        <div>
          <SectionTitle>Stories diarias</SectionTitle>
          <StepsTable steps={production!.stories!} voiceoverColumn={false} />
        </div>
      )}

      {!hasSteps && hasExactScript && (
        <div>
          <SectionTitle>Guion exacto: texto en pantalla y locución</SectionTitle>
          {production?.structureNote && (
            <p className="text-sm text-slate-500 italic mt-1">{production.structureNote}</p>
          )}
          {hasScreenText && (
            <div className="mt-2">
              <ScreenTextTable lines={production!.screenText!} />
            </div>
          )}
          {production?.voiceoverScript && (
            <div className="bg-slate-50 rounded-lg p-3 text-sm text-slate-700 mt-2 whitespace-pre-line">
              <div className="text-xs font-medium text-slate-500 mb-1">Locución exacta (voz en off)</div>
              {production.voiceoverScript}
            </div>
          )}
          {(production?.visualOpening || production?.visualRest) && (
            <div className="grid sm:grid-cols-2 gap-3 text-sm mt-2">
              {production?.visualOpening && (
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="text-xs font-medium text-slate-500 mb-1">Visual 0–5 s</div>
                  <div className="text-slate-700">{production.visualOpening}</div>
                </div>
              )}
              {production?.visualRest && (
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="text-xs font-medium text-slate-500 mb-1">Visual resto de la pieza</div>
                  <div className="text-slate-700">{production.visualRest}</div>
                </div>
              )}
            </div>
          )}
          {(production?.closingCta || production?.voiceDirection) && (
            <div className="grid sm:grid-cols-2 gap-3 text-xs text-slate-500 mt-2">
              {production?.closingCta && <div>Cierre en pantalla: {production.closingCta}</div>}
              {production?.voiceDirection && <div>Dirección de voz: {production.voiceDirection}</div>}
            </div>
          )}
        </div>
      )}

      {!hasSteps && !hasExactScript && production?.structureNote && (
        <div>
          <SectionTitle>Guion / estructura</SectionTitle>
          <p className="text-sm text-slate-600 mt-1">{production.structureNote}</p>
        </div>
      )}

      <div>
        <SectionTitle>Copies y rodaje</SectionTitle>
        <div className="bg-slate-50 rounded-lg p-3 text-sm text-slate-700 mt-1 whitespace-pre-line">
          {item.caption}
        </div>
        {production && (
          <div className="grid sm:grid-cols-3 gap-3 text-sm mt-2">
            <div className="bg-slate-50 rounded-lg p-3">
              <div className="text-xs font-medium text-slate-500 mb-1">Quién aparece / fuente visual</div>
              <div className="text-slate-700">{production.whoAppears || "—"}</div>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <div className="text-xs font-medium text-slate-500 mb-1">Material a preparar</div>
              <div className="text-slate-700">{production.materials || "—"}</div>
            </div>
            <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
              <div className="text-xs font-medium text-amber-700 mb-1">Validar antes de publicar</div>
              <div className="text-slate-700">{production.validateBeforePublish || "—"}</div>
            </div>
          </div>
        )}
        {production && (production.editing || production.kpi || production.cta) && (
          <div className="grid sm:grid-cols-3 gap-3 text-xs text-slate-500 mt-2">
            {production.cta && <div>CTA: {production.cta}</div>}
            {production.editing && <div>Edición: {production.editing}</div>}
            {production.kpi && <div>KPI: {production.kpi}</div>}
          </div>
        )}
      </div>
    </div>
  );
}
