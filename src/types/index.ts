// src/types/index.ts
export interface User {
  id: number;
  email: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  role: "staff" | "manager" | "admin" | "owner";
  active: boolean;
  company?: Company;
}

export interface Company {
  id: number;
  name: string;
  slug: string;
  plan: "starter" | "business" | "enterprise";
}

export interface Employee {
  id: number;
  name: string;
  position?: string;
  department?: string;
  salary?: number | string;
  status: "active" | "inactive";
  created_at: string;
}

export interface Attendance {
  id: number;
  employee_id: number;
  checkin_at: string;
  checkout_at?: string;
  lat?: number;
  lng?: number;
  attendance_type: "normal" | "late" | "absent";
}

export interface Product {
  id: number;
  sku: string;
  name: string;
  stock: number;
  min_stock: number;
  unit_cost: number;
  low_stock: boolean;
}

export interface StockMovement {
  id: number;
  product_id: number;
  movement_type: "entry" | "exit" | "adjustment";
  qty: number;
  note?: string;
  created_at: string;
}

export interface PaginationInfo {
  page_size: number;
  page_index: number;
  total: number;
  page_start: number;
  page_end: number;
  pages_total: number;
}

export interface PaginatedResponse<T> {
  info: PaginationInfo;
  results: T[];
}

export interface ApiError {
  message: string;
  details?: string | string[];
}
