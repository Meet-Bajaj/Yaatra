"use client";

import { MapPin, Phone, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DriverActivePage() {
  return (
    <div className="animate-fade-in space-y-4">
      <h1 className="text-2xl font-bold text-white">Active Trip</h1>

      <div className="relative h-48 rounded-2xl border border-white/10 bg-[#0a0a0a] overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="mx-auto mb-2 h-8 w-8 text-white/30" />
            <p className="text-xs text-white/40">Navigation view</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-4 space-y-3">
        <div className="flex items-center gap-2 text-sm text-white/60">
          <MapPin className="h-4 w-4 text-white/30" />
          <span>Pickup: Koramangala 4th Block</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-white/60">
          <MapPin className="h-4 w-4 text-white/30" />
          <span>Drop: Electronic City Phase 1</span>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white">S</div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Sneha G.</p>
            <p className="text-xs text-white/40">1 rider</p>
          </div>
          <div className="flex gap-1">
            <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-colors">
              <Phone className="h-4 w-4" />
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-colors">
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" className="flex-1">Arrived at Pickup</Button>
        <Button className="flex-1">Complete Trip</Button>
      </div>
    </div>
  );
}
