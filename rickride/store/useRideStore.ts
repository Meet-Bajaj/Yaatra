import { create } from 'zustand';

import { Booking, DriverProfile, Trip } from '../services/types';

interface RideState {
  selectedTrip: Trip | null;
  activeBooking: Booking | null;
  trackedDriver: DriverProfile | null;
  latestDriverLocation: { longitude: number; latitude: number; timestamp: number } | null;
  setSelectedTrip: (trip: Trip | null) => void;
  setActiveBooking: (booking: Booking | null) => void;
  setTrackedDriver: (driver: DriverProfile | null) => void;
  setLatestDriverLocation: (
    location: { longitude: number; latitude: number; timestamp: number } | null
  ) => void;
  resetRide: () => void;
}

export const useRideStore = create<RideState>((set) => ({
  selectedTrip: null,
  activeBooking: null,
  trackedDriver: null,
  latestDriverLocation: null,
  setSelectedTrip: (selectedTrip) => set({ selectedTrip }),
  setActiveBooking: (activeBooking) => set({ activeBooking }),
  setTrackedDriver: (trackedDriver) => set({ trackedDriver }),
  setLatestDriverLocation: (latestDriverLocation) => set({ latestDriverLocation }),
  resetRide: () =>
    set({
      selectedTrip: null,
      activeBooking: null,
      trackedDriver: null,
      latestDriverLocation: null,
    }),
}));
