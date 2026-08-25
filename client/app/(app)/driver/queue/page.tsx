"use client";

import { Check, X, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const queue = [
  { id: "1", riderName: "Neha S.", pickup: "Koramangala", dropoff: "Electronic City", time: "Now", seats: 1 },
  { id: "2", riderName: "Amit P.", pickup: "HSR Layout", dropoff: "Electronic City", time: "Now", seats: 2 },
];

export default function DriverQueuePage() {
  return (
    <div className="animate-fade-in space-y-6">
      <h1 className="text-2xl font-bold text-white">Ride Queue</h1>

      <div className="space-y-3">
        {queue.map((item) => (
          <div key={item.id} className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-4">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white">
                {item.riderName[0]}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{item.riderName}</p>
                <p className="text-xs text-white/40">{item.pickup} to {item.dropoff}</p>
              </div>
              <span className="flex items-center gap-1 text-xs text-white/50">
                <Users className="h-3 w-3" /> {item.seats}
              </span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <X className="h-4 w-4" /> Reject
              </Button>
              <Button size="sm" className="flex-1">
                <Check className="h-4 w-4" /> Accept
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
