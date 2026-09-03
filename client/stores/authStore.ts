"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface User {
  id: string;
  phone: string;
  name: string;
  email?: string;
  role: string;
  status: string;
  gender?: string;
  city?: string;
  avatarUrl?: string;
  referralCode?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  onboardingComplete: boolean;
  _hasHydrated: boolean;
  setAuth: (user: User, token: string) => void;
  setOnboardingComplete: (value: boolean) => void;
  updateUser: (user: Partial<User>) => void;
  logout: () => void;
  setHasHydrated: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      onboardingComplete: false,
      _hasHydrated: false,
      setAuth: (user, token) => set({ user, token }),
      setOnboardingComplete: (value) => set({ onboardingComplete: value }),
      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
      logout: () => {
        set({ user: null, token: null, onboardingComplete: false });
        if (typeof window !== "undefined") {
          localStorage.removeItem("yaatra-auth");
        }
      },
      setHasHydrated: (value) => set({ _hasHydrated: value }),
    }),
    {
      name: "yaatra-auth",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
