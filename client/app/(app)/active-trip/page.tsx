"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Phone, Share2, AlertTriangle } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { API } from "@/lib/endpoints";
import { useLocationStore } from "@/stores/locationStore";
import { Button } from "@/components/ui/button";
import { RatingBar } from "@/components/ui/rating-bar";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { LiveTrackingMap } from "@/components/maps/live-tracking-map";

export default function ActiveTripPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { driverPosition } = useLocationStore();
  const [tripStatus, setTripStatus] = useState("arriving");
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const pickup = { lat: 12.9352, lng: 77.6245 };
  const dropoff = { lat: 12.9716, lng: 77.5946 };

  const cancelMutation = useMutation({
    mutationFn: (tripId: string) => api.post(API.rides.cancel(tripId)),
    onSuccess: () => {
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
    mutationFn: ({ tripId, score, comment }: { tripId: string; score: number; comment?: string }) =>
      api.post(API.rating.create, { tripId, score, comment }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rides-history"] });
      setShowRating(false);
      router.push("/dashboard");
    },
  });

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
          <p className="text-xs font-medium text-white">{tripStatus === "arriving" ? "Driver is arriving" : "Trip in progress"}</p>
          <p className="text-[10px] text-white/50">ETA: {tripStatus === "arriving" ? "3 min" : "18 min"}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white shrink-0">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white">Arjun K.</p>
            <p className="text-xs text-white/50 truncate">Swift Dzire - White - KA 01 AB 1234</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white/60 hover:bg-white/15 transition-colors touch-target">
              <Phone className="h-4 w-4" />
            </button>
            <button
              onClick={() => shareTripMutation.mutate("trip-1")}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white/60 hover:bg-white/15 transition-colors touch-target"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-4 space-y-3">
        <div className="flex items-center gap-2 text-sm text-white/60">
          <div className="h-2 w-2 rounded-full bg-green-500 shrink-0" />
          <span>Koramangala 4th Block</span>
        </div>
        <div className="ml-1 h-4 w-px bg-white/10" />
        <div className="flex items-center gap-2 text-sm text-white/60">
          <div className="h-2 w-2 rounded-full bg-red-500 shrink-0" />
          <span>Electronic City Phase 1</span>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1 border-red-500/30 text-red-400"
          onClick={() => cancelMutation.mutate("trip-1")}
        >
          Cancel
        </Button>
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
            onClick={() => rateMutation.mutate({ tripId: "trip-1", score: rating, comment })}
            disabled={rating === 0 || rateMutation.isPending}
          >
            Submit Rating
          </Button>
        </div>
      </BottomSheet>
    </div>
  );
}
