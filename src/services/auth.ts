// src/services/auth.ts
import { apiClient } from "@/lib/api";

export const resetPassword = (email: string): Promise<void> =>
  apiClient
    .post("/api/v1/passwords/reset", { email })
    .then((r) => r.data);

export const setPassword = (
  token: string,
  new_password: string,
  new_password_confirmation: string
): Promise<void> =>
  apiClient
    .put("/api/v1/passwords/update_with_token", {
      token,
      new_password,
      new_password_confirmation,
    })
    .then((r) => r.data);
