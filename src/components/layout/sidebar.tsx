// src/components/layout/sidebar.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Users, Package, LayoutDashboard, Building2 } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { useSidebar } from "./sidebar-context";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const locale = useLocale();
  const { user } = useAuthStore();
  const { open } = useSidebar();

  const NAV = [
    { href: `/${locale}/dashboard`, label: t("dashboard"), icon: LayoutDashboard },
    { href: `/${locale}/empleados`, label: t("employees"), icon: Users },
    { href: `/${locale}/inventario`, label: t("inventory"), icon: Package },
  ];

  return (
    <aside
      className={cn(
        "min-h-screen border-r border-zinc-200 bg-white flex flex-col shrink-0 transition-all duration-200",
        open ? "w-56" : "w-14",
      )}
    >
      <div
        className={cn(
          "h-14 border-b border-zinc-100 flex items-center shrink-0",
          open ? "px-5" : "justify-center",
        )}
      >
        <Building2 size={18} className="text-zinc-500 shrink-0" />
        {open && (
          <span className="ml-2 font-medium text-sm text-zinc-800 truncate">
            {user?.company?.name || "Grupo Bothi"}
          </span>
        )}
      </div>

      <nav className={cn("flex-1 py-4 space-y-0.5", open ? "px-3" : "px-2")}>
        {NAV.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            title={!open ? label : undefined}
            className={cn(
              "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors",
              !open && "justify-center px-2",
              pathname === href
                ? "bg-zinc-100 text-zinc-900 font-medium"
                : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800",
            )}
          >
            <Icon size={16} className="shrink-0" />
            {open && label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
