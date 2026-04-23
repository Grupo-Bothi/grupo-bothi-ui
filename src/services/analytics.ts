// src/services/analytics.ts
import { apiClient } from "@/lib/api";
import type { DashboardStats } from "@/types";

export const getDashboardStats = (): Promise<DashboardStats> =>
  apiClient.get("/api/v1/dashboard").then((r) => r.data);

export const getDashboardStatsByCompany = (companyId: number): Promise<DashboardStats> =>
  apiClient
    .get("/api/v1/dashboard", { headers: { "X-Company-Id": String(companyId) } })
    .then((r) => r.data);
