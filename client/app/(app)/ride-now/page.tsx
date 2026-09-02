"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Navigation, Clock, Search, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useRideSearchStore } from "@/stores/rideSearchStore";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { AddressAutocomplete } from "@/components/maps/address-autocomplete";
import api from "@/lib/api";
import { API } from "@/lib/endpoints";

export default function RideNowPage() {
  const router = useRouter();
  const { pickup, dropoff, setPickup, setDropoff } = useRideSearchStore();
  const [pickupInput, setPickupInput] = useState(pickup?.address || "");
  const [dropoffInput, setDropoffInput] = useState(dropoff?.address || "");
  const [geoLoading, setGeoLoading] = useState(false);

  const { data: savedPlaces = [] } = useQuery({
    queryKey: ["places"],
    queryFn: async () => {
      try {
        const res = await api.get(API.users.places);
        const data = res.data;
        return (Array.isArray(data) ? data : []) as Array<{
          id: string;
          label: string;
          name: string;
          address: string;
          lat: number;
          lng: number;
        }>;
      } catch {
        return [];
      }
    },
  });

  const handleSearch = () => {
    if (!pickupInput || !dropoffInput || !pickup || !dropoff) return;
    router.push("/ride-now/options");
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) return;
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setPickupInput("Current Location");
        setPickup({ address: "Current Location", lat: latitude, lng: longitude });
        setGeoLoading(false);
      },
      () => {
        setPickupInput("Current Location");
        setPickup({ address: "Current Location", lat: 12.9716, lng: 77.5946 });
        setGeoLoading(false);
      }
    );
  };

  const canSearch = pickupInput && dropoffInput && pickup?.lat && dropoff?.lat;

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
          <div className="pl-6">
            <AddressAutocomplete
              value={pickupInput}
              onChange={setPickupInput}
              onPlaceSelect={(place) => setPickup(place)}
              placeholder="Pickup location"
            />
          </div>
        </div>

        <div className="relative">
          <div className="absolute left-[-8px] top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-white bg-white" />
          <div className="pl-6">
            <AddressAutocomplete
              value={dropoffInput}
              onChange={setDropoffInput}
              onPlaceSelect={(place) => setDropoff(place)}
              placeholder="Where to?"
            />
          </div>
        </div>
      </div>

      <button
        onClick={handleUseCurrentLocation}
        disabled={geoLoading}
        className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-[#0a0a0a] p-3 text-left transition-colors hover:bg-white/5"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
          {geoLoading ? (
            <Loader2 className="h-5 w-5 text-white animate-spin" />
          ) : (
            <Navigation className="h-5 w-5 text-white" />
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-white">Use current location</p>
          <p className="text-xs text-white/40">Detect your location automatically</p>
        </div>
      </button>

      {savedPlaces.length > 0 && (
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
                  setDropoff({ address: place.address, lat: place.lat, lng: place.lng });
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
      )}

      <Button
        onClick={handleSearch}
        className="w-full"
        size="lg"
        disabled={!canSearch}
      >
        <Search className="h-4 w-4" />
        Find Rides
      </Button>
    </div>
  );
}
