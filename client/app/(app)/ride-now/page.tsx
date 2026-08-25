"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Navigation, Clock, Search } from "lucide-react";
import { useRideSearchStore } from "@/stores/rideSearchStore";
import { Button } from "@/components/ui/button";


const savedPlaces = [
  { id: "1", label: "Home", name: "Home", address: "123 MG Road, Bangalore" },
  { id: "2", label: "Work", name: "Office", address: "456 Tech Park, Bangalore" },
];

export default function RideNowPage() {
  const router = useRouter();
  const { pickup, dropoff, setPickup, setDropoff } = useRideSearchStore();
  const [pickupInput, setPickupInput] = useState(pickup?.address || "");
  const [dropoffInput, setDropoffInput] = useState(dropoff?.address || "");

  const handleSearch = () => {
    if (!pickupInput || !dropoffInput) return;
    setPickup({ address: pickupInput, lat: 12.9716, lng: 77.5946 });
    setDropoff({ address: dropoffInput, lat: 12.9352, lng: 77.6245 });
    router.push("/ride-now/options");
  };

  const handleUseCurrentLocation = () => {
    setPickupInput("Current Location");
    setPickup({ address: "Current Location", lat: 12.9716, lng: 77.5946 });
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Ride Now</h1>
        <p className="text-sm text-white/50">Find a ride near you</p>
      </div>

      <div className="relative rounded-2xl border border-white/10 bg-[#0a0a0a] p-4">
        <div className="absolute left-8 top-0 bottom-0 w-px bg-white/10" />

        <div className="relative mb-4">
          <div className="absolute left-[-8px] top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-white bg-black" />
          <input
            type="text"
            placeholder="Pickup location"
            value={pickupInput}
            onChange={(e) => setPickupInput(e.target.value)}
            className="w-full bg-transparent py-3 pl-6 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none"
          />
        </div>

        <div className="relative">
          <div className="absolute left-[-8px] top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-white bg-white" />
          <input
            type="text"
            placeholder="Where to?"
            value={dropoffInput}
            onChange={(e) => setDropoffInput(e.target.value)}
            className="w-full bg-transparent py-3 pl-6 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none"
          />
        </div>
      </div>

      <button
        onClick={handleUseCurrentLocation}
        className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-[#0a0a0a] p-3 text-left transition-colors hover:bg-white/5"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
          <Navigation className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-medium text-white">Use current location</p>
          <p className="text-xs text-white/40">Detect your location automatically</p>
        </div>
      </button>

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/30">
          Saved Places
        </p>
        <div className="space-y-2">
          {savedPlaces.map((place) => (
            <button
              key={place.id}
              onClick={() => {
                setDropoffInput(place.address);
                setDropoff({ address: place.address, lat: 12.9352, lng: 77.6245 });
              }}
              className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-[#0a0a0a] p-3 text-left transition-colors hover:bg-white/5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                {place.label === "Home" ? (
                  <MapPin className="h-5 w-5 text-white/50" />
                ) : (
                  <Clock className="h-5 w-5 text-white/50" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{place.name}</p>
                <p className="text-xs text-white/40">{place.address}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <Button
        onClick={handleSearch}
        className="w-full"
        size="lg"
        disabled={!pickupInput || !dropoffInput}
      >
        <Search className="h-4 w-4" />
        Find Rides
      </Button>
    </div>
  );
}
