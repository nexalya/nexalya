// Cifra principal de la analítica, con comparación opcional frente al
// periodo anterior (mismo número de días justo antes). La subida/bajada
// lleva siempre flecha y texto, nunca solo el color.

export default function StatTile({
  label,
  value,
  current,
  previous,
  hint,
}: {
  label: string;
  value: string;
  current?: number | null;
  previous?: number | null;
  hint?: string;
}) {
  let delta: { text: string; up: boolean } | null = null;
  if (current != null && previous != null && previous !== 0) {
    const change = (current - previous) / Math.abs(previous);
    if (Math.abs(change) >= 0.01) {
      delta = {
        text: `${(Math.abs(change) * 100).toLocaleString("es-ES", { maximumFractionDigits: 0 })}%`,
        up: change > 0,
      };
    }
  }

  return (
    <div className="card p-4" title={hint}>
      <div className="text-xs text-slate-500">{label}</div>
      <div className="text-2xl font-semibold text-slate-900 mt-1 tabular-nums">{value}</div>
      {delta ? (
        <div className={`text-xs mt-1 ${delta.up ? "text-emerald-700" : "text-red-700"}`}>
          <span aria-hidden>{delta.up ? "▲" : "▼"}</span> {delta.up ? "Sube" : "Baja"} {delta.text}{" "}
          <span className="text-slate-400">vs periodo anterior</span>
        </div>
      ) : hint ? (
        <div className="text-xs mt-1 text-slate-400">{hint}</div>
      ) : null}
    </div>
  );
}
