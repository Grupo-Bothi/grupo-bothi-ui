"use client";
import { useTranslations } from "next-intl";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppRouter } from "@/hooks/use-router";

export default function SuscripcionCanceladoPage() {
  const t = useTranslations("subscription");
  const router = useAppRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-6">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-zinc-100">
        <XCircle size={32} className="text-zinc-400" />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-zinc-900">{t("cancelledTitle")}</h1>
        <p className="text-sm text-zinc-500 max-w-sm">{t("cancelledDesc")}</p>
      </div>
      <Button variant="outline" onClick={() => router.push("/suscripcion")}>
        {t("cancelledBack")}
      </Button>
    </div>
  );
}
