"use client";

import { create } from "zustand";

interface DriverPosition {
  lat: number;
  lng: number;
  speedKmh?: number;
  recordedAt?: string;
}

interface LocationState {
  driverPosition: DriverPosition | null;
  tripId: string | null;
  setDriverPosition: (pos: DriverPosition | null) => void;
  setTripId: (id: string | null) => void;
  clear: () => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  driverPosition: null,
  tripId: null,
  setDriverPosition: (pos) => set({ driverPosition: pos }),
  setTripId: (id) => set({ tripId: id }),
  clear: () => set({ driverPosition: null, tripId: null }),
}));
