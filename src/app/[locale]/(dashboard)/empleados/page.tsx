// src/app/[locale]/(dashboard)/empleados/page.tsx
"use client";
import { useRef, useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/data-table";
import { Pagination } from "@/components/ui/pagination";
import { EmployeeForm } from "@/components/employees/employee-form";
import { EmployeeDeleteDialog } from "@/components/employees/employee-delete-dialog";
import { getEmployeeColumns } from "@/components/employees/columns";
import { employeesService } from "@/services/employees";
import { usePagination } from "@/hooks/use-pagination";
import type { Employee } from "@/types";

const PAGE_SIZE = 10;

export default function EmpleadosPage() {
  const t = useTranslations("employees");
  const tc = useTranslations("common");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { page, goTo, reset } = usePagination();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [deleting, setDeleting] = useState<Employee | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["employees", page, PAGE_SIZE, debouncedSearch],
    queryFn: () => employeesService.list(page, debouncedSearch, PAGE_SIZE),
  });

  const employees: Employee[] = data?.results ?? [];

  function handleSearch(value: string) {
    setSearch(value);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setDebouncedSearch(value);
      reset();
    }, 400);
  }

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  const columns = useMemo(
    () =>
      getEmployeeColumns(t, tc, {
        onEdit: (emp) => { setEditing(emp); setFormOpen(true); },
        onDelete: (emp) => setDeleting(emp),
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-medium text-zinc-900">{t("title")}</h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            {t("subtitle", { count: data?.info?.total ?? 0 })}
          </p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus size={15} />
          {t("new")}
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
        <Input
          className="pl-8"
          placeholder={t("searchPlaceholder")}
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={employees}
        pageSize={PAGE_SIZE}
        isLoading={isLoading}
        loadingMessage={tc("loading")}
        emptyMessage={t("empty")}
      />

      {/* Pagination */}
      {data?.info && data.info.total > 0 && (
        <Pagination info={data.info} onPageChange={goTo} />
      )}

      {/* Form Sheet */}
      <EmployeeForm
        open={formOpen}
        onOpenChange={setFormOpen}
        employee={editing}
      />

      {/* Delete Dialog */}
      <EmployeeDeleteDialog
        employee={deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
      />
    </div>
  );
}
