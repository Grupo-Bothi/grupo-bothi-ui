// src/app/[locale]/(dashboard)/dashboard/page.tsx
"use client";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/store/auth";
import { getDashboardStats } from "@/services/analytics";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Users,
  Package,
  ClipboardList,
  Receipt,
  UserCheck,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b",
  in_progress: "#3b82f6",
  in_review: "#8b5cf6",
  completed: "#10b981",
  cancelled: "#ef4444",
};

const PRIORITY_COLORS: Record<string, string> = {
  low: "#6ee7b7",
  medium: "#3b82f6",
  high: "#f59e0b",
  urgent: "#ef4444",
};

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  iconColor,
  iconBg,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-5">
      <div
        className={cn(
          "w-9 h-9 rounded-lg flex items-center justify-center mb-3",
          iconBg,
        )}
      >
        <Icon size={16} className={iconColor} />
      </div>
      <p className="text-2xl font-semibold text-zinc-900">{value}</p>
      <p className="text-xs text-zinc-500 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-zinc-400 mt-0.5">{sub}</p>}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-sm font-medium text-zinc-700 mb-4">{children}</h2>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-5">
      <p className="text-sm font-medium text-zinc-700 mb-4">{title}</p>
      {children}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-5 animate-pulse">
      <div className="w-9 h-9 rounded-lg bg-zinc-100 mb-3" />
      <div className="h-7 w-16 bg-zinc-100 rounded mb-1" />
      <div className="h-3 w-24 bg-zinc-100 rounded" />
    </div>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function DashboardPage() {
  const t = useTranslations("analyticsBoard");
  const user = useAuthStore((s) => s.user);
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
    staleTime: 2 * 60 * 1000,
  });

  const workOrderStatusData = data
    ? Object.entries(data.work_orders.by_status).map(([key, val]) => ({
        name: t(`workOrderStatuses.${key}`),
        value: val,
        fill: STATUS_COLORS[key] ?? "#94a3b8",
      }))
    : [];

  const workOrderPriorityData = data
    ? Object.entries(data.work_orders.by_priority).map(([key, val]) => ({
        name: t(`priorities.${key}`),
        value: val,
        fill: PRIORITY_COLORS[key] ?? "#94a3b8",
      }))
    : [];

  const ticketData = data
    ? [
        { name: t("ticketPaid"), value: data.tickets.paid, fill: "#10b981" },
        {
          name: t("ticketPending"),
          value: data.tickets.pending,
          fill: "#f59e0b",
        },
      ]
    : [];

  const attendanceTodayData = data
    ? [
        {
          name: t("attendanceNormal"),
          value: data.attendance.today.normal,
          fill: "#10b981",
        },
        {
          name: t("attendanceLate"),
          value: data.attendance.today.late,
          fill: "#f59e0b",
        },
        {
          name: t("attendanceAbsent"),
          value: data.attendance.today.absent,
          fill: "#ef4444",
        },
      ]
    : [];

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-xl font-medium text-zinc-900">
            {t("title")}
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            {t("subtitle", { name: user?.first_name ?? "" })}
          </p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="p-2 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors disabled:pointer-events-none"
        >
          <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard
              label={t("totalEmployees")}
              value={data?.employees.total ?? 0}
              sub={t("employeesSub", {
                active: data?.employees.active ?? 0,
                inactive: data?.employees.inactive ?? 0,
              })}
              icon={Users}
              iconColor="text-blue-600"
              iconBg="bg-blue-50"
            />
            <StatCard
              label={t("totalWorkOrders")}
              value={data?.work_orders.total ?? 0}
              sub={t("workOrdersSub", {
                completed: data?.work_orders.by_status.completed ?? 0,
              })}
              icon={ClipboardList}
              iconColor="text-indigo-600"
              iconBg="bg-indigo-50"
            />
            <StatCard
              label={t("totalTickets")}
              value={data?.tickets.total ?? 0}
              sub={t("ticketsPending", { count: data?.tickets.pending ?? 0 })}
              icon={Receipt}
              iconColor="text-amber-600"
              iconBg="bg-amber-50"
            />
            <StatCard
              label={t("totalRevenue")}
              value={formatCurrency(data?.tickets.total_revenue ?? 0)}
              sub={t("pendingRevenue", {
                amount: formatCurrency(data?.tickets.pending_revenue ?? 0),
              })}
              icon={DollarSign}
              iconColor="text-emerald-600"
              iconBg="bg-emerald-50"
            />
            <StatCard
              label={t("totalInventory")}
              value={data?.inventory.total ?? 0}
              sub={t("inventorySub", {
                available: data?.inventory.available ?? 0,
              })}
              icon={Package}
              iconColor="text-teal-600"
              iconBg="bg-teal-50"
            />
            <StatCard
              label={t("lowStock")}
              value={data?.inventory.low_stock ?? 0}
              sub={t("outOfStock", { count: data?.inventory.out_of_stock ?? 0 })}
              icon={AlertTriangle}
              iconColor="text-orange-600"
              iconBg="bg-orange-50"
            />
            <StatCard
              label={t("attendanceToday")}
              value={data?.attendance.today.total ?? 0}
              sub={t("attendanceMonth", { count: data?.attendance.this_month ?? 0 })}
              icon={UserCheck}
              iconColor="text-purple-600"
              iconBg="bg-purple-50"
            />
            <StatCard
              label={t("totalUsers")}
              value={data?.users.total ?? 0}
              icon={TrendingUp}
              iconColor="text-pink-600"
              iconBg="bg-pink-50"
            />
          </>
        )}
      </div>

      {/* Charts row 1 */}
      <SectionTitle>{t("sectionOrders")}</SectionTitle>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <ChartCard title={t("chartOrdersByStatus")}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={workOrderStatusData} barSize={32}>
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "#71717a" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#71717a" }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                cursor={{ fill: "#f4f4f5" }}
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border: "1px solid #e4e4e7",
                }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {workOrderStatusData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title={t("chartOrdersByPriority")}>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={workOrderPriorityData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {workOrderPriorityData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border: "1px solid #e4e4e7",
                }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 12, color: "#52525b" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Charts row 2 */}
      <SectionTitle>{t("sectionFinance")}</SectionTitle>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <ChartCard title={t("chartTickets")}>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={ticketData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {ticketData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border: "1px solid #e4e4e7",
                }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 12, color: "#52525b" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Revenue summary */}
        <div className="bg-white rounded-xl border border-zinc-200 p-5 flex flex-col gap-4 justify-center">
          <p className="text-sm font-medium text-zinc-700">{t("revenueBreakdown")}</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="text-sm text-zinc-600">{t("collectedRevenue")}</span>
              </div>
              <span className="text-sm font-medium text-zinc-900">
                {formatCurrency(
                  (data?.tickets.total_revenue ?? 0) -
                    (data?.tickets.pending_revenue ?? 0),
                )}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
                <span className="text-sm text-zinc-600">{t("pendingRevenue")}</span>
              </div>
              <span className="text-sm font-medium text-zinc-900">
                {formatCurrency(data?.tickets.pending_revenue ?? 0)}
              </span>
            </div>
            <div className="border-t border-zinc-100 pt-3 flex items-center justify-between">
              <span className="text-sm font-medium text-zinc-700">{t("totalRevenue")}</span>
              <span className="text-base font-semibold text-zinc-900">
                {formatCurrency(data?.tickets.total_revenue ?? 0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts row 3 */}
      <SectionTitle>{t("sectionAttendance")}</SectionTitle>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title={t("chartAttendanceToday")}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={attendanceTodayData} barSize={40}>
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "#71717a" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#71717a" }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                cursor={{ fill: "#f4f4f5" }}
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border: "1px solid #e4e4e7",
                }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {attendanceTodayData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Inventory summary */}
        <div className="bg-white rounded-xl border border-zinc-200 p-5 flex flex-col gap-4 justify-center">
          <p className="text-sm font-medium text-zinc-700">{t("inventoryBreakdown")}</p>
          <div className="space-y-3">
            {[
              {
                label: t("inventoryAvailable"),
                value: data?.inventory.available ?? 0,
                color: "bg-emerald-500",
              },
              {
                label: t("inventoryUnavailable"),
                value: data?.inventory.unavailable ?? 0,
                color: "bg-zinc-300",
              },
              {
                label: t("inventoryLowStock"),
                value: data?.inventory.low_stock ?? 0,
                color: "bg-amber-400",
              },
              {
                label: t("inventoryOutOfStock"),
                value: data?.inventory.out_of_stock ?? 0,
                color: "bg-red-400",
              },
            ].map(({ label, value, color }) => {
              const total = data?.inventory.total || 1;
              const pct = Math.round((value / total) * 100);
              return (
                <div key={label}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${color}`} />
                      <span className="text-sm text-zinc-600">{label}</span>
                    </div>
                    <span className="text-sm font-medium text-zinc-900">
                      {value}{" "}
                      <span className="text-zinc-400 font-normal">({pct}%)</span>
                    </span>
                  </div>
                  <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${color}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
