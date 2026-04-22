// src/hooks/use-tickets.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ticketsService } from "@/services/tickets";
import type { Ticket } from "@/types";

export function useTickets(filters?: { status?: string; search?: string }) {
  return useQuery<Ticket[]>({
    queryKey: ["tickets", filters],
    queryFn: () =>
      ticketsService
        .list(1, filters?.search, filters?.status)
        .then((r) => r.results ?? (r as unknown as Ticket[])),
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function useTicket(id: number) {
  return useQuery<Ticket>({
    queryKey: ["tickets", id],
    queryFn: () => ticketsService.getById(id),
    enabled: !!id,
    staleTime: 0,
  });
}

export function useMarkTicketPaid(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => ticketsService.markAsPaid(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tickets"] });
      qc.invalidateQueries({ queryKey: ["tickets", id] });
    },
  });
}
