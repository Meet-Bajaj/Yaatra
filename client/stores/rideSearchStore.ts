"use client";

import { create } from "zustand";

interface RideSearchState {
  pickup: { address: string; lat: number; lng: number } | null;
  dropoff: { address: string; lat: number; lng: number } | null;
  filters: {
    type: "all" | "carpool" | "professional";
    womenOnly: boolean;
    sortBy: "price" | "time" | "rating";
  };
  setPickup: (pickup: { address: string; lat: number; lng: number } | null) => void;
  setDropoff: (dropoff: { address: string; lat: number; lng: number } | null) => void;
  setFilters: (filters: Partial<RideSearchState["filters"]>) => void;
  reset: () => void;
}

const initialFilters = {
  type: "all" as const,
  womenOnly: false,
  sortBy: "price" as const,
};

export const useRideSearchStore = create<RideSearchState>((set) => ({
  pickup: null,
  dropoff: null,
  filters: initialFilters,
  setPickup: (pickup) => set({ pickup }),
  setDropoff: (dropoff) => set({ dropoff }),
  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),
  reset: () => set({ pickup: null, dropoff: null, filters: initialFilters }),
}));
