"use client";

import { useState } from "react";
import { Wifi, WifiOff, MapPin, Loader2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { API } from "@/lib/endpoints";
import { Button } from "@/components/ui/button";
import { cn, formatINR } from "@/lib/utils";

interface EarningsSummary {
  totalEarnings: number;
  todayEarnings: number;
  todayTrips: number;
}

function getZoneFromCoords(lat: number, lng: number): string {
  const grid = Math.floor(lat * 10) + "" + Math.floor(lng * 10);
  return `zone-${grid}`;
}

export default function DriverOnlinePage() {
  const queryClient = useQueryClient();
  const [geoError, setGeoError] = useState<string | null>(null);

  const { data: profile } = useQuery({
    queryKey: ["driver-profile"],
    queryFn: async () => {
      try {
        const res = await api.get(API.driver.profile);
        return res.data as { isOnline?: boolean };
      } catch {
        return { isOnline: false };
      }
    },
  });

  const { data: earnings } = useQuery({
    queryKey: ["driver-earnings"],
    queryFn: async () => {
      try {
        const res = await api.get(API.driver.earnings);
        return res.data as EarningsSummary;
      } catch {
        return null;
      }
    },
  });

  const { data: vehicles = [] } = useQuery({
    queryKey: ["vehicles"],
    queryFn: async () => {
      try {
        const res = await api.get(API.users.vehicles);
        return Array.isArray(res.data) ? res.data : [];
      } catch {
        return [];
      }
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async (goOnline: boolean) => {
      if (!goOnline) {
        return api.post(API.driver.goOffline);
      }

      setGeoError(null);

      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error("Geolocation not supported"));
          return;
        }
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        });
      });

      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      const zone = getZoneFromCoords(lat, lng);
      const vehicleId = vehicles[0]?.id;

      return api.post(API.driver.goOnline, { lat, lng, zone, vehicleId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["driver-profile"] });
      queryClient.invalidateQueries({ queryKey: ["driver-earnings"] });
    },
    onError: (err: Error) => {
      if (err.message.includes("Geolocation")) {
        setGeoError("Location access is required to go online");
      } else {
        setGeoError(err.message || "Failed to go online");
      }
    },
  });

  const isOnline = profile?.isOnline ?? false;

  return (
    <div className="animate-fade-in space-y-4 md:space-y-6">
      <h1 className="text-xl font-bold text-white md:text-2xl">Go Online</h1>

      <div className="flex flex-col items-center rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 md:p-8">
        <div className={cn("mb-6 flex h-20 w-20 items-center justify-center rounded-full transition-all md:h-24 md:w-24", isOnline ? "bg-white" : "bg-white/5")}>
          {isOnline ? <Wifi className="h-8 w-8 text-black md:h-10 md:w-10" /> : <WifiOff className="h-8 w-8 text-white/50 md:h-10 md:w-10" />}
        </div>
        <p className="mb-1 text-lg font-semibold text-white">{isOnline ? "You're Online" : "You're Offline"}</p>
        <p className="mb-2 text-sm text-white/60">{isOnline ? "Receiving ride requests" : "Go online to start receiving rides"}</p>

        {!isOnline && (
          <div className="mb-4 flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5">
            <MapPin className="h-3 w-3 text-white/40" />
            <span className="text-[11px] text-white/40">Location required</span>
          </div>
        )}

        {geoError && (
          <p className="mb-3 text-xs text-red-400">{geoError}</p>
        )}

        <Button
          onClick={() => toggleMutation.mutate(!isOnline)}
          variant={isOnline ? "destructive" : "default"}
          size="lg"
          className="w-full max-w-xs"
          disabled={toggleMutation.isPending}
        >
          {toggleMutation.isPending ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              {isOnline ? "Going offline..." : "Getting location..."}
            </span>
          ) : isOnline ? "Go Offline" : "Go Online"}
        </Button>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-4 space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-white/50">Today&apos;s Summary</h3>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-lg font-bold text-white">{earnings?.todayTrips ?? 0}</p>
            <p className="text-[10px] text-white/50">Rides</p>
          </div>
          <div>
            <p className="text-lg font-bold text-white">{formatINR(earnings?.todayEarnings ?? 0)}</p>
            <p className="text-[10px] text-white/50">Earned</p>
          </div>
          <div>
            <p className="text-lg font-bold text-white">{formatINR(earnings?.totalEarnings ?? 0)}</p>
            <p className="text-[10px] text-white/50">All Time</p>
          </div>
        </div>
      </div>
    </div>
  );
}
