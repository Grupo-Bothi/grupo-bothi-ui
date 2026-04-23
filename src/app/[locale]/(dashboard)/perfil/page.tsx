"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { UserRound } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Tab = "profile";

export default function PerfilPage() {
  const t = useTranslations("profile");
  const tRoles = useTranslations("adminUsers.roles");
  const { user } = useAuthStore();
  const [tab, setTab] = useState<Tab>("profile");

  const TABS = [
    { id: "profile" as Tab, label: t("tabProfile"), icon: UserRound },
  ];

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">{t("pageTitle")}</h1>
      </div>

      <div className="flex gap-1 border-b border-zinc-200">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors",
              tab === id
                ? "border-zinc-900 text-zinc-900"
                : "border-transparent text-zinc-500 hover:text-zinc-700",
            )}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {tab === "profile" && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">{t("tabProfile")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-[120px_1fr] gap-y-4 text-sm">
              <span className="text-zinc-500 font-medium">{t("name")}</span>
              <span className="text-zinc-900">
                {user?.first_name} {user?.last_name}
              </span>
              <span className="text-zinc-500 font-medium">{t("email")}</span>
              <span className="text-zinc-900">{user?.email}</span>
              <span className="text-zinc-500 font-medium">{t("role")}</span>
              <span className="text-zinc-900">
                {user?.role && user.role !== "super_admin" ? tRoles(user.role) : user?.role}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  );
}
