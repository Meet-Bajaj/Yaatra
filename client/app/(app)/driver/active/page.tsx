"use client";

import { useState } from "react";
import { MapPin, Phone, Share2, Check } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { API } from "@/lib/endpoints";
import { useLocationStore } from "@/stores/locationStore";
import { useDriverLocation } from "@/hooks/use-driver-location";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { LiveTrackingMap } from "@/components/maps/live-tracking-map";

interface ActiveTrip {
  id: string;
  pickupAddress?: string;
  dropoffAddress?: string;
  riderName?: string;
  riderCount?: number;
  status: string;
  pickupLat?: number;
  pickupLng?: number;
  dropoffLat?: number;
  dropoffLng?: number;
}

export default function DriverActivePage() {
  const queryClient = useQueryClient();
  const { driverPosition } = useLocationStore();
  const [tripId, setTripId] = useState<string | null>(null);

  // Start sending location updates when trip is active
  useDriverLocation(tripId);

  const { data: trip, isLoading } = useQuery({
    queryKey: ["driver-active-trip"],
    queryFn: async () => {
      try {
        const res = await api.get("/driver/requests");
        const trips = Array.isArray(res.data) ? res.data : [];
        const active = trips.find((t: ActiveTrip) => t.status === "ACTIVE" || t.status === "IN_PROGRESS");
        if (active) setTripId(active.id);
        return active as ActiveTrip | undefined;
      } catch {
        return undefined;
      }
    },
  });

  const arriveMutation = useMutation({
    mutationFn: (id: string) => api.post(`/driver/trips/${id}/arrive`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["driver-active-trip"] }),
  });

  const completeMutation = useMutation({
    mutationFn: (id: string) => api.post(`/driver/trips/${id}/complete`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["driver-active-trip"] });
      queryClient.invalidateQueries({ queryKey: ["driver-earnings"] });
    },
  });

  const shareMutation = useMutation({
    mutationFn: (id: string) => api.post(API.safety.tripShare(id)),
    onSuccess: (res) => {
      const link = res.data?.shareUrl || res.data?.link;
      if (link && navigator.share) {
        navigator.share({ title: "Trip location", url: link }).catch(() => {});
      } else if (link) {
        navigator.clipboard.writeText(link);
      }
    },
  });

  if (isLoading) {
    return (
      <div className="animate-fade-in space-y-4">
        <h1 className="text-2xl font-bold text-white">Active Trip</h1>
        <div className="h-48 animate-pulse rounded-2xl bg-white/5" />
        <div className="h-24 animate-pulse rounded-2xl bg-white/5" />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="animate-fade-in space-y-4">
        <h1 className="text-2xl font-bold text-white">Active Trip</h1>
        <EmptyState title="No active trip" description="You don't have an active trip right now" />
      </div>
    );
  }

  const pickup = trip.pickupLat && trip.pickupLng
    ? { lat: trip.pickupLat, lng: trip.pickupLng }
    : { lat: 12.9352, lng: 77.6245 };
  const dropoff = trip.dropoffLat && trip.dropoffLng
    ? { lat: trip.dropoffLat, lng: trip.dropoffLng }
    : { lat: 12.9716, lng: 77.5946 };

  return (
    <div className="animate-fade-in space-y-4">
      <h1 className="text-2xl font-bold text-white">Active Trip</h1>

      <LiveTrackingMap
        pickup={pickup}
        dropoff={dropoff}
        driverPosition={driverPosition}
        height="192px"
      />

      <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-4 space-y-3">
        <div className="flex items-center gap-2 text-sm text-white/60">
          <MapPin className="h-4 w-4 text-white/30" />
          <span>Pickup: {trip.pickupAddress || "—"}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-white/60">
          <MapPin className="h-4 w-4 text-white/30" />
          <span>Dropoff: {trip.dropoffAddress || "—"}</span>
        </div>
        <div className="border-t border-white/10 pt-3">
          <p className="text-sm text-white">{trip.riderName || "Rider"}</p>
          <p className="text-xs text-white/40">{trip.riderCount || 1} passenger{(trip.riderCount || 1) > 1 ? "s" : ""}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => shareMutation.mutate(trip.id)}
          className="flex h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 text-sm text-white/60 hover:bg-white/10 flex-1"
        >
          <Share2 className="h-4 w-4" /> Share
        </button>
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({ title: "Call rider" }).catch(() => {});
            }
          }}
          className="flex h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 text-sm text-white/60 hover:bg-white/10 flex-1"
        >
          <Phone className="h-4 w-4" /> Call
        </button>
      </div>

      {trip.status === "ACTIVE" && (
        <Button
          className="w-full"
          onClick={() => arriveMutation.mutate(trip.id)}
          disabled={arriveMutation.isPending}
        >
          <Check className="h-4 w-4" /> Mark Arrived
        </Button>
      )}
      {trip.status === "IN_PROGRESS" && (
        <Button
          className="w-full"
          onClick={() => completeMutation.mutate(trip.id)}
          disabled={completeMutation.isPending}
        >
          <Check className="h-4 w-4" /> Complete Trip
        </Button>
      )}
    </div>
  );
}
