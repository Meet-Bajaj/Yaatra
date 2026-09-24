"use client";

import { useEffect, useRef, useCallback } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useLocationStore } from "@/stores/locationStore";
import { getSocket } from "@/lib/socket";

const LOCATION_INTERVAL_MS = 5000; // send every 5s
const LOCATION_HIGH_ACCURACY = true;
const LOCATION_TIMEOUT_MS = 10000;
const LOCATION_MAX_AGE_MS = 5000;

export function useDriverLocation(tripId: string | null) {
  const token = useAuthStore((s) => s.token);
  const hasHydrated = useAuthStore((s) => s._hasHydrated);
  const setDriverPosition = useLocationStore((s) => s.setDriverPosition);
  const watchIdRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastPositionRef = useRef<{ lat: number; lng: number } | null>(null);

  const sendLocationUpdate = useCallback((lat: number, lng: number) => {
    const socket = getSocket();
    if (!socket.connected || !tripId) return;

    socket.emit(
      "location:update",
      { tripId, lat, lng },
      (response: { event?: string; data?: { locationId?: string; message?: string } }) => {
        if (response?.event === "error") {
          console.warn("[driver-location] server error:", response.data?.message);
        }
      }
    );

    lastPositionRef.current = { lat, lng };
    setDriverPosition({ lat, lng });
  }, [tripId, setDriverPosition]);

  useEffect(() => {
    if (!hasHydrated || !token || !tripId) return;

    const socket = getSocket();

    // Join trip room
    const userId = useAuthStore.getState().user?.id;
    if (userId) {
      socket.emit("join:trip", { tripId, userId }, (response: { event?: string; data?: { message?: string } }) => {
        if (response?.event === "error") {
          console.warn("[driver-location] join trip error:", response.data?.message);
        }
      });
    }

    // Start watching position
    if ("geolocation" in navigator) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude: lat, longitude: lng } = position.coords;
          sendLocationUpdate(lat, lng);
        },
        (error) => {
          console.warn("[driver-location] geolocation error:", error.message);
        },
        {
          enableHighAccuracy: LOCATION_HIGH_ACCURACY,
          timeout: LOCATION_TIMEOUT_MS,
          maximumAge: LOCATION_MAX_AGE_MS,
        }
      );
    }

    // Backup interval: send last known position periodically
    intervalRef.current = setInterval(() => {
      if (lastPositionRef.current) {
        sendLocationUpdate(lastPositionRef.current.lat, lastPositionRef.current.lng);
      }
    }, LOCATION_INTERVAL_MS);

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      lastPositionRef.current = null;
      setDriverPosition(null);
    };
  }, [hasHydrated, token, tripId, sendLocationUpdate, setDriverPosition]);
}
