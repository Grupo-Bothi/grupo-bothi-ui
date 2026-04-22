// src/lib/ticket-pdf.ts
import { ticketsService } from "@/services/tickets";

export async function downloadTicketPDF(ticketId: number, folio: string) {
  const blob = await ticketsService.download(ticketId);
  const url = URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `ticket-${folio}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
