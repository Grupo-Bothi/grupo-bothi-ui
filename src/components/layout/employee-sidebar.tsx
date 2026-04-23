// src/components/layout/employee-sidebar.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import {
  ClipboardList,
  User,
  Receipt,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  collapsed: boolean;
  onToggle: () => void;
}

export function EmployeeSidebar({ collapsed, onToggle }: Props) {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const tw = useTranslations("workOrders");
  const tt = useTranslations("tickets");
  const tc = useTranslations("common");
  const locale = useLocale();

  const NAV = [
    {
      href: `/${locale}/mis-ordenes`,
      label: tw("myOrders"),
      icon: ClipboardList,
    },
    {
      href: `/${locale}/mis-tickets`,
      label: tt("myTickets"),
      icon: Receipt,
    },
    {
      href: `/${locale}/mi-perfil`,
      label: t("profile") ?? "Mi perfil",
      icon: User,
    },
  ];

  return (
    <aside
      className={cn(
        "min-h-screen border-r border-zinc-200 bg-white flex flex-col shrink-0 transition-[width] duration-200 overflow-hidden",
        collapsed ? "w-14" : "w-56",
      )}
    >
      {/* Logo / brand */}
      <div
        className={cn(
          "h-14 border-b border-zinc-100 flex items-center shrink-0",
          collapsed ? "justify-center px-0" : "px-5",
        )}
      >
        {collapsed ? (
          <span className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-4 h-4" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
            </svg>
          </span>
        ) : (
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-4 h-4" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
              </svg>
            </span>
            <div className="min-w-0">
              <p className="font-semibold text-sm text-zinc-900 leading-tight truncate">{tc("brandName")}</p>
              <p className="text-[10px] text-zinc-400 uppercase tracking-widest leading-tight">{tc("brandTagline")}</p>
            </div>
          </div>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {NAV.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={cn(
                "flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors",
                collapsed && "justify-center",
                isActive
                  ? "bg-zinc-100 text-zinc-900 font-medium"
                  : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800",
              )}
            >
              <Icon size={17} className="shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="px-2 py-3 border-t border-zinc-100">
        <button
          onClick={onToggle}
          title={collapsed ? "Expandir menú" : "Colapsar menú"}
          className={cn(
            "flex items-center gap-2.5 px-2.5 py-2 w-full rounded-md text-sm text-zinc-400 hover:bg-zinc-50 hover:text-zinc-700 transition-colors",
            collapsed && "justify-center",
          )}
        >
          {collapsed ? (
            <PanelLeftOpen size={17} />
          ) : (
            <PanelLeftClose size={17} />
          )}
          {!collapsed && <span className="text-xs">Colapsar</span>}
        </button>
      </div>
    </aside>
  );
}
