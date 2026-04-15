/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/[locale]/(auth)/login/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const locale = useLocale();
  const login = useAuthStore((s) => s.login);
  const [loading, setLoading] = useState(false);

  const loginSchema = z.object({
    email: z.string().email(t("emailInvalid")),
    password: z.string().min(1, t("passwordRequired")),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: any) {
    setLoading(true);
    try {
      await login(data.email, data.password);
      router.push(`/${locale}/dashboard`);
    } catch {
      // error manejado por el interceptor
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-white">

      {/* Shifting gradient base layer */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(-45deg, #eef2ff, #fdf4ff, #eff6ff, #fae8ff, #eef2ff)",
          backgroundSize: "400% 400%",
          animation: "gradient-shift 14s ease infinite",
        }}
      />

      {/* Rotating conic ring — forward */}
      <div
        className="absolute w-[900px] h-[900px] rounded-full blur-[80px] opacity-30 pointer-events-none"
        style={{
          background: "conic-gradient(from 0deg, #6366f1, #8b5cf6, #06b6d4, #a78bfa, #6366f1)",
          animation: "slow-spin 28s linear infinite",
        }}
      />

      {/* Rotating conic ring — reverse, offset */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full blur-[60px] opacity-20 pointer-events-none"
        style={{
          background: "conic-gradient(from 120deg, #a855f7, #818cf8, #38bdf8, #c084fc, #a855f7)",
          animation: "slow-spin 20s linear infinite reverse",
        }}
      />

      <Card className="w-full max-w-sm relative z-10 shadow-xl bg-white/80 backdrop-blur-md border-white/60">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-medium">{t("title")}</CardTitle>
          <p className="text-sm text-zinc-500">{t("subtitle")}</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label>{t("email")}</Label>
              <Input
                type="email"
                placeholder={t("emailPlaceholder")}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-red-500">
                  {errors.email.message as string}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>{t("password")}</Label>
              <Input
                type="password"
                placeholder={t("passwordPlaceholder")}
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs text-red-500">
                  {errors.password.message as string}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t("submitting") : t("submit")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
