import Link from "next/link";

export default function ClientTabs({
  clientId,
  active,
}: {
  clientId: string;
  active: "calendar" | "plan" | "production" | "stories" | "metrics";
}) {
  const tabs = [
    { key: "calendar", label: "Calendario", href: `/clients/${clientId}` },
    { key: "plan", label: "Plan de contenido IA", href: `/clients/${clientId}/plan` },
    { key: "production", label: "Guion y rodaje", href: `/clients/${clientId}/production` },
    { key: "stories", label: "Historias", href: `/clients/${clientId}/stories` },
    { key: "metrics", label: "Métricas", href: `/clients/${clientId}/metrics` },
  ] as const;

  return (
    <div className="flex flex-wrap gap-1 border-b border-slate-200">
      {tabs.map((t) => (
        <Link
          key={t.key}
          href={t.href}
          className={`px-3 sm:px-4 py-2 text-sm font-medium border-b-2 -mb-px flex-shrink-0 whitespace-nowrap ${
            active === t.key
              ? "border-brand-600 text-brand-700"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          {t.label}
        </Link>
      ))}
    </div>
  );
}
