"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, X, Loader2, Search } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRideSearchStore } from "@/stores/rideSearchStore";
import { LiveTrackingMap } from "@/components/maps/live-tracking-map";
import { fetchAvailableRides } from "@/lib/ride-search";

export default function RideSearchingPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { pickup, dropoff, filters } = useRideSearchStore();
  const hasRedirected = useRef(false);
  const [elapsed, setElapsed] = useState(0);

  const pickupCoords = pickup ? { lat: pickup.lat, lng: pickup.lng } : undefined;
  const dropoffCoords = dropoff ? { lat: dropoff.lat, lng: dropoff.lng } : undefined;

  useEffect(() => {
    const timer = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const { data: rides = [], isLoading } = useQuery({
    queryKey: ["rides-available-searching", pickup?.address, dropoff?.address, filters],
    queryFn: () => fetchAvailableRides({ pickup, dropoff, filters }),
    refetchInterval: 3000,
    enabled: !!pickup && !!dropoff,
  });

  useEffect(() => {
    if (rides.length > 0 && !hasRedirected.current) {
      hasRedirected.current = true;
      queryClient.invalidateQueries({ queryKey: ["rides-available"] });
      router.push("/ride-now/options");
    }
  }, [rides, router, queryClient]);

  const goToOptions = () => {
    queryClient.invalidateQueries({ queryKey: ["rides-available"] });
    router.push("/ride-now/options");
  };

  if (!pickup || !dropoff) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center gap-4 py-20">
        <p className="text-sm text-white/50">No search criteria found</p>
        <button
          onClick={() => router.push("/ride-now")}
          className="text-sm text-white underline"
        >
          Go back
        </button>
      </div>
    );
  }

  const showViewOptions = elapsed >= 10 && rides.length === 0;

  return (
    <div className="animate-fade-in flex flex-col">
      <div className="relative flex-1">
        <button
          onClick={() => router.back()}
          className="absolute left-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-xl bg-black/60 text-white/60 backdrop-blur-sm hover:bg-black/80 hover:text-white transition-colors"
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
                {isLoading ? (
                  <Loader2 className="h-10 w-10 text-white animate-spin" />
                ) : (
                  <span className="text-3xl font-bold text-white">{rides.length}</span>
                )}
              </div>
              <div className="absolute inset-0 rounded-full border-2 border-white/10 animate-pulse-ring" />
              <div className="absolute inset-0 rounded-full border border-white/5 animate-pulse-ring" style={{ animationDelay: "0.5s" }} />
            </div>

            <div className="text-center">
              <h2 className="mb-2 text-xl font-bold text-white">
                {rides.length > 0 ? "Rides found!" : "Finding your ride"}
              </h2>
              <p className="mb-2 text-sm text-white/50">
                {rides.length > 0
                  ? `${rides.length} ride${rides.length > 1 ? "s" : ""} available nearby`
                  : `Searching... ${elapsed}s`}
              </p>
              <p className="text-xs text-white/30">
                {pickup.address} → {dropoff.address}
              </p>
            </div>

            <div className="pointer-events-auto flex flex-col gap-2">
              {showViewOptions && (
                <button
                  onClick={goToOptions}
                  className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-white/90 transition-colors"
                >
                  <Search className="h-4 w-4" />
                  View Available Options
                </button>
              )}

              <button
                onClick={() => router.push("/dashboard")}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/60 px-6 py-3 text-sm font-medium text-white backdrop-blur-sm hover:bg-black/80 transition-colors"
              >
                <X className="h-4 w-4" />
                Cancel Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
