"use client";

import { useEffect, useMemo, useRef, useState } from "react";

// Gráficos de la analítica, en SVG propio (sin librerías): una sola serie
// por gráfico y un solo eje — si hay que comparar dos medidas con escalas
// distintas (alcance y % de interacción), van en gráficos separados, uno
// al lado del otro, en vez de un gráfico con dos ejes.

export type ChartPoint = { date: string; value: number | null };

const SERIES = "#004042"; // brand-600, petróleo de Nexalya
const SERIES_SOFT = "#245b5c"; // brand-500

function niceMax(max: number): number {
  if (max <= 0) return 1;
  const pow = 10 ** Math.floor(Math.log10(max));
  const n = max / pow;
  const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
  return step * pow;
}

function compact(n: number): string {
  if (Math.abs(n) >= 1000) return `${(n / 1000).toLocaleString("es-ES", { maximumFractionDigits: 1 })}k`;
  return n.toLocaleString("es-ES", { maximumFractionDigits: 1 });
}

// Los componentes de servidor no pueden pasar funciones a uno de cliente,
// así que el formato se elige por nombre.
export type ValueFormat = "number" | "percent";

function formatValue(v: number, kind: ValueFormat): string {
  if (kind === "percent") return `${(v * 100).toLocaleString("es-ES", { maximumFractionDigits: 2 })}%`;
  return v.toLocaleString("es-ES", { maximumFractionDigits: 0 });
}

function shortDate(date: string): string {
  return new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "short", timeZone: "UTC" })
    .format(new Date(`${date}T12:00:00Z`))
    .replace(".", "");
}

