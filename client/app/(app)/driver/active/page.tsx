"use client";

import { useState } from "react";
import { MapPin, Phone, Share2, Check } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { API } from "@/lib/endpoints";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

interface ActiveTrip {
  id: string;
  pickupAddress?: string;
  dropoffAddress?: string;
  riderName?: string;
  riderCount?: number;
  status: string;
}

export default function DriverActivePage() {
  const queryClient = useQueryClient();
  const [tripId, setTripId] = useState<string | null>(null);

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

  return (
    <div className="animate-fade-in space-y-4">
      <h1 className="text-2xl font-bold text-white">Active Trip</h1>

      <div className="relative h-48 rounded-2xl border border-white/10 bg-[#0a0a0a] overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="mx-auto mb-2 h-8 w-8 text-white/30" />
            <p className="text-xs text-white/40">Navigation view</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-4 space-y-3">
        <div className="flex items-center gap-2 text-sm text-white/60">
          <MapPin className="h-4 w-4 text-white/30" />
          <span>Pickup: {trip.pickupAddress || "—"}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-white/60">
          <MapPin className="h-4 w-4 text-white/30" />
          <span>Drop: {trip.dropoffAddress || "—"}</span>
        </div>
      </div>

      {trip.riderName && (
        <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white">
              {trip.riderName[0]}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{trip.riderName}</p>
              <p className="text-xs text-white/40">{trip.riderCount || 1} rider{(trip.riderCount || 1) > 1 ? "s" : ""}</p>
            </div>
            <div className="flex gap-1">
              <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-colors">
                <Phone className="h-4 w-4" />
              </button>
              <button
                onClick={() => shareMutation.mutate(trip.id)}
                disabled={shareMutation.isPending}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-colors disabled:opacity-50"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => tripId && arriveMutation.mutate(tripId)}
          disabled={!tripId || arriveMutation.isPending}
        >
          {arriveMutation.isPending ? "Updating..." : "Arrived at Pickup"}
        </Button>
        <Button
          className="flex-1"
          onClick={() => tripId && completeMutation.mutate(tripId)}
          disabled={!tripId || completeMutation.isPending}
        >
          {completeMutation.isPending ? "Completing..." : "Complete Trip"}
        </Button>
      </div>
    </div>
  );
}
