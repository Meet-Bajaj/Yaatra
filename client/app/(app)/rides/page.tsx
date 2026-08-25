"use client";

import { useState } from "react";
import { Clock, CheckCircle, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

const upcomingRides = [
  {
    id: "1",
    route: "Koramangala to Electronic City",
    date: "Tomorrow, 9:00 AM",
    driver: "Arjun K.",
    status: "confirmed",
  },
];

const completedRides = [
  {
    id: "2",
    route: "HSR Layout to Whitefield",
    date: "22 Aug 2026, 8:30 AM",
    driver: "Priya M.",
    fare: 180,
  },
  {
    id: "3",
    route: "Koramangala to Electronic City",
    date: "21 Aug 2026, 9:00 AM",
    driver: "Rahul S.",
    fare: 120,
  },
];

export default function RidesPage() {
  const [tab, setTab] = useState<"upcoming" | "history">("upcoming");

  return (
    <div className="animate-fade-in space-y-6">
      <h1 className="text-2xl font-bold text-white">My Rides</h1>

      <div className="flex gap-1 rounded-xl bg-white/5 p-1">
        <button
          onClick={() => setTab("upcoming")}
          className={cn(
            "flex-1 rounded-lg py-2.5 text-sm font-medium transition-all",
            tab === "upcoming" ? "bg-white text-black" : "text-white/50 hover:text-white"
          )}
        >
          Upcoming
        </button>
        <button
          onClick={() => setTab("history")}
          className={cn(
            "flex-1 rounded-lg py-2.5 text-sm font-medium transition-all",
            tab === "history" ? "bg-white text-black" : "text-white/50 hover:text-white"
          )}
        >
          History
        </button>
      </div>

      {tab === "upcoming" && (
        <div className="space-y-3">
          {upcomingRides.length === 0 ? (
            <div className="py-12 text-center">
              <Calendar className="mx-auto mb-3 h-10 w-10 text-white/20" />
              <p className="text-sm text-white/50">No upcoming rides</p>
            </div>
          ) : (
            upcomingRides.map((ride) => (
              <div key={ride.id} className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs text-white/50">
                    <Clock className="h-3 w-3" /> {ride.date}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-green-400">
                    <CheckCircle className="h-3 w-3" /> {ride.status}
                  </span>
                </div>
                <p className="mb-1 text-sm font-medium text-white">{ride.route}</p>
                <p className="text-xs text-white/40">Driver: {ride.driver}</p>
              </div>
            ))
          )}
        </div>
      )}

      {tab === "history" && (
        <div className="space-y-3">
          {completedRides.map((ride) => (
            <div key={ride.id} className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs text-white/50">{ride.date}</span>
                <span className="text-sm font-semibold text-white">₹{ride.fare}</span>
              </div>
              <p className="mb-1 text-sm font-medium text-white">{ride.route}</p>
              <p className="text-xs text-white/40">Driver: {ride.driver}</p>
              <div className="mt-3 flex gap-2">
                <button className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/60 hover:bg-white/5 transition-colors">
                  Rebook
                </button>
                <button className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/60 hover:bg-white/5 transition-colors">
                  Receipt
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
