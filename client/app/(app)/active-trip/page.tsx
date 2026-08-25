"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Phone, Share2, AlertTriangle, MapPin, Navigation, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RatingBar } from "@/components/ui/rating-bar";
import { BottomSheet } from "@/components/ui/bottom-sheet";

export default function ActiveTripPage() {
  const router = useRouter();
  const [tripStatus, setTripStatus] = useState("arriving");
  const [showCancel, setShowCancel] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setTripStatus("in_progress"), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleComplete = () => {
    setShowRating(true);
  };

  const handleRate = () => {
    setShowRating(false);
    router.push("/dashboard");
  };

  return (
    <div className="animate-fade-in space-y-4">
      <div className="relative h-64 rounded-2xl border border-white/10 bg-[#0a0a0a] overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="mx-auto mb-2 h-8 w-8 text-white/30" />
            <p className="text-xs text-white/40">Live map view</p>
            <p className="text-[10px] text-white/20">Google Maps integration</p>
          </div>
        </div>
        <div className="absolute bottom-3 left-3 rounded-lg bg-black/80 px-3 py-1.5 backdrop-blur-sm">
          <p className="text-xs font-medium text-white">{tripStatus === "arriving" ? "Driver is arriving" : "Trip in progress"}</p>
          <p className="text-[10px] text-white/50">ETA: {tripStatus === "arriving" ? "3 min" : "18 min"}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white">
            A
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">Arjun K.</p>
            <p className="text-xs text-white/40">Swift Dzire - White - KA 01 AB 1234</p>
          </div>
          <div className="flex items-center gap-1 text-xs text-white/50">
            <Navigation className="h-3 w-3" /> 4.8
          </div>
        </div>

        <div className="flex gap-2">
          <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 py-2.5 text-xs font-medium text-white hover:bg-white/5 transition-colors">
            <Phone className="h-4 w-4" /> Call
          </button>
          <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 py-2.5 text-xs font-medium text-white hover:bg-white/5 transition-colors">
            <Share2 className="h-4 w-4" /> Share Trip
          </button>
          <button
            onClick={() => setShowCancel(true)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-500/20 py-2.5 text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <X className="h-4 w-4" /> Cancel
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-4">
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-white/60">
            <MapPin className="h-4 w-4 text-white/30" />
            <span>Koramangala 4th Block</span>
          </div>
          <div className="flex items-center gap-2 text-white/60">
            <MapPin className="h-4 w-4 text-white/30" />
            <span>Electronic City Phase 1</span>
          </div>
        </div>
      </div>

      {tripStatus === "in_progress" && (
        <Button onClick={handleComplete} className="w-full" size="lg">
          Mark as Complete
        </Button>
      )}

      <button
        onClick={() => {
          navigator.vibrate?.(200);
        }}
        className="w-full rounded-2xl border border-red-500/30 bg-red-500/10 py-4 text-center text-sm font-semibold text-red-400 hover:bg-red-500/20 transition-colors"
      >
        <AlertTriangle className="mx-auto mb-1 h-5 w-5" />
        Emergency SOS
      </button>

      <BottomSheet open={showCancel} onClose={() => setShowCancel(false)} title="Cancel Ride?">
        <p className="mb-4 text-sm text-white/50">
          Are you sure you want to cancel? A cancellation fee may apply.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => setShowCancel(false)}>
            Keep Ride
          </Button>
          <Button variant="destructive" className="flex-1" onClick={() => router.push("/dashboard")}>
            Cancel Ride
          </Button>
        </div>
      </BottomSheet>

      <BottomSheet open={showRating} onClose={() => setShowRating(false)} title="Rate Your Ride">
        <div className="flex flex-col items-center py-4">
          <p className="mb-4 text-sm text-white/50">How was your ride with Arjun?</p>
          <RatingBar value={rating} onChange={setRating} size="lg" interactive />
          <Button className="mt-6 w-full" onClick={handleRate} disabled={rating === 0}>
            Submit Rating
          </Button>
        </div>
      </BottomSheet>
    </div>
  );
}
