"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Clock, RotateCcw, Flag, XCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { API } from "@/lib/endpoints";
import { formatINR } from "@/lib/utils";

interface RideDetail {
  id: string;
  pickupAddress?: string;
  dropoffAddress?: string;
  status: string;
  scheduledFor?: string;
  fare?: number;
  baseFare?: number;
  distanceFare?: number;
  platformFee?: number;
  driver?: { name: string; phone?: string; vehicle?: string };
  createdAt: string;
}

export default function RideDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const rideId = resolvedParams.id;
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: ride, isLoading } = useQuery({
    queryKey: ["ride", rideId],
    queryFn: async () => {
      try {
        const res = await api.get(API.rides.byId(rideId));
        return res.data as RideDetail;
      } catch {
        return null;
      }
    },
  });

  const cancelMutation = useMutation({
    mutationFn: () => api.post(API.rides.cancel(rideId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ride", rideId] });
      queryClient.invalidateQueries({ queryKey: ["rides-upcoming"] });
    },
  });

  const rebookMutation = useMutation({
    mutationFn: () => api.post(API.rides.rebook(rideId)),
    onSuccess: () => {
      router.push("/ride-now");
    },
  });

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white/60 hover:bg-white/10 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-bold text-white">Ride Details</h1>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="h-32 animate-pulse rounded-2xl bg-white/5" />
          <div className="h-24 animate-pulse rounded-2xl bg-white/5" />
        </div>
      ) : ride ? (
        <>
          <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-5 space-y-4">
            <div className="flex items-center gap-2 text-sm text-white/60">
              <MapPin className="h-4 w-4 text-white/30" />
              <span>{ride.pickupAddress || "Pickup"} → {ride.dropoffAddress || "Dropoff"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/60">
              <Clock className="h-4 w-4 text-white/30" />
              <span>
                {ride.scheduledFor
                  ? new Date(ride.scheduledFor).toLocaleString()
                  : new Date(ride.createdAt).toLocaleString()}
              </span>
            </div>
            {ride.driver && (
              <div className="border-t border-white/10 pt-3">
                <p className="text-xs text-white/40 mb-1">Driver</p>
                <p className="text-sm font-medium text-white">
                  {ride.driver.name}{ride.driver.vehicle ? ` - ${ride.driver.vehicle}` : ""}
                </p>
              </div>
            )}
            <div className="border-t border-white/10 pt-3">
              <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold bg-white/10 text-white/60">
                {ride.status}
              </span>
            </div>
          </div>

          {(ride.fare != null || ride.baseFare != null) && (
            <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-5 space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40">Fare Breakdown</h3>
              {ride.baseFare != null && (
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Base fare</span>
                  <span className="text-white">{formatINR(ride.baseFare)}</span>
                </div>
              )}
              {ride.distanceFare != null && (
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Distance</span>
                  <span className="text-white">{formatINR(ride.distanceFare)}</span>
                </div>
              )}
              {ride.platformFee != null && (
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Platform fee</span>
                  <span className="text-white">{formatINR(ride.platformFee)}</span>
                </div>
              )}
              <div className="border-t border-white/10 pt-3">
                <div className="flex justify-between">
                  <span className="font-semibold text-white">Total</span>
                  <span className="text-lg font-bold text-white">{formatINR(ride.fare || 0)}</span>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {ride.status !== "COMPLETED" && ride.status !== "CANCELLED" && (
              <button
                onClick={() => cancelMutation.mutate()}
                disabled={cancelMutation.isPending}
                className="flex w-full items-center gap-3 rounded-xl border border-red-500/30 bg-[#0a0a0a] p-3 text-left text-sm text-red-400 hover:bg-red-500/5 transition-colors disabled:opacity-50"
              >
                <XCircle className="h-4 w-4" /> {cancelMutation.isPending ? "Cancelling..." : "Cancel Ride"}
              </button>
            )}
            <button
              onClick={() => rebookMutation.mutate()}
              disabled={rebookMutation.isPending}
              className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-[#0a0a0a] p-3 text-left text-sm text-white/60 hover:bg-white/5 transition-colors disabled:opacity-50"
            >
              <RotateCcw className="h-4 w-4" /> {rebookMutation.isPending ? "Rebooking..." : "Rebook"}
            </button>
            <button
              onClick={() => router.push(`/safety/report?tripId=${encodeURIComponent(ride.id)}`)}
              className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-[#0a0a0a] p-3 text-left text-sm text-white/60 hover:bg-white/5 transition-colors"
            >
              <Flag className="h-4 w-4" /> Report Issue
            </button>
          </div>
        </>
      ) : (
        <p className="text-center text-sm text-white/40 py-12">Ride not found</p>
      )}
    </div>
  );
}
