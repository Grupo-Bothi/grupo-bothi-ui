// src/components/layout/header.tsx
"use client";
import { useAuthStore } from "@/store/auth";
import { useTranslations } from "next-intl";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LocaleSwitcher } from "./locale-switcher";
import { useSidebar } from "./sidebar-context";
import { LogOut, Menu, UserRound } from "lucide-react";

function getInitials(firstName?: string, lastName?: string) {
  return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase() || "?";
}

export function Header() {
  const t = useTranslations("nav");
  const { user, logout } = useAuthStore();
  const { toggle } = useSidebar();

  return (
    <header className="h-14 px-4 border-b border-zinc-200 bg-white flex items-center justify-between gap-4 shrink-0">
      <button
        onClick={toggle}
        className="p-2 rounded-md text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800 transition-colors"
      >
        <Menu size={18} />
      </button>

      <div className="flex items-center gap-4 ml-auto">
      <LocaleSwitcher />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2.5 rounded-md px-2 py-1.5 hover:bg-zinc-50 transition-colors outline-none">
            <Avatar size="sm">
              <AvatarFallback>
                {getInitials(user?.first_name, user?.last_name)}
              </AvatarFallback>
            </Avatar>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-medium text-zinc-800 leading-tight">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs text-zinc-400 leading-tight">{user?.email}</p>
            </div>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem className="gap-2">
            <UserRound size={14} />
            {t("profile")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={logout}
            className="gap-2"
          >
            <LogOut size={14} />
            {t("logout")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      </div>
    </header>
  );
}
