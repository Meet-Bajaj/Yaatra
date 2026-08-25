"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Star, Users, Clock, Fuel } from "lucide-react";
import { useRideSearchStore } from "@/stores/rideSearchStore";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Badge } from "@/components/ui/badge";
import { RatingBar } from "@/components/ui/rating-bar";
import { cn } from "@/lib/utils";

const mockRides = [
  {
    id: "1",
    driverName: "Arjun K.",
    driverRating: 4.8,
    vehicle: "Swift Dzire - White",
    type: "carpool",
    pickup: "Koramangala",
    dropoff: "Electronic City",
    eta: 8,
    fare: 120,
    seats: 2,
    departure: "9:00 AM",
  },
  {
    id: "2",
    driverName: "Priya M.",
    driverRating: 4.9,
    vehicle: "Honda City - Silver",
    type: "professional",
    pickup: "Koramangala",
    dropoff: "Electronic City",
    eta: 5,
    fare: 250,
    seats: 4,
    departure: "Now",
  },
  {
    id: "3",
    driverName: "Rahul S.",
    driverRating: 4.6,
    vehicle: "Toyota Innova - Black",
    type: "carpool",
    pickup: "HSR Layout",
    dropoff: "Electronic City",
    eta: 12,
    fare: 100,
    seats: 3,
    departure: "9:30 AM",
  },
];

export default function RideOptionsPage() {
  const router = useRouter();
  const { pickup, dropoff, filters, setFilters } = useRideSearchStore();
  const [selectedRide, setSelectedRide] = useState<string | null>(null);

  const filteredRides = mockRides.filter((ride) => {
    if (filters.type === "carpool" && ride.type !== "carpool") return false;
    if (filters.type === "professional" && ride.type !== "professional") return false;
    if (filters.womenOnly) return false;
    return true;
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

      <div className="space-y-3">
        {filteredRides.map((ride) => (
          <div
            key={ride.id}
            className={cn(
              "rounded-2xl border bg-[#0a0a0a] p-4 transition-all duration-200",
              selectedRide === ride.id
                ? "border-white bg-white/5"
                : "border-white/10 hover:border-white/20"
            )}
          >
            <div className="mb-3 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white">
                  {ride.driverName[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{ride.driverName}</p>
                  <div className="flex items-center gap-1">
                    <RatingBar value={Math.round(ride.driverRating)} size="sm" />
                    <span className="text-xs text-white/50">{ride.driverRating}</span>
                  </div>
                </div>
              </div>
              <Badge variant={ride.type === "carpool" ? "carpool" : "pro"}>
                {ride.type === "carpool" ? "Carpool" : "Pro"}
              </Badge>
            </div>

            <p className="mb-3 text-xs text-white/40">{ride.vehicle}</p>

            <div className="mb-4 flex items-center gap-4 text-xs text-white/50">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> {ride.eta} min
              </span>
              <span>{ride.seats} seats left</span>
              <span>{ride.departure}</span>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-lg font-bold text-white">₹{ride.fare}</p>
              <Button
                size="sm"
                onClick={() => {
                  setSelectedRide(ride.id);
                  router.push("/ride-now/confirm");
                }}
              >
                Book Now
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filteredRides.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-sm text-white/50">No rides found matching your filters</p>
        </div>
      )}
    </div>
  );
}
