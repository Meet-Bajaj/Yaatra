"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, X, Loader2 } from "lucide-react";
import { useRideSearchStore } from "@/stores/rideSearchStore";
import { LiveTrackingMap } from "@/components/maps/live-tracking-map";

export default function RideSearchingPage() {
  const router = useRouter();
  const { pickup, dropoff } = useRideSearchStore();

  const pickupCoords = pickup ? { lat: pickup.lat, lng: pickup.lng } : undefined;
  const dropoffCoords = dropoff ? { lat: dropoff.lat, lng: dropoff.lng } : undefined;

  return (
    <div className="animate-fade-in flex flex-col">
      <div className="relative flex-1">
        <button
          onClick={() => router.back()}
          className="absolute left-6 top-20 z-10 flex h-10 w-10 items-center justify-center rounded-xl bg-black/60 text-white/60 backdrop-blur-sm hover:bg-black/80 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <LiveTrackingMap
          pickup={pickupCoords}
          dropoff={dropoffCoords}
          height="100vh"
          className="rounded-none border-0"
        />

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                <Loader2 className="h-10 w-10 text-white animate-spin" />
              </div>
              <div className="absolute inset-0 rounded-full border-2 border-white/10 animate-pulse-ring" />
              <div className="absolute inset-0 rounded-full border border-white/5 animate-pulse-ring" style={{ animationDelay: "0.5s" }} />
            </div>

            <div className="text-center">
              <h2 className="mb-2 text-xl font-bold text-white">Finding your ride</h2>
              <p className="mb-6 text-sm text-white/50">Searching for the best match nearby...</p>
            </div>

            <button
              onClick={() => router.push("/dashboard")}
              className="pointer-events-auto flex items-center gap-2 rounded-xl border border-white/10 bg-black/60 px-6 py-3 text-sm font-medium text-white backdrop-blur-sm hover:bg-black/80 transition-colors"
            >
              <X className="h-4 w-4" />
              Cancel Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
