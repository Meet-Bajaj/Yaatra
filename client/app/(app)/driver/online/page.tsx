"use client";

import { useState } from "react";
import { Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function DriverOnlinePage() {
  const [isOnline, setIsOnline] = useState(false);

  return (
    <div className="animate-fade-in space-y-6">
      <h1 className="text-2xl font-bold text-white">Go Online</h1>

      <div className="flex flex-col items-center rounded-2xl border border-white/10 bg-[#0a0a0a] p-8">
        <div className={cn("mb-6 flex h-24 w-24 items-center justify-center rounded-full transition-all", isOnline ? "bg-white" : "bg-white/5")}>
          {isOnline ? <Wifi className="h-10 w-10 text-black" /> : <WifiOff className="h-10 w-10 text-white/30" />}
        </div>
        <p className="mb-1 text-lg font-semibold text-white">{isOnline ? "You're Online" : "You're Offline"}</p>
        <p className="mb-6 text-sm text-white/50">{isOnline ? "Receiving ride requests" : "Go online to start receiving rides"}</p>
        <Button onClick={() => setIsOnline(!isOnline)} variant={isOnline ? "destructive" : "default"} size="lg" className="w-full max-w-xs">
          {isOnline ? "Go Offline" : "Go Online"}
        </Button>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-4 space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40">Today&apos;s Summary</h3>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-lg font-bold text-white">0</p>
            <p className="text-[10px] text-white/40">Rides</p>
          </div>
          <div>
            <p className="text-lg font-bold text-white">₹0</p>
            <p className="text-[10px] text-white/40">Earned</p>
          </div>
          <div>
            <p className="text-lg font-bold text-white">0h</p>
            <p className="text-[10px] text-white/40">Online</p>
          </div>
        </div>
      </div>
    </div>
  );
}
