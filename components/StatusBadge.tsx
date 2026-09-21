import { STATUS_LABELS, type Status } from "@/lib/types";

const COLORS: Record<Status, string> = {
  DRAFT: "bg-slate-100 text-slate-600",
  SCHEDULED: "bg-amber-100 text-amber-700",
  PUBLISHED: "bg-emerald-100 text-emerald-700",
  FAILED: "bg-red-100 text-red-700",
};

export default function StatusBadge({ status }: { status: string }) {
  const s = (status as Status) in COLORS ? (status as Status) : "DRAFT";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${COLORS[s]}`}>
      {STATUS_LABELS[s]}
    </span>
  );
}
