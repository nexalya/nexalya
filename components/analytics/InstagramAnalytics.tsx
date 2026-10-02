import Link from "next/link";
import type { Client, FollowerSnapshot, IgMediaWithItem } from "@/lib/db-turso";
import { buildAnalytics, pct } from "@/lib/analytics";
import StatTile from "@/components/analytics/StatTile";
import WhatWorks from "@/components/analytics/WhatWorks";
import { TrendChart, HBarList } from "@/components/analytics/Charts";
import { PostsTable, StoriesTable, SyncStatusBar, type CalendarOption } from "@/components/InstagramResults";
import FollowerSnapshotForm from "@/components/FollowerSnapshotForm";

// Pestaña Métricas de un cliente con Instagram conectado: analítica
// completa al estilo Metricool (resumen, interacciones, seguidores,
// formatos, publicaciones, historias, hashtags) calculada en
// lib/analytics.ts a partir de lo importado por la sincronización
// automática. Arriba del todo, lo que más importa: qué funciona y qué no.

export const PERIODS = [7, 30, 90] as const;

const n = (v: number | null, digits = 0) => (v === null ? "—" : v.toLocaleString("es-ES", { maximumFractionDigits: digits }));

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-lg font-medium">{title}</h2>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

export default function InstagramAnalytics({
  client,
  media,
  snapshots,
  calendarOptions,
  periodDays,
}: {
  client: Client;
  media: IgMediaWithItem[];
  snapshots: FollowerSnapshot[];
  calendarOptions: CalendarOption[];
  periodDays: number;
}) {
  const a = buildAnalytics(media, snapshots, periodDays);
  const s = a.summary;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 p-1 rounded-lg bg-slate-100" role="tablist" aria-label="Periodo">
          {PERIODS.map((d) => (
            <Link
              key={d}
              href={`/clients/${client.id}/metrics?d=${d}`}
              scroll={false}
              className={`text-sm px-3 py-1.5 rounded-md transition-colors ${
                d === periodDays ? "bg-white shadow-sm text-slate-900 font-medium" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {d} días
            </Link>
          ))}
        </div>
        <SyncStatusBar clientId={client.id} lastSyncAt={client.lastSyncAt} lastSyncError={client.lastSyncError} />
      </div>

      {media.length === 0 ? (
        <div className="card p-8 text-center text-sm text-slate-500">
          Todavía no se ha importado nada de Instagram. Pulsa &quot;Sincronizar ahora&quot; para traer los últimos 90 días.
        </div>
      ) : (
        <>
          <Section title="Qué funciona y qué no" subtitle="Cada publicación comparada con la media de la propia cuenta y de su mismo formato.">
            <WhatWorks clientId={client.id} works={a.works} fails={a.fails} patterns={a.patterns} ready={a.verdictReady} />
          </Section>

          <Section title="Resumen orgánico" subtitle={`Publicaciones de feed (reels, carruseles y posts) de los últimos ${periodDays} días.`}>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
              <StatTile
                label="Engagement"
                value={pct(s.engagementRate, 2)}
                current={s.engagementRate}
                previous={a.previous.engagementRate}
                hint="Interacciones / alcance, de media por publicación"
              />
              <StatTile label="Interacciones" value={n(s.interactions)} current={s.interactions} previous={a.previous.interactions} />
              <StatTile label="Alcance medio por publicación" value={n(s.avgReach)} current={s.avgReach} previous={a.previous.avgReach} />
              <StatTile label="Visualizaciones" value={n(s.views)} current={s.views} previous={a.previous.views} />
              <StatTile label="Publicaciones" value={n(s.posts)} current={s.posts} previous={a.previous.posts} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              <TrendChart title="Alcance por día de publicación" points={a.daily.reach} valueLabel="personas" />
              <TrendChart title="Visualizaciones" points={a.daily.views} valueLabel="visualizaciones" />
              <TrendChart title="Interacciones" points={a.daily.interactions} valueLabel="interacciones" />
            </div>
          </Section>

          <Section title="Interacciones">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatTile label="Me gusta" value={n(s.likes)} />
              <StatTile label="Comentarios" value={n(s.comments)} />
              <StatTile label="Guardados" value={n(s.saves)} />
              <StatTile label="Compartidos" value={n(s.shares)} />
            </div>
            <div className="card p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {[
                ["Me gusta al día", n(s.likesPerDay, 2)],
                ["Me gusta por publicación", n(s.likesPerPost, 2)],
                ["Comentarios por publicación", n(s.commentsPerPost, 2)],
                ["Guardados + compartidos por publicación", n(s.savesSharesPerPost, 2)],
              ].map(([label, value]) => (
                <div key={label}>
                  <div className="text-lg font-semibold text-slate-800 tabular-nums">{value}</div>
                  <div className="text-xs text-slate-500">{label}</div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Seguidores">
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_2fr] gap-3">
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                <StatTile label="Seguidores actuales" value={n(a.followers.current)} />
                <StatTile
                  label={`Ganados en ${periodDays} días`}
                  value={a.followers.gained === null ? "—" : `${a.followers.gained >= 0 ? "+" : ""}${n(a.followers.gained)}`}
                  hint={`${n(a.followers.gainedFromPosts)} atribuidos por Instagram a publicaciones e historias`}
                />
              </div>
              <TrendChart
                title="Evolución de seguidores"
                points={a.followers.series}
                kind="line"
                valueLabel="seguidores"
                emptyText="Se irá dibujando con el registro diario automático"
              />
            </div>
            <details className="card p-4">
              <summary className="text-xs text-slate-500 cursor-pointer">Añadir o corregir un registro a mano</summary>
              <div className="mt-3">
                <FollowerSnapshotForm clientId={client.id} canSync />
              </div>
            </details>
          </Section>

          {a.byFormat.length > 0 && (
            <Section title="Rendimiento por formato">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <HBarList
                  title="Alcance medio por publicación"
                  rows={a.byFormat.map((f) => ({ label: f.label, value: f.avgReach, note: `${f.count} publicaciones` }))}
                />
                <HBarList
                  title="Engagement medio"
                  rows={a.byFormat.map((f) => ({ label: f.label, value: f.avgEngagement, note: `${f.count} publicaciones` }))}
                  valueFormat="percent"
                />
              </div>
            </Section>
          )}

          <Section title="Publicaciones" subtitle="Pulsa una fila para ver el detalle y su pieza del calendario. Ordena pulsando en cada columna.">
            <PostsTable posts={a.posts} media={media} calendarOptions={calendarOptions} />
          </Section>

          <Section
            title="Historias"
            subtitle="Instagram solo da las métricas de una historia mientras está activa (24 h): el histórico empieza a contar desde que la sincronización está en marcha."
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatTile label="Historias" value={n(a.stories.count)} />
              <StatTile label="Visualizaciones" value={n(a.stories.views)} />
              <StatTile label="Alcance medio por historia" value={n(a.stories.avgReach)} />
              <StatTile label="Respuestas" value={n(a.stories.replies)} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <TrendChart title="Historias publicadas por día" points={a.stories.dailyCount} valueLabel="historias" />
              <TrendChart title="Visualizaciones de historias" points={a.stories.dailyViews} valueLabel="visualizaciones" />
            </div>
            {a.stories.rows.length > 0 && <StoriesTable rows={a.stories.rows} media={media} calendarOptions={calendarOptions} />}
          </Section>

          {a.hashtags.length > 0 && (
            <Section title="Hashtags" subtitle="Ordenados por alcance medio de las publicaciones que los usan.">
              <div className="card overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-left text-xs text-slate-500">
                    <tr>
                      <th className="p-2 pl-3 font-medium">Hashtag</th>
                      <th className="p-2 font-medium text-right">Publicaciones</th>
                      <th className="p-2 font-medium text-right">Alcance medio</th>
                      <th className="p-2 font-medium text-right">Visualiz. medias</th>
                      <th className="p-2 pr-3 font-medium text-right">Interacciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {a.hashtags.slice(0, 15).map((h) => (
                      <tr key={h.tag}>
                        <td className="p-2 pl-3 text-slate-800">{h.tag}</td>
                        <td className="p-2 text-right tabular-nums">{h.posts}</td>
                        <td className="p-2 text-right tabular-nums">{n(h.avgReach)}</td>
                        <td className="p-2 text-right tabular-nums">{n(h.avgViews)}</td>
                        <td className="p-2 pr-3 text-right tabular-nums">{n(h.totalInteractions)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>
          )}
        </>
      )}
    </div>
  );
}
