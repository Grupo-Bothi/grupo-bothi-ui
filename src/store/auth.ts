// src/store/auth.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiClient } from "@/lib/api";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchMe: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        const res = await apiClient.post("/api/v1/auth/login", {
          email,
          password,
        });
        const { token, user } = res.data;
        localStorage.setItem("auth_token", token);
        document.cookie = `auth_token=${token}; path=/; max-age=${60 * 60 * 24}`;
        set({ token, user, isLoading: false });
      },

      logout: () => {
        localStorage.removeItem("auth_token");
        document.cookie = "auth_token=; path=/; max-age=0";
        set({ user: null, token: null });
        window.location.href = "/login";
      },

      fetchMe: async () => {
        const res = await apiClient.get("/api/v1/auth/me");
        set({ user: res.data.user });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ token: state.token, user: state.user }),
    },
  ),
);
