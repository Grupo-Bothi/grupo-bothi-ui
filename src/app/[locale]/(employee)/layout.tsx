// src/app/[locale]/(employee)/layout.tsx
import { EmployeeShell } from "@/components/layout/employee-shell";

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <EmployeeShell>{children}</EmployeeShell>;
}
