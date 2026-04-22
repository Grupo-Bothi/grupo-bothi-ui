// src/components/work-orders/work-order-dialog.tsx
"use client";
import { useEffect, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { useCreateWorkOrder } from "@/hooks/use-work-orders";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Package, AlertCircle } from "lucide-react";
import type { Employee, Product } from "@/types";

const schema = z.object({
  title: z.string().min(1, "Título requerido"),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  employee_id: z.coerce.number().optional(),
  due_date: z.string().optional(),
  notes: z.string().optional(),
});

type FormData = {
  title: string;
  description?: string;
  priority: "low" | "medium" | "high" | "urgent";
  employee_id?: number;
  due_date?: string;
  notes?: string;
};

interface ItemInput {
  description: string;
  quantity: number;
  unit: string;
  unit_price: number;
  product_id?: number;
}

const PRIORITY_DOT: Record<string, string> = {
  low: "bg-blue-400",
  medium: "bg-yellow-400",
  high: "bg-orange-500",
  urgent: "bg-red-500",
};

const selectCls =
  "w-full h-9 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring";

const textareaCls =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring";

export function WorkOrderDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const t = useTranslations("workOrders");
  const tc = useTranslations("common");
  const create = useCreateWorkOrder();
  const defaultTitle = `Nueva Orden - ${new Date().toLocaleDateString()}` + " ";

  const [items, setItems] = useState<ItemInput[]>([
    { description: "", quantity: 1, unit: "", unit_price: 0 },
  ]);

  const { data: employeesData } = useQuery({
    queryKey: ["employees"],
    queryFn: () =>
      apiClient.get("/api/v1/employees?status=active").then((r) => r.data),
  });
  const employees: Employee[] = employeesData?.results ?? employeesData ?? [];

  const { data: productsData } = useQuery({
    queryKey: ["products-selector"],
    queryFn: () =>
      apiClient.get("/api/v1/products?page_size=100").then((r) => r.data),
  });
  const allProducts: Product[] = productsData?.results ?? productsData ?? [];

  const { data: unitsData } = useQuery({
    queryKey: ["units-catalog"],
    queryFn: () =>
      apiClient.get("/api/v1/units").then((r) => r.data),
  });
  const unitGroups: Record<string, { id: number; key: string; name: string; group: string }[]> =
    unitsData?.units ?? {};

  const productsByCategory = allProducts.reduce<Record<string, Product[]>>(
    (acc, p) => {
      const cat = p.category ?? "General";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(p);
      return acc;
    },
    {},
  );

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) as Resolver<FormData> });

  const selectedPriority = watch("priority", "medium");

  useEffect(() => {
    if (open) {
      reset({ title: defaultTitle, priority: "medium" });
      setItems([{ description: "", quantity: 1, unit: "", unit_price: 0 }]);
    }
  }, [open, defaultTitle, reset]);

  function selectProduct(idx: number, productId: string) {
    const product = allProducts.find((p) => p.id === Number(productId));
    setItems((prev) =>
      prev.map((item, i) =>
        i === idx
          ? {
              ...item,
              product_id: productId ? Number(productId) : undefined,
              description: product?.name ?? item.description,
              unit_price: product?.price ?? product?.unit_cost ?? item.unit_price,
            }
          : item,
      ),
    );
  }

  function addItem() {
    setItems((prev) => [...prev, { description: "", quantity: 1, unit: "", unit_price: 0 }]);
  }

  const orderTotal = items.reduce(
    (sum, item) => sum + item.unit_price * item.quantity,
    0,
  );

  function removeItem(idx: number) {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  }

  function updateItem(
    idx: number,
    field: keyof ItemInput,
    value: string | number,
  ) {
    setItems((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item)),
    );
  }

  async function onSubmit(data: FormData) {
    const validItems = items.filter((i) => i.description.trim());
    try {
      await create.mutateAsync({
        work_order: data,
        items: validItems.map(({ product_id, unit_price, ...item }, idx) => ({
          ...item,
          position: idx,
          ...(product_id ? { product_id } : {}),
          ...(unit_price > 0 ? { unit_price } : {}),
        })),
      });
      toast.success(t("createSuccess"));
      onClose();
    } catch (err: any) {
      toast.error(tc("error"), {
        description: err.response?.data?.details?.[0],
      });
    }
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="right"
        style={{ width: "min(92vw, 960px)", maxWidth: "none" }}
        className="p-0 flex flex-col gap-0"
      >
        <SheetHeader className="px-6 py-4 border-b border-zinc-100 shrink-0">
          <SheetTitle className="text-base">{t("new")}</SheetTitle>
        </SheetHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col flex-1 overflow-hidden"
        >
          {/* Two-column body */}
          <div className="flex-1 grid grid-cols-[1fr_1.4fr] divide-x divide-zinc-100 overflow-hidden">
            {/* ── Left: order details ── */}
            <div className="overflow-y-auto px-6 py-6 space-y-5">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
                Detalles de la orden
              </p>

              {/* Title */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-zinc-600">
                  {t("titleLabel")}
                </Label>
                <Input
                  {...register("title")}
                  placeholder={t("titlePlaceholder")}
                />
                {errors.title && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle size={11} />
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-zinc-600">
                  {t("description")}
                </Label>
                <textarea
                  {...register("description")}
                  rows={3}
                  placeholder="Detalles adicionales..."
                  className={textareaCls}
                />
              </div>

              {/* Priority + Assignee */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-zinc-600 flex items-center gap-1.5">
                    <span
                      className={`inline-block w-2 h-2 rounded-full shrink-0 ${PRIORITY_DOT[selectedPriority] ?? "bg-yellow-400"}`}
                    />
                    {t("priority")}
                  </Label>
                  <select {...register("priority")} className={selectCls}>
                    {(["low", "medium", "high", "urgent"] as const).map((p) => (
                      <option key={p} value={p}>
                        {t(`priorities.${p}`)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-zinc-600">
                    {t("assignTo")}
                  </Label>
                  <select {...register("employee_id")} className={selectCls}>
                    <option value="">{t("unassigned")}</option>
                    {employees.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Due date */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-zinc-600">
                  {t("dueDate")}
                </Label>
                <Input {...register("due_date")} type="datetime-local" />
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-zinc-600">
                  {t("notes")}
                </Label>
                <textarea
                  {...register("notes")}
                  rows={4}
                  placeholder="Instrucciones especiales..."
                  className={textareaCls}
                />
              </div>
            </div>

            {/* ── Right: tasks ── */}
            <div className="overflow-y-auto px-6 py-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
                  {t("items")}
                  <span className="text-zinc-300 font-normal ml-1.5 normal-case tracking-normal">
                    ({items.length})
                  </span>
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addItem}
                  className="h-7 text-xs gap-1.5"
                >
                  <Plus size={12} />
                  {t("addItem")}
                </Button>
              </div>

              <div className="flex flex-col gap-3">
                {items.map((item, idx) => {
                  const subtotal = item.unit_price * item.quantity;
                  return (
                    <div
                      key={idx}
                      className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 space-y-3"
                    >
                      {/* Task number + delete */}
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wide">
                          Tarea {idx + 1}
                        </span>
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItem(idx)}
                            className="text-zinc-300 hover:text-red-400 transition-colors p-1 -mr-1"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>

                      {/* Product picker */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-zinc-400">
                          <Package size={12} />
                          <span className="text-[11px] font-medium">
                            {t("selectProduct")}
                          </span>
                        </div>
                        <select
                          value={item.product_id ?? ""}
                          onChange={(e) => selectProduct(idx, e.target.value)}
                          className="w-full h-9 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-700 focus:outline-none focus:ring-1 focus:ring-ring"
                        >
                          <option value="">Sin producto</option>
                          {Object.entries(productsByCategory).map(
                            ([cat, prods]) => (
                              <optgroup key={cat} label={cat}>
                                {prods.map((p) => (
                                  <option key={p.id} value={p.id}>
                                    {p.name}
                                    {p.stock != null
                                      ? `  (${p.stock} en stock)`
                                      : ""}
                                  </option>
                                ))}
                              </optgroup>
                            ),
                          )}
                        </select>
                      </div>

                      {/* Description */}
                      <Input
                        value={item.description}
                        onChange={(e) =>
                          updateItem(idx, "description", e.target.value)
                        }
                        placeholder={t("itemPlaceholder")}
                      />

                      {/* Qty + unit + unit_price */}
                      <div className="grid grid-cols-[auto_1fr_1fr_1fr] items-center gap-2">
                        <span className="text-xs text-zinc-400 shrink-0">
                          {t("quantity")}
                        </span>
                        <Input
                          value={item.quantity}
                          onChange={(e) =>
                            updateItem(idx, "quantity", Number(e.target.value))
                          }
                          type="number"
                          min={1}
                          className="text-center"
                        />
                        <select
                          value={item.unit}
                          onChange={(e) =>
                            updateItem(idx, "unit", e.target.value)
                          }
                          className="w-full h-9 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                        >
                          <option value="">{t("unit")}</option>
                          {Object.entries(unitGroups).map(([group, units]) => (
                            <optgroup key={group} label={group}>
                              {units.map((u) => (
                                <option key={u.id} value={u.key}>
                                  {u.name}
                                </option>
                              ))}
                            </optgroup>
                          ))}
                        </select>
                        <div className="relative">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-zinc-400 pointer-events-none">
                            $
                          </span>
                          <Input
                            value={item.unit_price}
                            onChange={(e) =>
                              updateItem(
                                idx,
                                "unit_price",
                                Number(e.target.value),
                              )
                            }
                            type="number"
                            min={0}
                            step="0.01"
                            placeholder="Precio"
                            className="pl-5"
                          />
                        </div>
                      </div>

                      {/* Subtotal row */}
                      {subtotal > 0 && (
                        <div className="flex justify-end">
                          <span className="text-xs text-zinc-400">
                            Subtotal:{" "}
                            <span className="font-semibold text-zinc-700">
                              ${subtotal.toFixed(2)}
                            </span>
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Order total */}
              {orderTotal > 0 && (
                <div className="flex justify-between items-center rounded-xl border border-zinc-200 bg-white px-4 py-3 mt-1">
                  <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                    Total
                  </span>
                  <span className="text-base font-bold text-zinc-800">
                    ${orderTotal.toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="shrink-0 px-6 py-4 border-t border-zinc-100 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              {tc("cancel")}
            </Button>
            <Button type="submit" disabled={create.isPending}>
              {create.isPending ? tc("saving") : tc("create")}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
