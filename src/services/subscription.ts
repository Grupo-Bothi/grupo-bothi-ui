import { apiClient } from "@/lib/api";
import type { Subscription, CheckoutResponse } from "@/types";

export const getSubscription = (): Promise<Subscription> =>
  apiClient.get("/api/v1/subscription").then((r) => r.data);

export const createCheckout = (
  plan: "business",
  successUrl: string,
  cancelUrl: string,
): Promise<CheckoutResponse> =>
  apiClient
    .post("/api/v1/subscription/checkout", {
      plan,
      success_url: successUrl,
      cancel_url: cancelUrl,
    })
    .then((r) => r.data);

// ── Super admin: opera sobre cualquier empresa pasando X-Company-Id explícito ──

// validateStatus < 500 evita que el error interceptor lance toast cuando la
// empresa tiene suscripción vencida (403). Devuelve null en ese caso.
export const getCompanySubscription = async (
  companyId: number,
): Promise<Subscription | null> => {
  const res = await apiClient.get("/api/v1/subscription", {
    headers: { "X-Company-Id": String(companyId) },
    validateStatus: (s) => s < 500,
  });
  if (res.status !== 200) return null;
  return res.data;
};

export const createCompanyCheckout = (
  companyId: number,
  plan: "business" | "enterprise",
  successUrl: string,
  cancelUrl: string,
): Promise<CheckoutResponse> =>
  apiClient
    .post(
      "/api/v1/subscription/checkout",
      { plan, success_url: successUrl, cancel_url: cancelUrl },
      { headers: { "X-Company-Id": String(companyId) } },
    )
    .then((r) => r.data);

export const cancelCompanySubscription = (companyId: number): Promise<void> =>
  apiClient
    .delete("/api/v1/subscription", {
      headers: { "X-Company-Id": String(companyId) },
    })
    .then((r) => r.data);
