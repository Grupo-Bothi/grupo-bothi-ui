// src/services/tickets.ts
import { apiClient } from "@/lib/api";
import type { Ticket, PaginatedResponse } from "@/types";

export const ticketsService = {
  list: (
    page = 1,
    search = "",
    status = "",
    pageSize = 20,
  ): Promise<PaginatedResponse<Ticket>> =>
    apiClient
      .get("/api/v1/tickets", {
        params: {
          page,
          page_size: pageSize,
          search: search || undefined,
          status: status || undefined,
        },
      })
      .then((r) => r.data),

  getById: (id: number): Promise<Ticket> =>
    apiClient.get(`/api/v1/tickets/${id}`).then((r) => r.data),

  markAsPaid: (id: number): Promise<Ticket> =>
    apiClient.patch(`/api/v1/tickets/${id}/mark_as_paid`).then((r) => r.data),

  download: (id: number): Promise<Blob> =>
    apiClient
      .get(`/api/v1/tickets/${id}/download`, { responseType: "blob" })
      .then((r) => r.data),
};
