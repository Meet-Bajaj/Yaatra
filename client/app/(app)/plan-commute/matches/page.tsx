"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Users, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const mockMatches = [
  {
    id: "1",
    driverName: "Vikram P.",
    rating: 4.7,
    route: "HSR Layout to Electronic City",
    time: "9:00 AM - 6:00 PM",
    pricePerSeat: 80,
    seatsLeft: 1,
    womenOnly: false,
  },
  {
    id: "2",
    driverName: "Anita R.",
    rating: 4.9,
    route: "Koramangala to Electronic City",
    time: "8:30 AM - 5:30 PM",
    pricePerSeat: 90,
    seatsLeft: 2,
    womenOnly: true,
  },
];

export default function PlanCommuteMatchesPage() {
  const router = useRouter();

  return (
    <div className="animate-fade-in space-y-4">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white/60 hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-bold text-white">Matched Carpools</h1>
      </div>

      <div className="space-y-3">
        {mockMatches.map((match) => (
          <div key={match.id} className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-4">
            <div className="mb-3 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white">
                  {match.driverName[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{match.driverName}</p>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-white text-white" />
                    <span className="text-xs text-white/50">{match.rating}</span>
                  </div>
                </div>
              </div>
              {match.womenOnly && <Badge variant="women">Women Only</Badge>}
            </div>

            <p className="mb-2 text-xs text-white/50">{match.route}</p>

            <div className="mb-4 flex items-center gap-4 text-xs text-white/50">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> {match.time}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" /> {match.seatsLeft} seats
              </span>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-lg font-bold text-white">₹{match.pricePerSeat}<span className="text-xs font-normal text-white/40">/seat</span></p>
              <Button size="sm" onClick={() => router.push("/plan-commute/confirm")}>
                Select
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
