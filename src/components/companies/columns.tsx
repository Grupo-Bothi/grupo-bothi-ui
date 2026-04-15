// src/components/companies/columns.tsx
"use client";
import { type ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Company } from "@/types";

interface CompanyActions {
  onEdit: (company: Company) => void;
  onDelete: (company: Company) => void;
}

export function getCompanyColumns(
  t: (key: string) => string,
  tc: (key: string) => string,
  actions: CompanyActions,
): ColumnDef<Company, unknown>[] {
  return [
    {
      accessorKey: "name",
      header: t("name"),
      cell: ({ row }) => (
        <span className="font-medium text-zinc-800">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "slug",
      header: t("slug"),
      cell: ({ row }) => (
        <span className="text-zinc-400 font-mono text-xs">{row.original.slug}</span>
      ),
    },
    {
      accessorKey: "plan",
      header: t("plan"),
      cell: ({ row }) => {
        const plan = row.original.plan;
        const variant =
          plan === "enterprise"
            ? "default"
            : plan === "business"
              ? "secondary"
              : "outline";
        return <Badge variant={variant}>{t(`plans.${plan}`)}</Badge>;
      },
    },
    {
      accessorKey: "users_count",
      header: t("users"),
      cell: ({ row }) => (
        <span className="text-zinc-500">{row.original.users_count ?? 0}</span>
      ),
    },
    {
      accessorKey: "active",
      header: t("status"),
      cell: ({ row }) => (
        <Badge variant={row.original.active ? "default" : "secondary"}>
          {row.original.active ? t("active") : t("inactive")}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: () => <span className="flex justify-end">{tc("actions")}</span>,
      cell: ({ row }) => (
        <TooltipProvider>
          <div className="flex items-center justify-end gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-zinc-400 hover:text-zinc-800"
                  onClick={() => actions.onEdit(row.original)}
                >
                  <Pencil size={14} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{tc("edit")}</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-zinc-400 hover:text-red-600"
                  onClick={() => actions.onDelete(row.original)}
                >
                  <Trash2 size={14} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{tc("delete")}</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      ),
    },
  ];
}
