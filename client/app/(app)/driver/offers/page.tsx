"use client";

import { Pause, Play, Trash2, Calendar } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { API } from "@/lib/endpoints";
import { cn, formatINR } from "@/lib/utils";
import { EmptyState } from "@/components/ui/empty-state";

interface RawOffer {
  id: string;
  status: string;
  schedule?: {
    pickup?: { address?: string };
    drop?: { address?: string };
    slots?: Array<{ day?: string; departureTime?: string }>;
  };
  pricePerSeat: number | string;
  maxPassengers: number;
  womenOnly?: boolean;
  vehicle?: { make?: string; model?: string; color?: string; licensePlate?: string };
  instances?: Array<{ id: string; date?: string; status?: string }>;
}

interface Offer {
  id: string;
  route: string;
  scheduleLine: string;
  days: string[];
  seats: number;
  price: number;
  active: boolean;
  upcoming: number;
}

function formatTime(value?: string): string {
  if (!value) return "";
  return value.includes("T") ? value.slice(11, 16) : value.slice(0, 5);
}

function mapOffer(raw: RawOffer): Offer {
  const slots = raw.schedule?.slots ?? [];
  const days = slots.map((s) => s.day).filter(Boolean) as string[];
  const time = slots[0]?.departureTime ? formatTime(slots[0].departureTime) : "";
  return {
    id: raw.id,
    route: `${raw.schedule?.pickup?.address || "Pickup"} → ${raw.schedule?.drop?.address || "Drop"}`,
    scheduleLine: [days.join(", "), time].filter(Boolean).join(" · "),
    days,
    seats: raw.maxPassengers,
    price: Number(raw.pricePerSeat),
    active: raw.status === "ACTIVE",
    upcoming: (raw.instances ?? []).length,
  };
}

export default function DriverOffersPage() {
  const queryClient = useQueryClient();

  const { data: offers = [], isLoading } = useQuery({
    queryKey: ["driver-offers"],
    queryFn: async () => {
      try {
        const res = await api.get(API.driver.offers);
        const raw = Array.isArray(res.data) ? (res.data as RawOffer[]) : [];
        return raw.map(mapOffer);
      } catch {
        return [];
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(API.driver.offerById(id)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["driver-offers"] }),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      api.patch(API.driver.offerById(id), { status: active ? "PAUSED" : "ACTIVE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["driver-offers"] }),
  });

  return (
    <div className="animate-fade-in space-y-4 md:space-y-6">
      <h1 className="text-xl font-bold text-white md:text-2xl">My Offers</h1>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-white/5" />
          ))}
        </div>
      ) : offers.length > 0 ? (
        <div className="space-y-2 sm:space-y-3">
          {offers.map((offer) => (
            <div key={offer.id} className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-3 sm:p-4">
              <div className="mb-3 flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white truncate">{offer.route}</p>
                  <p className="text-xs text-white/50">{offer.scheduleLine}</p>
                </div>
                <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold shrink-0 ml-2", offer.active ? "bg-green-500/15 text-green-400" : "bg-white/10 text-white/50")}>
                  {offer.active ? "Active" : "Paused"}
                </span>
              </div>

              <div className="mb-3 flex items-center gap-4 text-xs text-white/50">
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {offer.upcoming} upcoming</span>
                <span>{offer.seats} seats</span>
                <span>{formatINR(offer.price)}/seat</span>
              </div>

              <div className="flex gap-1">
                <button
                  onClick={() => toggleMutation.mutate({ id: offer.id, active: offer.active })}
                  disabled={toggleMutation.isPending}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-colors disabled:opacity-50 touch-target"
                  title={offer.active ? "Pause offer" : "Resume offer"}
                >
                  {offer.active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => {
                    if (confirm("Delete this offer? Future rides will be cancelled.")) deleteMutation.mutate(offer.id);
                  }}
                  disabled={deleteMutation.isPending}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-red-400/50 hover:bg-red-500/10 hover:text-red-400 transition-colors disabled:opacity-50 touch-target"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No offers yet"
          description="Create your first carpool offer to start earning"
        />
      )}
    </div>
  );
}
