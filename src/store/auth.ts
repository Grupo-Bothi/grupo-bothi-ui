// src/store/auth.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiClient } from "@/lib/api";
import type { User } from "@/types";

const COMPANY_KEY = "selected_company_id";

interface AuthState {
  user: User | null;
  token: string | null;
  selectedCompanyId: number | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchMe: () => Promise<void>;
  setSelectedCompany: (id: number) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      selectedCompanyId: null,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        const res = await apiClient.post("/api/v1/auth/login", {
          email,
          password,
        });
        const { token, user } = res.data;
        const selectedCompanyId: number | null = user.companies?.[0]?.id ?? null;
        localStorage.setItem("auth_token", token);
        if (selectedCompanyId) localStorage.setItem(COMPANY_KEY, String(selectedCompanyId));
        document.cookie = `auth_token=${token}; path=/; max-age=${60 * 60 * 24}`;
        document.cookie = `user_role=${res.data.user.role}; path=/; max-age=${60 * 60 * 24}`;
        set({ token, user, selectedCompanyId, isLoading: false });
      },

      logout: () => {
        localStorage.removeItem("auth_token");
        localStorage.removeItem(COMPANY_KEY);
        document.cookie = "auth_token=; path=/; max-age=0";
        document.cookie = "user_role=; path=/; max-age=0";
        set({ user: null, token: null, selectedCompanyId: null });
        window.location.href = "/login";
      },

      fetchMe: async () => {
        const res = await apiClient.get("/api/v1/auth/me");
        set({ user: res.data.user });
      },

      setSelectedCompany: (id) => {
        localStorage.setItem(COMPANY_KEY, String(id));
        set({ selectedCompanyId: id });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        selectedCompanyId: state.selectedCompanyId,
      }),
    },
  ),
);
