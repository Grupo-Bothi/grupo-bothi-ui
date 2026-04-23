"use client";
import { useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useAppRouter } from "@/hooks/use-router";

export default function SuscripcionExitoPage() {
  const t = useTranslations("subscription");
  const locale = useLocale();
  const router = useAppRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["subscription"] });
  }, [queryClient]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-6">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
        <CheckCircle2 size={32} className="text-green-600" />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-zinc-900">{t("successTitle")}</h1>
        <p className="text-sm text-zinc-500 max-w-sm">{t("successDesc")}</p>
      </div>
      <Button onClick={() => router.push("/dashboard")}>{t("successRedirect")}</Button>
    </div>
  );
}
