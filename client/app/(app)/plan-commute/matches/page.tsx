"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Users, Clock, Star, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { formatINR } from "@/lib/utils";

interface RawMatch {
  offerId: string;
  instanceId: string;
  driver: { id?: string; name?: string; rating?: number };
  vehicle?: { make?: string; model?: string; color?: string } | null;
  schedule: { date?: string; departureTime?: string };
  pricePerSeat: number;
  availableSeats: number;
  pickupDistance?: number;
  dropDistance?: number;
  womenOnly?: boolean;
}

interface Match {
  instanceId: string;
  driverName: string;
  rating: number;
  route: string;
  time: string;
  pricePerSeat: number;
  seatsLeft: number;
  womenOnly: boolean;
}

function formatTime(value?: string): string {
  if (!value) return "";
  return value.includes("T") ? value.slice(11, 16) : value.slice(0, 5);
}

function MatchesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pickupLat = searchParams.get("pickupLat");
  const dropLat = searchParams.get("dropLat");
  const hasRoute = !!pickupLat && !!dropLat;
  const routeLine =
    hasRoute && searchParams.get("pickupAddress") && searchParams.get("dropAddress")
      ? `${searchParams.get("pickupAddress")} → ${searchParams.get("dropAddress")}`
      : null;

  const { data: matches = [], isLoading } = useQuery({
    queryKey: ["plan-commute-matches", searchParams.toString()],
    queryFn: async () => {
      try {
        const res = await api.get(`/rides/schedules/matches?${searchParams.toString()}`);
        const raw = Array.isArray(res.data?.matches) ? (res.data.matches as RawMatch[]) : [];
        return raw.map(
          (m): Match => ({
            instanceId: m.instanceId,
            driverName: m.driver?.name || "Driver",
            rating: m.driver?.rating ?? 0,
            route: routeLine || "Your route",
            time: `${m.schedule?.date ? new Date(m.schedule.date).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : ""} ${formatTime(m.schedule?.departureTime)}`.trim(),
            pricePerSeat: m.pricePerSeat,
            seatsLeft: m.availableSeats,
            womenOnly: !!m.womenOnly,
          })
        );
      } catch {
        return [];
      }
    },
    enabled: hasRoute,
  });

  const handleSelect = (match: Match) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("instanceId", match.instanceId);
    params.set("driverName", match.driverName);
    params.set("price", String(match.pricePerSeat));
    params.set("when", match.time);
    router.push(`/plan-commute/confirm?${params.toString()}`);
  };

  return (
    <div className="animate-fade-in space-y-4">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white/60 hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-white">Matched Carpools</h1>
          {routeLine && <p className="text-xs text-white/40">{routeLine}</p>}
        </div>
      </div>

      {!hasRoute ? (
        <EmptyState
          title="No search route"
          description="Set your home and work addresses to find matching carpools."
          action={
            <Button size="sm" onClick={() => router.push("/plan-commute")}>
              Plan Commute
            </Button>
          }
        />
      ) : isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-36 animate-pulse rounded-2xl bg-white/5" />
          ))}
        </div>
      ) : matches.length > 0 ? (
        <div className="space-y-3">
          {matches.map((match) => (
            <div key={match.instanceId} className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-4">
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white">
                    {match.driverName?.[0] || "?"}
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
                <p className="text-lg font-bold text-white">
                  {formatINR(match.pricePerSeat)}
                  <span className="text-xs font-normal text-white/40">/seat</span>
                </p>
                <Button size="sm" onClick={() => handleSelect(match)}>
                  Select
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No matches found"
          description="No carpools match your route and schedule yet. Try a different day or time."
        />
      )}
    </div>
  );
}

export default function PlanCommuteMatchesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-white/50" />
        </div>
      }
    >
      <MatchesContent />
    </Suspense>
  );
}
