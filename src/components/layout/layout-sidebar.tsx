"use client";
import { useAuthStore } from "@/store/auth";
import { Sidebar } from "./sidebar";
import { SuperAdminSidebar } from "./super-admin-sidebar";

export function LayoutSidebar() {
  const { user } = useAuthStore();
  if (user?.role === "super_admin") return <SuperAdminSidebar />;
  return <Sidebar />;
}
