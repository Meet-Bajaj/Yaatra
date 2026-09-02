"use client";

import { useState } from "react";
import { Clock, CheckCircle, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { API } from "@/lib/endpoints";
import { cn, formatINR } from "@/lib/utils";
import { EmptyState } from "@/components/ui/empty-state";

interface Ride {
  id: string;
  pickupAddress?: string;
  dropoffAddress?: string;
  status: string;
  scheduledFor?: string;
  fare?: number;
  driver?: { name: string };
  createdAt: string;
}

export default function RidesPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"upcoming" | "history">("upcoming");

  const { data: upcomingRides = [], isLoading: loadingUpcoming } = useQuery({
    queryKey: ["rides-upcoming"],
    queryFn: async () => {
      try {
        const res = await api.get(API.rides.upcoming);
        return (res.data || []) as Ride[];
      } catch {
        return [];
      }
    },
  });

  const { data: historyRides = [], isLoading: loadingHistory } = useQuery({
    queryKey: ["rides-history"],
    queryFn: async () => {
      try {
        const res = await api.get(API.rides.history);
        return (res.data || []) as Ride[];
      } catch {
        return [];
      }
    },
    enabled: tab === "history",
  });

  const rides = tab === "upcoming" ? upcomingRides : historyRides;
  const isLoading = tab === "upcoming" ? loadingUpcoming : loadingHistory;

  return (
    <div className="animate-fade-in space-y-4 md:space-y-6">
      <h1 className="text-xl font-bold text-white md:text-2xl">My Rides</h1>

      <div className="flex gap-1 rounded-xl bg-white/5 p-1">
        <button
          onClick={() => setTab("upcoming")}
          className={cn(
            "flex-1 rounded-lg py-3 text-sm font-medium transition-all touch-target md:py-2.5",
            tab === "upcoming" ? "bg-white text-black" : "text-white/50 hover:text-white"
          )}
        >
          Upcoming
        </button>
        <button
          onClick={() => setTab("history")}
          className={cn(
            "flex-1 rounded-lg py-3 text-sm font-medium transition-all touch-target md:py-2.5",
            tab === "history" ? "bg-white text-black" : "text-white/50 hover:text-white"
          )}
        >
          History
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-white/5" />
          ))}
        </div>
      ) : rides.length > 0 ? (
        <div className="space-y-2 sm:space-y-3">
          {rides.map((ride) => (
            <button
              key={ride.id}
              onClick={() => router.push(`/rides/${ride.id}`)}
              className="w-full text-left rounded-2xl border border-white/10 bg-[#0a0a0a] p-3 transition-colors hover:border-white/20 active:bg-white/5 sm:p-4 touch-target"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs text-white/50">
                  <Clock className="h-3 w-3" /> {ride.scheduledFor ? new Date(ride.scheduledFor).toLocaleDateString() : new Date(ride.createdAt).toLocaleDateString()}
                </span>
                <span className={cn(
                  "flex items-center gap-1 text-xs",
                  ride.status === "CONFIRMED" || ride.status === "COMPLETED" ? "text-green-400" : "text-white/50"
                )}>
                  <CheckCircle className="h-3 w-3" /> {ride.status}
                </span>
              </div>
              <p className="mb-1 text-sm font-medium text-white">
                {ride.pickupAddress || "Pickup"} → {ride.dropoffAddress || "Dropoff"}
              </p>
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/50">
                  {ride.driver?.name ? `Driver: ${ride.driver.name}` : ""}
                </p>
                {ride.fare != null && (
                  <p className="text-sm font-semibold text-white">{formatINR(ride.fare)}</p>
                )}
              </div>
            </button>
          ))}
        </div>
      ) : (
        <EmptyState icon={<Calendar className="h-12 w-12" />} title={tab === "upcoming" ? "No upcoming rides" : "No ride history"} />
      )}
    </div>
  );
}
