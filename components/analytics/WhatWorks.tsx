import Link from "next/link";
import type { Pattern, ScoredPost } from "@/lib/analytics";
import { pct } from "@/lib/analytics";
import { dayLabel } from "@/components/ContentFormatIcons";
import { Thumb } from "@/components/InstagramResults";

// "Publicaciones que SÍ funcionan / que NO funcionan": lo primero que se
// ve en la analítica, porque es lo que decide el siguiente calendario.
// Este mismo análisis (lib/analytics.ts) es el que recibe la IA al
// generar el plan de contenido.

function PostCard({ post, tone }: { post: ScoredPost; tone: "good" | "bad" }) {
  const value = (post.saves ?? 0) + (post.shares ?? 0);
  return (
    <a
      href={post.permalink ?? undefined}
      target="_blank"
      rel="noreferrer"
      className="flex gap-3 p-3 rounded-lg border border-slate-100 bg-white hover:border-slate-200 transition-colors"
    >
      <Thumb url={post.thumbnailUrl} formatKey={post.format} size={56} />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="text-sm font-medium text-slate-800 line-clamp-2">{post.title}</div>
          {post.score !== null && (
            <span
              className={`text-xs font-semibold tabular-nums whitespace-nowrap ${tone === "good" ? "text-emerald-700" : "text-red-700"}`}
              title="Rendimiento frente a la media de la cuenta (1× = en la media)"
            >
              {post.score.toLocaleString("es-ES", { maximumFractionDigits: 1 })}×
            </span>
          )}
        </div>
        <div className="text-[11px] text-slate-400 mt-0.5">
          {post.formatLabel} · {dayLabel(post.timestamp)}
          {post.family ? ` · ${post.family}` : ""}
        </div>
        <ul className="mt-1.5 space-y-0.5">
          {post.reasons.map((r) => (
            <li key={r} className="text-xs text-slate-600 flex gap-1.5">
              <span aria-hidden className={tone === "good" ? "text-emerald-600" : "text-red-600"}>
                {tone === "good" ? "▲" : "▼"}
              </span>
              {r}
            </li>
          ))}
        </ul>
        <div className="flex gap-3 mt-1.5 text-[11px] text-slate-500 tabular-nums">
          <span>Alcance {post.reach?.toLocaleString("es-ES") ?? "—"}</span>
          <span>Interacción {pct(post.engagementRate)}</span>
          <span>Guard.+compart. {value.toLocaleString("es-ES")}</span>
        </div>
      </div>
    </a>
  );
}

export default function WhatWorks({
  clientId,
  works,
  fails,
  patterns,
  ready,
}: {
  clientId: string;
  works: ScoredPost[];
  fails: ScoredPost[];
  patterns: Pattern[];
  ready: boolean;
}) {
  if (!ready) {
    return (
      <div className="card p-5 text-sm text-slate-500">
        Hacen falta al menos 4 publicaciones con métricas (de hace más de 48 h) para poder comparar qué funciona y qué no.
        En cuanto la sincronización las tenga, este análisis aparece solo.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-4 space-y-3">
          <div>
            <h3 className="text-sm font-semibold text-emerald-800 flex items-center gap-1.5">
              <span aria-hidden>✓</span> Publicaciones que SÍ funcionan
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Rinden al menos un 25 % por encima de la media de la cuenta.</p>
          </div>
          {works.length === 0 ? (
            <p className="text-sm text-slate-400">Ninguna destaca claramente en este periodo.</p>
          ) : (
            works.slice(0, 5).map((p) => <PostCard key={p.id} post={p} tone="good" />)
          )}
        </div>
        <div className="card p-4 space-y-3">
          <div>
            <h3 className="text-sm font-semibold text-red-800 flex items-center gap-1.5">
              <span aria-hidden>✕</span> Publicaciones que NO funcionan
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Rinden al menos un 25 % por debajo de la media de la cuenta.</p>
          </div>
          {fails.length === 0 ? (
            <p className="text-sm text-slate-400">Ninguna queda claramente por debajo en este periodo.</p>
          ) : (
            fails.slice(0, 5).map((p) => <PostCard key={p.id} post={p} tone="bad" />)
          )}
        </div>
      </div>

      <div className="card p-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
          <h3 className="text-sm font-semibold text-slate-700">Patrones detectados (últimos 90 días)</h3>
          <Link href={`/clients/${clientId}/plan`} className="text-xs text-brand-600 hover:underline">
            La IA usa este análisis al generar el próximo plan →
          </Link>
        </div>
        {patterns.length === 0 ? (
          <p className="text-sm text-slate-400">
            Todavía no hay diferencias claras entre formatos, días u horas. Con más publicaciones irán apareciendo.
          </p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {patterns.map((p) => (
              <li key={p.label} className="flex gap-2 text-sm p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span aria-hidden className={p.tone === "bad" ? "text-red-600" : "text-emerald-600"}>
                  {p.tone === "bad" ? "▼" : "▲"}
                </span>
                <span>
                  <span className="font-medium text-slate-800">{p.label}</span>
                  <span className="block text-xs text-slate-500">{p.detail}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
