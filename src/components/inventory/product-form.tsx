// src/components/inventory/product-form.tsx
"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { inventoryService } from "@/services/inventory";
import type { Product } from "@/types";

interface ProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
}

export function ProductForm({ open, onOpenChange, product }: ProductFormProps) {
  const t = useTranslations("inventory");
  const tc = useTranslations("common");
  const qc = useQueryClient();
  const isEdit = !!product;

  const schema = z.object({
    sku: z.string().min(1, t("skuRequired")),
    name: z.string().min(1, t("nameRequired")),
    min_stock: z.coerce.number().int().min(0),
    unit_cost: z.coerce.number().min(0),
  });

  type FormValues = z.infer<typeof schema>;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { sku: "", name: "", min_stock: 0, unit_cost: 0 },
  });

  const { data: productData } = useQuery({
    queryKey: ["products", product?.id],
    queryFn: () => inventoryService.getById(product!.id),
    enabled: open && isEdit,
  });

  useEffect(() => {
    if (!open) return;
    const source = isEdit ? productData : null;
    reset({
      sku: source?.sku ?? "",
      name: source?.name ?? "",
      min_stock: source?.min_stock ?? 0,
      unit_cost: source?.unit_cost ?? 0,
    });
  }, [open, productData, isEdit, reset]);

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      isEdit
        ? inventoryService.update(product!.id, values)
        : inventoryService.create(values),
    onSuccess: () => {
      toast.success(isEdit ? t("updateSuccess") : t("createSuccess"));
      qc.invalidateQueries({ queryKey: ["products"] });
      onOpenChange(false);
    },
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md flex flex-col gap-0 p-0">

        <SheetHeader className="px-6 py-5 border-b border-zinc-100">
          <SheetTitle className="text-base">
            {isEdit ? t("editTitle") : t("createTitle")}
          </SheetTitle>
        </SheetHeader>

        <form
          onSubmit={handleSubmit((v) => mutation.mutate(v))}
          className="flex flex-col flex-1"
        >
          <div className="flex-1 px-6 py-6 space-y-5 overflow-y-auto">

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-zinc-700">{t("sku")}</Label>
                <Input placeholder={t("skuPlaceholder")} {...register("sku")} />
                {errors.sku && (
                  <p className="text-xs text-red-500">{errors.sku.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-zinc-700">{t("unitCost")}</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  {...register("unit_cost")}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-700">{t("name")}</Label>
              <Input placeholder={t("namePlaceholder")} {...register("name")} />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-700">{t("minStock")}</Label>
              <Input
                type="number"
                min="0"
                placeholder="0"
                {...register("min_stock")}
              />
            </div>

          </div>

          <div className="px-6 py-4 border-t border-zinc-100 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {tc("cancel")}
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? tc("saving") : tc("save")}
            </Button>
          </div>
        </form>

      </SheetContent>
    </Sheet>
  );
}
