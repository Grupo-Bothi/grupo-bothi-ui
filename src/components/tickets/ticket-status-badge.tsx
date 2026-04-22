// src/components/tickets/ticket-status-badge.tsx
"use client";
import { useTranslations } from "next-intl";

const STYLES: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  paid: "bg-teal-50 text-teal-700 border-teal-200",
};

export function TicketStatusBadge({ status }: { status: "pending" | "paid" }) {
  const t = useTranslations("tickets");
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${STYLES[status]}`}
    >
      {t(`statuses.${status}`)}
    </span>
  );
}
