// src/lib/api.ts
import axios from "axios";
import { toast } from "sonner";
import { getApiT, getLocale } from "@/lib/api-i18n";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Inyecta el token, el idioma y la empresa activa en cada request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  config.headers["locale"] = getLocale();
  if (!config.headers["X-Company-Id"]) {
    const companyId = localStorage.getItem("selected_company_id");
    if (companyId) config.headers["X-Company-Id"] = companyId;
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const t = getApiT();
    const status: number | undefined = error.response?.status;
    const err = error.response?.data?.error;
    const message: string | undefined = err?.details ?? err?.message;

    if (status === 401) {
      const hasToken = !!localStorage.getItem("auth_token");
      if (hasToken) {
        localStorage.removeItem("auth_token");
        window.location.href = "/login";
      } else {
        toast.error(message ?? t.unauthorized);
      }
      return Promise.reject(error);
    }

    if (status === 403 && err?.code === "subscription_expired") {
      toast.error(t.subscriptionExpired);
      return Promise.reject(error);
    }

    const STATUS_MESSAGES: Record<number, string> = {
      400: t.invalidRequest,
      403: t.forbidden,
      404: t.notFound,
      409: t.conflict,
      422: t.validation,
      500: t.serverError,
      502: t.badGateway,
      503: t.serviceUnavailable,
    };

    const description =
      message ??
      (status ? (STATUS_MESSAGES[status] ?? t.unexpected) : t.noConnection);

    toast.error(description);

    return Promise.reject(error);
  },
);