export function TrendChart({
  title,
  points,
  kind = "bar",
  valueLabel,
  valueFormat = "number",
  emptyText = "Sin datos en este periodo",
  height = 160,
}: {
  title: string;
  points: ChartPoint[];
  kind?: "bar" | "line";
  valueLabel: string;
  valueFormat?: ValueFormat;
  emptyText?: string;
  height?: number;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);
  // El SVG se dibuja al ancho real del contenedor (no escalado), para que
  // el texto de los ejes tenga siempre el mismo tamaño aunque el gráfico
  // vaya en una columna estrecha.
  const [W, setW] = useState(600);
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setW(Math.max(240, Math.round(entry.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const H = height;
  const pad = { top: 10, right: 8, bottom: 22, left: 38 };
  const innerW = W - pad.left - pad.right;
  const innerH = H - pad.top - pad.bottom;

  const values = points.map((p) => p.value).filter((v): v is number => v !== null);
  const hasData = values.some((v) => v !== 0) || (kind === "line" && values.length > 0);
  const minVal = kind === "line" && values.length ? Math.min(...values) : 0;
  const maxVal = values.length ? Math.max(...values) : 0;
  // En línea (seguidores) el eje no empieza en 0: lo que importa es la
  // variación, y desde 0 una cuenta de 44.000 se vería plana.
  const yMin = kind === "line" ? Math.floor(minVal - (maxVal - minVal || 1) * 0.2) : 0;
  const yMax = kind === "line" ? Math.ceil(maxVal + (maxVal - minVal || 1) * 0.2) : niceMax(maxVal);
  const y = (v: number) => pad.top + innerH - ((v - yMin) / (yMax - yMin || 1)) * innerH;
  const step = innerW / Math.max(points.length, 1);
  const xCenter = (i: number) => pad.left + step * i + step / 2;
  const barW = Math.max(2, Math.min(18, step - 2));

  const ticks = useMemo(() => [0, 0.5, 1].map((t) => yMin + (yMax - yMin) * t), [yMin, yMax]);
  const labelEvery = Math.ceil(points.length / Math.max(2, Math.floor(W / 90)));

  const linePath = useMemo(() => {
    if (kind !== "line") return "";
    let d = "";
    let pen = false;
    points.forEach((p, i) => {
      if (p.value === null) return;
      d += `${pen ? "L" : "M"}${xCenter(i).toFixed(1)},${y(p.value).toFixed(1)}`;
      pen = true;
    });
    return d;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points, kind, yMin, yMax, W]);

  function onMove(e: React.PointerEvent<SVGSVGElement>) {
    const svg = ref.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * W;
    const i = Math.floor((x - pad.left) / step);
    if (i < 0 || i >= points.length) return setHover(null);
    // Se engancha a la barra/punto con dato más cercano (hasta 3 días),
    // porque no todos los días hay publicación.
    for (let d = 0; d <= 3; d++) {
      for (const j of [i - d, i + d]) {
        if (j >= 0 && j < points.length && points[j].value) return setHover(j);
      }
    }
    setHover(i);
  }

  const hovered = hover !== null ? points[hover] : null;

  return (
    <div className="card p-4" ref={boxRef}>
      <div className="flex items-baseline justify-between gap-2 mb-2 min-h-[20px]">
        <h3 className="text-sm font-medium text-slate-700">{title}</h3>
        {hovered && (
          <span className="text-xs text-slate-500">
            {shortDate(hovered.date)} ·{" "}
            <span className="font-medium text-slate-800">
              {hovered.value === null ? "sin publicaciones" : `${formatValue(hovered.value, valueFormat)} ${valueLabel}`}
            </span>
          </span>
        )}
      </div>
      {!hasData ? (
        <div className="flex items-center justify-center text-xs text-slate-400" style={{ height: H * 0.6 }}>
          {emptyText}
        </div>
      ) : (
        <svg
          ref={ref}
          viewBox={`0 0 ${W} ${H}`}
          width={W}
          height={H}
          className="block max-w-full touch-none select-none"
          role="img"
          aria-label={`${title}: ${values.length} valores`}
          onPointerMove={onMove}
          onPointerLeave={() => setHover(null)}
        >
          {ticks.map((t) => (
            <g key={t}>
              <line x1={pad.left} x2={W - pad.right} y1={y(t)} y2={y(t)} stroke="#e2e8f0" strokeWidth={1} />
              <text x={pad.left - 6} y={y(t) + 3} textAnchor="end" fontSize={10} fill="#94a3b8">
                {compact(t)}
              </text>
            </g>
          ))}
          {points.map((p, i) =>
            i % labelEvery === 0 ? (
              <text key={p.date} x={xCenter(i)} y={H - 6} textAnchor="middle" fontSize={10} fill="#94a3b8">
                {shortDate(p.date)}
              </text>
            ) : null
          )}
          {hover !== null && (
            <line x1={xCenter(hover)} x2={xCenter(hover)} y1={pad.top} y2={pad.top + innerH} stroke="#cbd5e1" strokeWidth={1} />
          )}
          {kind === "bar" &&
            points.map((p, i) => {
              if (!p.value) return null;
              const top = y(p.value);
              const h = pad.top + innerH - top;
              const r = Math.min(4, barW / 2, h);
              const x0 = xCenter(i) - barW / 2;
              const yBase = pad.top + innerH;
              return (
                <path
                  key={p.date}
                  d={`M${x0},${yBase}V${top + r}Q${x0},${top} ${x0 + r},${top}H${x0 + barW - r}Q${x0 + barW},${top} ${x0 + barW},${top + r}V${yBase}Z`}
                  fill={hover === i ? SERIES : SERIES_SOFT}
                />
              );
            })}
          {kind === "line" && (
            <>
              <path d={linePath} fill="none" stroke={SERIES} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
              {points.map((p, i) =>
                p.value !== null && (hover === i || points.filter((q) => q.value !== null).length <= 12) ? (
                  <circle key={p.date} cx={xCenter(i)} cy={y(p.value)} r={4} fill={SERIES} stroke="#fff" strokeWidth={2} />
                ) : null
              )}
            </>
          )}
        </svg>
      )}
    </div>
  );
}

/** Barras horizontales para comparar categorías (formatos, etc.). */
export function HBarList({
  title,
  rows,
  valueFormat = "number",
}: {
  title: string;
  rows: { label: string; value: number | null; note?: string }[];
  valueFormat?: ValueFormat;
}) {
  const max = Math.max(...rows.map((r) => r.value ?? 0), 0) || 1;
  return (
    <div className="card p-4">
      <h3 className="text-sm font-medium text-slate-700 mb-3">{title}</h3>
      <div className="space-y-2.5">
        {rows.map((r) => (
          <div key={r.label} className="grid grid-cols-[80px_1fr_auto] items-center gap-3 text-sm">
            <span className="text-slate-600">{r.label}</span>
            <span className="h-3 rounded bg-slate-100 overflow-hidden" title={r.note}>
              <span
                className="block h-full rounded bg-brand-500"
                style={{ width: `${((r.value ?? 0) / max) * 100}%` }}
              />
            </span>
            <span className="text-slate-800 font-medium tabular-nums text-right min-w-[56px]">
              {r.value === null ? "—" : formatValue(r.value, valueFormat)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
