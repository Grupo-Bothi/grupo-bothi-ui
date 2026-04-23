// src/app/[locale]/(dashboard)/layout.tsx
import { LayoutSidebar } from "@/components/layout/layout-sidebar";
import { Header } from "@/components/layout/header";
import { SidebarProvider } from "@/components/layout/sidebar-context";
import { TrialBanner } from "@/components/layout/trial-banner";
import { SubscriptionGuard } from "@/components/layout/subscription-guard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-zinc-50">
        <LayoutSidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <Header />
          <TrialBanner />
          <SubscriptionGuard />
          <main className="flex-1 p-8 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
