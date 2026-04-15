// src/components/inventory/columns.tsx
"use client";
import { type ColumnDef } from "@tanstack/react-table";
import { ArrowDownToLine, ArrowUpFromLine, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Product } from "@/types";

interface ProductActions {
  onEntry: (product: Product) => void;
  onExit: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function getProductColumns(
  t: (key: string) => string,
  tc: (key: string) => string,
  actions: ProductActions,
): ColumnDef<Product, unknown>[] {
  return [
    {
      accessorKey: "sku",
      header: t("sku"),
      cell: ({ row }) => (
        <span className="font-mono text-xs text-zinc-500">{row.original.sku}</span>
      ),
    },
    {
      accessorKey: "name",
      header: t("name"),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="font-medium text-zinc-800">{row.original.name}</span>
          {row.original.low_stock && (
            <Badge
              variant="secondary"
              className="text-amber-600 bg-amber-50 border-amber-200 text-xs"
            >
              {t("lowStockBadge")}
            </Badge>
          )}
        </div>
      ),
    },
    {
      accessorKey: "stock",
      header: t("stock"),
      cell: ({ row }) => (
        <span className="text-zinc-700">{row.original.stock}</span>
      ),
    },
    {
      accessorKey: "unit_cost",
      header: t("unitCost"),
      cell: ({ row }) => (
        <span className="text-zinc-500">
          ${Number(row.original.unit_cost).toFixed(2)}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => <span className="flex justify-end">{t("actions")}</span>,
      cell: ({ row }) => (
        <TooltipProvider>
          <div className="flex items-center justify-end gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-zinc-400 hover:text-emerald-600"
                  onClick={() => actions.onEntry(row.original)}
                >
                  <ArrowDownToLine size={14} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t("entry")}</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-zinc-400 hover:text-amber-600"
                  onClick={() => actions.onExit(row.original)}
                >
                  <ArrowUpFromLine size={14} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t("exit")}</TooltipContent>
            </Tooltip>

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
