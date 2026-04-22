/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/use-work-orders.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import type { WorkOrder } from "@/types";

export function useWorkOrders(filters?: Record<string, string>) {
  const params = new URLSearchParams(filters).toString();
  return useQuery<WorkOrder[]>({
    queryKey: ["work-orders", filters],
    queryFn: () =>
      apiClient.get(`/api/v1/work_orders?${params}`).then((r) => r.data.results ?? r.data),
  });
}

export function useWorkOrder(id: number) {
  return useQuery<WorkOrder>({
    queryKey: ["work-orders", id],
    queryFn: () =>
      apiClient.get(`/api/v1/work_orders/${id}`).then((r) => r.data),
    enabled: !!id,
  });
}

export function useCreateWorkOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) =>
      apiClient.post("/api/v1/work_orders", data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["work-orders"] }),
  });
}

export function useUpdateWorkOrder(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) =>
      apiClient.put(`/api/v1/work_orders/${id}`, data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["work-orders"] }),
  });
}

export function useUpdateStatus(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (status: string) =>
      apiClient
        .patch(`/api/v1/work_orders/${id}/update_status`, { status })
        .then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["work-orders"] });
      qc.invalidateQueries({ queryKey: ["work-orders", id] });
    },
  });
}

export function useToggleItem(orderId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (itemId: number) =>
      apiClient
        .patch(`/api/v1/work_orders/${orderId}/items/${itemId}/toggle`, {})
        .then((r) => r.data),
    onSuccess: (data) => {
      qc.setQueryData(["work-orders", orderId], data);
      qc.invalidateQueries({ queryKey: ["work-orders"] });
    },
  });
}

export function useAddItem(orderId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) =>
      apiClient
        .post(`/api/v1/work_orders/${orderId}/items`, data)
        .then((r) => r.data),
    onSuccess: (data) => {
      qc.setQueryData(["work-orders", orderId], data);
      qc.invalidateQueries({ queryKey: ["work-orders"] });
    },
  });
}

export function useUpdateItem(orderId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, data }: { itemId: number; data: any }) =>
      apiClient
        .patch(`/api/v1/work_orders/${orderId}/items/${itemId}`, data)
        .then((r) => r.data),
    onSuccess: (data) => {
      qc.setQueryData(["work-orders", orderId], data);
      qc.invalidateQueries({ queryKey: ["work-orders"] });
    },
  });
}

export function useDeleteItem(orderId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (itemId: number) =>
      apiClient
        .delete(`/api/v1/work_orders/${orderId}/items/${itemId}`)
        .then((r) => r.data),
    onSuccess: (data) => {
      qc.setQueryData(["work-orders", orderId], data);
      qc.invalidateQueries({ queryKey: ["work-orders"] });
    },
  });
}

export function useDeleteWorkOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      apiClient.delete(`/api/v1/work_orders/${id}`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["work-orders"] }),
  });
}
