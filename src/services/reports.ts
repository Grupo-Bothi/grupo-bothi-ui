import { apiClient } from "@/lib/api";
import type { ReportSummary, IncomeReport, ExpensesReport, PayrollReport } from "@/types";

export type ReportPeriod = "weekly" | "monthly" | "annual";
export type GroupBy = "week" | "month" | "year";

function companyHeaders(companyId?: number) {
  return companyId ? { headers: { "X-Company-Id": String(companyId) } } : {};
}

export const reportsService = {
  summary: (period: ReportPeriod, date: string, companyId?: number): Promise<ReportSummary> =>
    apiClient
      .get("/api/v1/reports/summary", { params: { period, date }, ...companyHeaders(companyId) })
      .then((r) => r.data),

  income: (from: string, to: string, group_by: GroupBy, companyId?: number): Promise<IncomeReport> =>
    apiClient
      .get("/api/v1/reports/income", { params: { from, to, group_by }, ...companyHeaders(companyId) })
      .then((r) => r.data),

  expenses: (from: string, to: string, group_by: GroupBy, companyId?: number): Promise<ExpensesReport> =>
    apiClient
      .get("/api/v1/reports/expenses", { params: { from, to, group_by }, ...companyHeaders(companyId) })
      .then((r) => r.data),

  payroll: (from: string, to: string, companyId?: number): Promise<PayrollReport> =>
    apiClient
      .get("/api/v1/reports/payroll", { params: { from, to }, ...companyHeaders(companyId) })
      .then((r) => r.data),
};
