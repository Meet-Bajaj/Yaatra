"use client";

import { create } from "zustand";

interface Driver {
  id: string;
  name: string;
  avatarUrl?: string;
  rating: number;
  vehicle: { make: string; model: string; licensePlate: string };
}

interface ActiveTripState {
  tripId: string | null;
  status: string | null;
  driver: Driver | null;
  pickup: { address: string; lat: number; lng: number } | null;
  dropoff: { address: string; lat: number; lng: number } | null;
  fareEstimate: number | null;
  eta: number | null;
  driverLocation: { lat: number; lng: number } | null;
  setTrip: (trip: Partial<ActiveTripState>) => void;
  updateDriverLocation: (loc: { lat: number; lng: number }) => void;
  clearTrip: () => void;
}

export const useActiveTripStore = create<ActiveTripState>((set) => ({
  tripId: null,
  status: null,
  driver: null,
  pickup: null,
  dropoff: null,
  fareEstimate: null,
  eta: null,
  driverLocation: null,
  setTrip: (trip) => set((state) => ({ ...state, ...trip })),
  updateDriverLocation: (loc) => set({ driverLocation: loc }),
  clearTrip: () =>
    set({
      tripId: null,
      status: null,
      driver: null,
      pickup: null,
      dropoff: null,
      fareEstimate: null,
      eta: null,
      driverLocation: null,
    }),
}));
