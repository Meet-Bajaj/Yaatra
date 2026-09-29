"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Share2, AlertTriangle, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { API } from "@/lib/endpoints";
import { useLocationStore } from "@/stores/locationStore";
import { Button } from "@/components/ui/button";
import { RatingBar } from "@/components/ui/rating-bar";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { LiveTrackingMap } from "@/components/maps/live-tracking-map";
import { EmptyState } from "@/components/ui/empty-state";

interface ActiveTrip {
  id: string;
  status: string;
  pickupAddress?: string;
  dropAddress?: string;
  pickupLat?: number;
  pickupLng?: number;
  dropLat?: number;
  dropLng?: number;
  driver?: { id: string; name: string; avatarUrl?: string };
  fareFinal?: number | string;
  fareEstimate?: number | string;
}

export default function ActiveTripPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { driverPosition } = useLocationStore();
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const { data: trip, isLoading } = useQuery({
    queryKey: ["active-trip"],
    queryFn: async () => {
      try {
        const res = await api.get(API.rides.upcoming);
        const trips = Array.isArray(res.data) ? res.data : [];
        const active = trips.find(
          (t: ActiveTrip) =>
            t.status === "SEARCHING" ||
            t.status === "DRIVER_ASSIGNED" ||
            t.status === "ARRIVING" ||
            t.status === "IN_PROGRESS"
        );
        return (active ?? null) as ActiveTrip | null;
      } catch {
        return null;
      }
    },
    refetchInterval: 5000, // poll every 5s for status changes
  });

  const cancelMutation = useMutation({
    mutationFn: (tripId: string) => api.post(API.rides.cancel(tripId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["active-trip"] });
      queryClient.invalidateQueries({ queryKey: ["rides-upcoming"] });
      router.push("/dashboard");
    },
  });

  const sosMutation = useMutation({
    mutationFn: () => api.post(API.safety.emergency),
  });

  const shareTripMutation = useMutation({
    mutationFn: (tripId: string) => api.post(API.safety.tripShare(tripId)),
    onSuccess: (res) => {
      const link = res.data?.shareUrl || res.data?.link;
      if (link && navigator.share) {
        navigator.share({ title: "Share my trip", url: link }).catch(() => {});
      } else if (link) {
        navigator.clipboard.writeText(link);
      }
    },
  });

  const rateMutation = useMutation({
    mutationFn: ({ tripId, score, cmt }: { tripId: string; score: number; cmt?: string }) =>
      api.post(API.rating.create, { tripId, score, comment: cmt }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rides-history"] });
      setShowRating(false);
      router.push("/dashboard");
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
    : undefined;
  const dropoff = trip.dropLat && trip.dropLng
    ? { lat: trip.dropLat, lng: trip.dropLng }
    : undefined;

  const statusLabel =
    trip.status === "SEARCHING"
      ? "Finding a driver..."
      : trip.status === "DRIVER_ASSIGNED"
        ? "Driver assigned"
        : trip.status === "ARRIVING"
          ? "Driver is arriving"
          : trip.status === "IN_PROGRESS"
            ? "Trip in progress"
            : trip.status;

  return (
    <div className="animate-fade-in space-y-4">
      <div className="relative">
        <LiveTrackingMap
          pickup={pickup}
          dropoff={dropoff}
          driverPosition={driverPosition}
          height="220px"
          className="md:h-[256px]"
        />
        <div className="absolute bottom-3 left-3 z-10 rounded-lg bg-black/80 px-3 py-1.5 backdrop-blur-sm">
          <p className="text-xs font-medium text-white">{statusLabel}</p>
        </div>
      </div>

      {trip.driver?.name && (
        <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white shrink-0">
              {trip.driver.name?.[0] || "D"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">{trip.driver.name}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => shareTripMutation.mutate(trip.id)}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white/60 hover:bg-white/15 transition-colors touch-target"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-4 space-y-3">
        {trip.pickupAddress && (
          <div className="flex items-center gap-2 text-sm text-white/60">
            <div className="h-2 w-2 rounded-full bg-green-500 shrink-0" />
            <span>{trip.pickupAddress}</span>
          </div>
        )}
        {trip.pickupAddress && trip.dropAddress && <div className="ml-1 h-4 w-px bg-white/10" />}
        {trip.dropAddress && (
          <div className="flex items-center gap-2 text-sm text-white/60">
            <div className="h-2 w-2 rounded-full bg-red-500 shrink-0" />
            <span>{trip.dropAddress}</span>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {trip.status !== "COMPLETED" && trip.status !== "CANCELLED" && (
          <Button
            variant="outline"
            className="flex-1 border-red-500/30 text-red-400"
            onClick={() => cancelMutation.mutate(trip.id)}
            disabled={cancelMutation.isPending}
          >
            {cancelMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Cancel"}
          </Button>
        )}
        <Button
          className="flex-1"
          onClick={() => {
            navigator.vibrate?.(200);
            sosMutation.mutate();
          }}
        >
          <AlertTriangle className="h-4 w-4" /> SOS
        </Button>
      </div>

      {trip.status === "COMPLETED" && (
        <Button className="w-full" size="lg" onClick={() => setShowRating(true)}>
          Rate Trip
        </Button>
      )}

      <BottomSheet open={showRating} onClose={() => setShowRating(false)} title="Rate your trip">
        <div className="space-y-4">
          <RatingBar value={rating} onChange={setRating} />
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment (optional)"
            className="h-24 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none resize-none touch-target"
          />
          <Button
            className="w-full"
            size="lg"
            onClick={() => rateMutation.mutate({ tripId: trip.id, score: rating, cmt: comment })}
            disabled={rating === 0 || rateMutation.isPending}
          >
            {rateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit Rating"}
          </Button>
        </div>
      </BottomSheet>
    </div>
  );
}
