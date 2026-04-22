// src/components/work-orders/status-badge.tsx
const STYLES: Record<string, string> = {
  pending:     "bg-zinc-100 text-zinc-600",
  in_progress: "bg-blue-50 text-blue-700",
  in_review:   "bg-purple-50 text-purple-700",
  completed:   "bg-teal-50 text-teal-700",
  cancelled:   "bg-red-50 text-red-600",
};

const LABELS: Record<string, string> = {
  pending:     "Pendiente",
  in_progress: "En progreso",
  in_review:   "En revisión",
  completed:   "Completada",
  cancelled:   "Cancelada",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`text-xs font-medium px-2.5 py-1 rounded-full ${STYLES[status] ?? "bg-zinc-100 text-zinc-500"}`}
    >
      {LABELS[status] ?? status}
    </span>
  );
}
