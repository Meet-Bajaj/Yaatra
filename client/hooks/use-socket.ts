"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useNotificationStore } from "@/stores/notificationStore";
import { useLocationStore } from "@/stores/locationStore";
import { connectSocket, disconnectSocket } from "@/lib/socket";

export function useSocket() {
  const token = useAuthStore((s) => s.token);
  const hasHydrated = useAuthStore((s) => s._hasHydrated);
  const addNotification = useNotificationStore((s) => s.addNotification);
  const setUnreadCount = useNotificationStore((s) => s.setUnreadCount);
  const setDriverPosition = useLocationStore((s) => s.setDriverPosition);
  const connectedRef = useRef(false);

  useEffect(() => {
    if (!hasHydrated || !token) return;

    const socket = connectSocket(token);

    const onConnect = () => {
      connectedRef.current = true;
    };

    const onDisconnect = () => {
      connectedRef.current = false;
    };

    const onNotification = (data: {
      id: string;
      type: string;
      payload: Record<string, unknown>;
      readAt: string | null;
      createdAt: string;
    }) => {
      addNotification(data);
    };

    const onUnreadCount = (data: { count: number }) => {
      setUnreadCount(data.count);
    };

    const onRideUpdate = (data: { rideId: string; status: string }) => {
      console.log("[socket] ride update:", data);
    };

    const onLocationUpdate = (data: { lat: number; lng: number; speedKmh?: number; recordedAt?: string }) => {
      setDriverPosition({ lat: data.lat, lng: data.lng, speedKmh: data.speedKmh, recordedAt: data.recordedAt });
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("notification", onNotification);
    socket.on("unread_count", onUnreadCount);
    socket.on("ride:update", onRideUpdate);
    socket.on("trip.location", onLocationUpdate);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("notification", onNotification);
      socket.off("unread_count", onUnreadCount);
      socket.off("ride:update", onRideUpdate);
      socket.off("trip.location", onLocationUpdate);
      disconnectSocket();
      connectedRef.current = false;
    };
  }, [hasHydrated, token, addNotification, setUnreadCount, setDriverPosition]);

  return null;
}
