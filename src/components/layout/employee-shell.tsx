// src/components/layout/employee-shell.tsx
"use client";
import { useState } from "react";
import { EmployeeSidebar } from "./employee-sidebar";
import { EmployeeHeader } from "./employee-header";

export function EmployeeShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <EmployeeSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <EmployeeHeader />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
