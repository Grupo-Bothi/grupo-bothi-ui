// src/services/admin-users.ts
import { apiClient } from "@/lib/api";
import type { AdminUser, PaginatedResponse } from "@/types";

export interface AdminUserPayload {
  email: string;
  first_name: string;
  last_name: string;
  second_last_name: string;
  phone: string;
  role: "staff" | "manager" | "admin" | "owner";
  active?: boolean;
  company_ids?: number[];
}

export const adminUsersService = {
  list: (page = 1, search = "", pageSize = 10): Promise<PaginatedResponse<AdminUser>> =>
    apiClient
      .get("/api/v1/users", {
        params: { page, page_size: pageSize, search: search || undefined },
      })
      .then((r) => r.data),

  getById: (id: number): Promise<AdminUser> =>
    apiClient.get(`/api/v1/users/${id}`).then((r) => r.data),

  create: (data: AdminUserPayload): Promise<AdminUser> =>
    apiClient.post("/api/v1/users", { user: data }).then((r) => r.data),

  update: (id: number, data: AdminUserPayload): Promise<AdminUser> =>
    apiClient.patch(`/api/v1/users/${id}`, { user: data }).then((r) => r.data),

  remove: (id: number): Promise<void> =>
    apiClient.delete(`/api/v1/users/${id}`).then((r) => r.data),

  toggleActive: (id: number): Promise<AdminUser> =>
    apiClient.patch(`/api/v1/users/${id}/active`).then((r) => r.data),

  assignCompanies: (userId: number, companyIds: number[]): Promise<AdminUser> =>
    apiClient
      .patch(`/api/v1/users/${userId}`, { user: { company_ids: companyIds } })
      .then((r) => r.data),
};
