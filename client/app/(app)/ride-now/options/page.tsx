"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Star, Users, Clock, Fuel } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useRideSearchStore } from "@/stores/rideSearchStore";
import { fetchAvailableRides } from "@/lib/ride-search";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Badge } from "@/components/ui/badge";
import { RatingBar } from "@/components/ui/rating-bar";
import { EmptyState } from "@/components/ui/empty-state";
import { RouteMap } from "@/components/maps/route-map";
import { cn, formatINR } from "@/lib/utils";

export default function RideOptionsPage() {
  const router = useRouter();
  const { pickup, dropoff, filters, setFilters, setSelectedRide } = useRideSearchStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: rides = [], isLoading } = useQuery({
    queryKey: ["rides-available", pickup?.address, dropoff?.address, filters],
    queryFn: () => fetchAvailableRides({ pickup, dropoff, filters }),
  });

  return (
    <div className="animate-fade-in space-y-4">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-white">Available Rides</h1>
          <p className="text-xs text-white/40">
            {pickup?.address || "Pickup"} to {dropoff?.address || "Dropoff"}
          </p>
        </div>
      </div>

      {pickup && dropoff && (
        <RouteMap pickup={{ lat: pickup.lat, lng: pickup.lng, address: pickup.address }} dropoff={{ lat: dropoff.lat, lng: dropoff.lng, address: dropoff.address }} height="160px" />
      )}

      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <Chip active={filters.type === "all"} onClick={() => setFilters({ type: "all" })}>
          All
        </Chip>
        <Chip active={filters.type === "carpool"} onClick={() => setFilters({ type: "carpool" })}>
          <Users className="h-3 w-3" /> Carpool
        </Chip>
        <Chip active={filters.type === "professional"} onClick={() => setFilters({ type: "professional" })}>
          <Star className="h-3 w-3" /> Pro
        </Chip>
        <Chip active={filters.sortBy === "price"} onClick={() => setFilters({ sortBy: "price" })}>
          <Fuel className="h-3 w-3" /> Price
        </Chip>
        <Chip active={filters.sortBy === "time"} onClick={() => setFilters({ sortBy: "time" })}>
          <Clock className="h-3 w-3" /> Time
        </Chip>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-2xl bg-white/5" />
          ))}
        </div>
      ) : rides.length > 0 ? (
        <div className="space-y-3">
          {rides.map((ride) => (
            <div
              key={ride.id}
              className={cn(
                "rounded-2xl border bg-[#0a0a0a] p-4 transition-all duration-200",
                selectedId === ride.id
                  ? "border-white bg-white/5"
                  : "border-white/10 hover:border-white/20"
              )}
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white">
                    {ride.driverName?.[0] || "?"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{ride.driverName}</p>
                    <div className="flex items-center gap-1">
                      <RatingBar value={Math.round(ride.driverRating || 0)} size="sm" />
                      <span className="text-xs text-white/50">{ride.driverRating}</span>
                    </div>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {ride.womenOnly && <Badge variant="women">Women</Badge>}
                  <Badge variant={ride.type === "carpool" ? "carpool" : "pro"}>
                    {ride.type === "carpool" ? "Carpool" : "Pro"}
                  </Badge>
                </div>
              </div>

              {ride.vehicle && (
                <p className="mb-3 text-xs text-white/40">{ride.vehicle}</p>
              )}

              <div className="mb-4 flex items-center gap-4 text-xs text-white/50">
                {ride.eta != null && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {ride.eta} min
                  </span>
                )}
                {ride.seats != null && <span>{ride.seats} seats left</span>}
                {ride.departure && <span>{ride.departure}</span>}
              </div>

              <div className="flex items-center justify-between">
                <p className="text-lg font-bold text-white">{formatINR(ride.fare)}</p>
                <Button
                  size="sm"
                  onClick={() => {
                    setSelectedId(ride.id);
                    setSelectedRide(ride);
                    router.push("/ride-now/confirm");
                  }}
                >
                  Book Now
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No rides found"
          description="Try adjusting your filters or search a different route"
        />
      )}
    </div>
  );
}
