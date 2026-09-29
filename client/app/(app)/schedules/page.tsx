"use client";

import { Calendar, Pause, Play, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { API } from "@/lib/endpoints";
import { cn, formatINR } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

interface RoutePoint {
  lat?: number;
  lng?: number;
  address?: string;
}

interface OfferSchedule {
  pickup?: RoutePoint;
  drop?: RoutePoint;
  slots?: Array<{ day?: string; departureTime?: string }>;
}

interface RiderBooking {
  id: string;
  seatCount: number;
  fareTotal: number | string;
  bookingStatus: string;
  instance?: {
    id: string;
    date?: string;
    departureTime?: string;
    ride?: {
      schedule?: OfferSchedule;
      driver?: { user?: { name?: string } };
      vehicle?: { make?: string; model?: string; color?: string };
    };
  };
}

interface DriverOffer {
  id: string;
  status: string;
  schedule?: OfferSchedule;
  pricePerSeat: number | string;
  maxPassengers: number;
  vehicle?: { make?: string; model?: string; color?: string; licensePlate?: string };
}

interface SchedulesResponse {
  asRider?: RiderBooking[];
  asDriver?: DriverOffer[];
}

function formatTime(value?: string): string {
  if (!value) return "";
  return value.includes("T") ? value.slice(11, 16) : value.slice(0, 5);
}

function formatDate(value?: string): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

function routeOf(s?: OfferSchedule): string {
  const from = s?.pickup?.address || "Pickup";
  const to = s?.drop?.address || "Drop";
  return `${from} → ${to}`;
}

export default function SchedulesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["schedules"],
    queryFn: async () => {
      try {
        const res = await api.get(API.rides.schedules);
        return (res.data || {}) as SchedulesResponse;
      } catch {
        return {} as SchedulesResponse;
      }
    },
  });

  const asRider = data?.asRider ?? [];
  const asDriver = data?.asDriver ?? [];

  const toggleMutation = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      api.patch(API.driver.offerById(id), { status: active ? "PAUSED" : "ACTIVE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["schedules"] }),
  });

  const cancelMutation = useMutation({
    mutationFn: (instanceId: string) => api.post(API.rides.cancelInstance(instanceId)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["schedules"] }),
  });

  if (isLoading) {
    return (
      <div className="animate-fade-in space-y-6">
        <h1 className="text-2xl font-bold text-white">Schedules</h1>
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-white/5" />
          ))}
        </div>
      </div>
    );
  }

  if (asRider.length === 0 && asDriver.length === 0) {
    return (
      <div className="animate-fade-in space-y-6">
        <h1 className="text-2xl font-bold text-white">Schedules</h1>
        <EmptyState
          icon={<Calendar className="h-8 w-8 text-white/20" />}
          title="No recurring schedules"
          description="Plan a commute to book recurring carpools, or offer a seat as a driver."
          action={
            <div className="mt-4 flex gap-2">
              <Button size="sm" onClick={() => router.push("/plan-commute")}>
                Plan Commute
              </Button>
              <Button size="sm" variant="outline" onClick={() => router.push("/driver/offer-seat")}>
                Offer a Seat
              </Button>
            </div>
          }
        />
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <h1 className="text-2xl font-bold text-white">Schedules</h1>

      {asRider.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white/50">Booked Commutes</h2>
          {asRider.map((booking) => {
            const ride = booking.instance?.ride;
            return (
              <div key={booking.id} className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-4">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white">{routeOf(ride?.schedule)}</p>
                    <p className="text-xs text-white/40">
                      {formatDate(booking.instance?.date)} · {formatTime(booking.instance?.departureTime)}
                    </p>
                    <p className="text-xs text-white/40">
                      Driver: {ride?.driver?.user?.name || "Assigned soon"}
                      {ride?.vehicle?.make ? ` · ${ride.vehicle.make} ${ride.vehicle.model || ""}` : ""}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold",
                      booking.bookingStatus === "CONFIRMED"
                        ? "bg-green-500/15 text-green-400"
                        : booking.bookingStatus === "PENDING"
                          ? "bg-yellow-500/15 text-yellow-400"
                          : "bg-white/10 text-white/40"
                    )}
                  >
                    {booking.bookingStatus}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-white">
                    {formatINR(Number(booking.fareTotal))}
                    <span className="text-xs font-normal text-white/40">
                      {" "}· {booking.seatCount} seat{booking.seatCount > 1 ? "s" : ""}
                    </span>
                  </p>
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        if (booking.instance?.id && confirm("Cancel this booked instance?")) {
                          cancelMutation.mutate(booking.instance.id);
                        }
                      }}
                      disabled={cancelMutation.isPending}
                      className="rounded-lg bg-white/5 px-3 py-1.5 text-xs text-red-400/70 hover:bg-red-500/10 hover:text-red-400 transition-colors disabled:opacity-50 touch-target"
                    >
                      {cancelMutation.isPending && cancelMutation.variables === booking.instance?.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        "Cancel"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      )}

      {asDriver.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white/50">My Offers</h2>
          {asDriver.map((offer) => {
            const active = offer.status === "ACTIVE";
            const slots = offer.schedule?.slots ?? [];
            const days = slots.map((s) => s.day).filter(Boolean).join(", ");
            const time = slots[0]?.departureTime ? formatTime(slots[0].departureTime) : "";
            return (
              <div key={offer.id} className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-4">
                <div className="mb-3 flex items-start justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white">{routeOf(offer.schedule)}</p>
                    <p className="text-xs text-white/40">
                      {[days, time].filter(Boolean).join(" · ") || "Schedule"}
                    </p>
                    <p className="text-xs text-white/40">
                      {offer.vehicle
                        ? `${offer.vehicle.make} ${offer.vehicle.model || ""}${offer.vehicle.licensePlate ? ` · ${offer.vehicle.licensePlate}` : ""}`
                        : ""}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold",
                      active ? "bg-green-500/15 text-green-400" : "bg-white/10 text-white/40"
                    )}
                  >
                    {active ? "Active" : "Paused"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-white">
                    {formatINR(Number(offer.pricePerSeat))}
                    <span className="text-xs font-normal text-white/40">/seat · {offer.maxPassengers} seats</span>
                  </p>
                  <div className="flex gap-1">
                    <button
                      onClick={() => toggleMutation.mutate({ id: offer.id, active })}
                      disabled={toggleMutation.isPending}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-colors disabled:opacity-50 touch-target"
                      title={active ? "Pause offer" : "Resume offer"}
                    >
                      {active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      )}
    </div>
  );
}
