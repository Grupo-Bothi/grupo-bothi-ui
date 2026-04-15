// src/components/work-orders/priority-badge.tsx

import type { WorkOrder } from "@/types";

const STYLES = {
  low: "bg-zinc-100 text-zinc-600 border-zinc-200",
  medium: "bg-blue-50 text-blue-700 border-blue-200",
  high: "bg-amber-50 text-amber-700 border-amber-200",
  urgent: "bg-red-50 text-red-700 border-red-200",
};

const LABELS = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
  urgent: "Urgente",
};

export function PriorityBadge({
  priority,
}: {
  priority: WorkOrder["priority"];
}) {
  return (
    <span
      className={`text-xs font-medium px-2 py-0.5 rounded-full border ${STYLES[priority]}`}
    >
      {LABELS[priority]}
    </span>
  );
}
