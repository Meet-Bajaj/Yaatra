import api from "@/lib/api";
import { API } from "@/lib/endpoints";

export interface RideOption {
  id: string;
  kind: "ON_DEMAND" | "SCHEDULED";
  driverName: string;
  driverRating: number;
  vehicle: string;
  type: "carpool" | "professional";
  fare: number;
  seats?: number;
  eta?: number;
  distanceKm?: number;
  departure?: string;
  womenOnly?: boolean;
  instanceId?: string;
  offerId?: string;
}

export interface SearchPoint {
  address: string;
  lat: number;
  lng: number;
}

export interface SearchFilters {
  type: "all" | "carpool" | "professional";
  womenOnly: boolean;
  sortBy: "price" | "time" | "rating";
}

interface RawVehicle {
  make?: string;
  model?: string;
  color?: string;
}

interface RawResult {
  type?: string;
  offerId?: string;
  instanceId?: string;
  driver?: { id?: string; name?: string; rating?: number };
  vehicle?: RawVehicle | null;
  estimatedFare?: number;
  distanceKm?: number;
  schedule?: { date?: string; departureTime?: string };
  pricePerSeat?: number;
  availableSeats?: number;
  womenOnly?: boolean;
}

export function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatVehicle(v: RawVehicle | null | undefined): string {
  if (!v) return "";
  const name = [v.make, v.model].filter(Boolean).join(" ");
  return v.color ? `${name} · ${v.color}` : name;
}

function formatTime(value?: string): string {
  if (!value) return "";
  if (value.includes("T")) return value.slice(11, 16);
  return value.slice(0, 5);
}

function formatDate(value?: string): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value.slice(0, 10);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function mapResult(r: RawResult, index: number): RideOption {
  const scheduled = r.type === "SCHEDULED";
  return {
    id: r.instanceId || `ondemand-${r.driver?.id || index}`,
    kind: scheduled ? "SCHEDULED" : "ON_DEMAND",
    driverName: r.driver?.name || "Driver",
    driverRating: r.driver?.rating ?? 0,
    vehicle: formatVehicle(r.vehicle),
    type: scheduled ? "carpool" : "professional",
    fare: scheduled ? (r.pricePerSeat ?? 0) : (r.estimatedFare ?? 0),
    seats: r.availableSeats,
    distanceKm: r.distanceKm,
    eta:
      !scheduled && r.distanceKm != null
        ? Math.max(3, Math.round(r.distanceKm * 3))
        : undefined,
    departure: r.schedule
      ? `${formatDate(r.schedule.date)}, ${formatTime(r.schedule.departureTime)}`
      : undefined,
    womenOnly: r.womenOnly,
    instanceId: r.instanceId,
    offerId: r.offerId,
  };
}

function sortRides(rides: RideOption[], sortBy: SearchFilters["sortBy"]): RideOption[] {
  const sorted = [...rides];
  if (sortBy === "price") sorted.sort((a, b) => a.fare - b.fare);
  else if (sortBy === "rating") sorted.sort((a, b) => b.driverRating - a.driverRating);
  else
    sorted.sort((a, b) => {
      const at = a.eta ?? a.distanceKm ?? Number.MAX_SAFE_INTEGER;
      const bt = b.eta ?? b.distanceKm ?? Number.MAX_SAFE_INTEGER;
      return at - bt;
    });
  return sorted;
}

export async function fetchAvailableRides(opts: {
  pickup: SearchPoint | null;
  dropoff: SearchPoint | null;
  filters: SearchFilters;
}): Promise<RideOption[]> {
  const { pickup, dropoff, filters } = opts;
  if (!pickup || !dropoff) return [];

  const params = new URLSearchParams();
  params.set("pickupLat", String(pickup.lat));
  params.set("pickupLng", String(pickup.lng));
  params.set("pickupAddress", pickup.address);
  params.set("dropoffLat", String(dropoff.lat));
  params.set("dropoffLng", String(dropoff.lng));
  params.set("dropoffAddress", dropoff.address);
  if (filters.type !== "all") params.set("type", filters.type);
  if (filters.womenOnly) params.set("womenOnly", "true");
  params.set("sortBy", filters.sortBy);

  const res = await api.get(`${API.rides.available}?${params.toString()}`);
  const data = res.data as { results?: RawResult[] } | RawResult[];
  const raw: RawResult[] = Array.isArray(data) ? data : (data?.results ?? []);
  return sortRides(raw.map(mapResult), filters.sortBy);
}
