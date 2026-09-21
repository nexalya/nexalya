import type { ContentItemWithClient } from "@/lib/db-turso";
import { FORMAT_LABELS, getFormatKey } from "@/components/ContentFormatIcons";

// "Qué ha ido mejor y qué peor" de los últimos N días, calculado
// directamente de las métricas reales guardadas (ver link-instagram +
// metrics/sync) — sin IA de por medio: son solo matemáticas sobre los
// números que ya hay, así que funciona ya mismo, sin depender de la
// ANTHROPIC_API_KEY que todavía falta por conectar para el plan de
// contenido.

const WINDOW_DAYS = 15;

type Scored = {
  item: ContentItemWithClient;
  format: string;
  interactions: number;
  // interacciones / alcance, cuando hay alcance registrado — más justo que
  // comparar alcance en bruto, porque no todas las piezas llegan al mismo
  // número de personas.
  engagementRate: number | null;
};

function scoreItem(item: ContentItemWithClient): Scored {
  const interactions = (item.likes ?? 0) + (item.comments ?? 0) + (item.saves ?? 0) + (item.shares ?? 0);
  const engagementRate = item.reach ? interactions / item.reach : null;
  return { item, format: FORMAT_LABELS[getFormatKey(item)] ?? "Publicación", interactions, engagementRate };
}

function pct(n: number): string {
  return `${(n * 100).toLocaleString("es-ES", { maximumFractionDigits: 1 })}%`;
}

export default function PerformanceAnalysis({ items }: { items: ContentItemWithClient[] }) {
  const since = Date.now() - WINDOW_DAYS * 86400000;
  const recent = items.filter(
    (i) =>
      i.status === "PUBLISHED" &&
      new Date(i.scheduledAt).getTime() >= since &&
      (i.reach != null || i.likes != null || i.comments != null || i.saves != null || i.shares != null)
  );

  if (recent.length === 0) {
    return (
      <div className="card p-4 text-sm text-slate-500">
        Todavía no hay publicaciones con métricas en los últimos {WINDOW_DAYS} días para poder
        comparar. En cuanto vincules más piezas con su publicación real en Instagram (o sincronices
        sus métricas), aquí aparecerá el análisis solo.
      </div>
    );
  }

  const scored = recent.map(scoreItem);

  // Ranking principal: por interacción sobre alcance (engagementRate). Las
  // piezas sin alcance registrado (solo con likes/comments a mano) se
  // listan igual, pero no entran en el ranking de mejor/peor para no
  // comparar cosas que no son comparables.
  const rankable = scored.filter((s) => s.engagementRate != null) as (Scored & { engagementRate: number })[];
  const ranked = [...rankable].sort((a, b) => b.engagementRate - a.engagementRate);
  const best = ranked[0];
  const worst = ranked.length > 1 ? ranked[ranked.length - 1] : null;

  // Media de alcance por formato, para ver si un formato tira más que otro
  // en general (no solo en una pieza suelta).
  const byFormat = new Map<string, { totalReach: number; count: number }>();
  for (const s of scored) {
    if (s.item.reach == null) continue;
    const entry = byFormat.get(s.format) ?? { totalReach: 0, count: 0 };
    entry.totalReach += s.item.reach;
    entry.count += 1;
    byFormat.set(s.format, entry);
  }
  const formatAverages = [...byFormat.entries()]
    .map(([format, { totalReach, count }]) => ({ format, avgReach: Math.round(totalReach / count), count }))
    .sort((a, b) => b.avgReach - a.avgReach);

  return (
    <div className="card p-4 space-y-4">
      <div>
        <h2 className="text-sm font-semibold text-slate-700">
          Análisis de los últimos {WINDOW_DAYS} días
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          {recent.length} publicación{recent.length === 1 ? "" : "es"} con métricas en este periodo
        </p>
      </div>

      <div className="space-y-1.5 text-sm">
        {best && (
          <p className="text-slate-700">
            <span className="font-medium text-emerald-700">Lo que mejor funcionó:</span> &quot;{best.item.title}&quot;
            ({best.format}) — {pct(best.engagementRate)} de interacción sobre el alcance
            {best.item.reach != null ? ` (${best.item.reach.toLocaleString("es-ES")} personas alcanzadas)` : ""}.
          </p>
        )}
        {worst && (
          <p className="text-slate-700">
            <span className="font-medium text-red-700">Lo que menos funcionó:</span> &quot;{worst.item.title}&quot;
            ({worst.format}) — {pct(worst.engagementRate)} de interacción sobre el alcance.
          </p>
        )}
        {formatAverages.length > 1 && (
          <p className="text-slate-500">
            Por formato, el alcance medio fue: {formatAverages.map((f) => `${f.format} ${f.avgReach.toLocaleString("es-ES")}`).join(" · ")}.
            {formatAverages[0] && ` ${formatAverages[0].format} es el que más alcance está dando ahora mismo.`}
          </p>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs text-slate-500">
            <tr>
              <th className="p-2">Publicación</th>
              <th className="p-2">Formato</th>
              <th className="p-2">Alcance</th>
              <th className="p-2">Interacciones</th>
              <th className="p-2">% Interacción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {scored
              .slice()
              .sort((a, b) => (b.engagementRate ?? -1) - (a.engagementRate ?? -1))
              .map((s) => (
                <tr
                  key={s.item.id}
                  className={
                    s.item.id === best?.item.id
                      ? "bg-emerald-50/60"
                      : s.item.id === worst?.item.id
                      ? "bg-red-50/60"
                      : ""
                  }
                >
                  <td className="p-2 max-w-xs truncate">{s.item.title}</td>
                  <td className="p-2 text-slate-500">{s.format}</td>
                  <td className="p-2">{s.item.reach != null ? s.item.reach.toLocaleString("es-ES") : "—"}</td>
                  <td className="p-2">{s.interactions.toLocaleString("es-ES")}</td>
                  <td className="p-2">{s.engagementRate != null ? pct(s.engagementRate) : "—"}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
