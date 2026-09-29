"use client";

import { Check, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

interface RawRequest {
  id: string;
  status: string;
  pickupAddress?: string;
  dropAddress?: string;
  pickupTime?: string;
  distanceKm?: number;
  fareEstimate?: number | string;
  rider?: { id: string; name: string };
}

interface Request {
  id: string;
  status: string;
  riderName: string;
  route: string;
  time: string;
  meta: string;
}

function mapRequest(r: RawRequest): Request {
  return {
    id: r.id,
    status: r.status,
    riderName: r.rider?.name || "Rider",
    route: `${r.pickupAddress || "?"} → ${r.dropAddress || "?"}`,
    time: r.pickupTime ? new Date(r.pickupTime).toLocaleString() : "Now",
    meta: [r.distanceKm ? `${r.distanceKm} km` : null, r.fareEstimate ? `₹${r.fareEstimate}` : null]
      .filter(Boolean)
      .join(" · "),
  };
}

export default function DriverRequestsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["driver-requests"],
    queryFn: async () => {
      try {
        const res = await api.get("/driver/requests");
        const raw = Array.isArray(res.data) ? (res.data as RawRequest[]) : [];
        return raw.map(mapRequest);
      } catch {
        return [];
      }
    },
    refetchInterval: 5000,
  });

  const acceptMutation = useMutation({
    mutationFn: (tripId: string) => api.post("/driver/accept", { tripId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["driver-requests"] });
      queryClient.invalidateQueries({ queryKey: ["driver-active-trip"] });
      router.push("/driver/active");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (tripId: string) => api.post("/driver/reject", { tripId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["driver-requests"] }),
  });

  const searching = requests.filter((r) => r.status === "SEARCHING");
  const assigned = requests.filter((r) => r.status !== "SEARCHING");

  return (
    <div className="animate-fade-in space-y-4 md:space-y-6">
      <h1 className="text-xl font-bold text-white md:text-2xl">Incoming Requests</h1>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-white/5" />
          ))}
        </div>
      ) : requests.length > 0 ? (
        <div className="space-y-2 sm:space-y-3">
          {assigned.map((request) => (
            <div
              key={request.id}
              className="rounded-2xl border border-white/20 bg-white/5 p-3 sm:p-4"
            >
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-white">
                <span className="rounded-full bg-white px-2 py-0.5 text-black">Your trip</span>
                <span className="text-white/60">{request.status.replace("_", " ")}</span>
              </div>
              <p className="mb-1 text-sm text-white">{request.route}</p>
              <p className="text-xs text-white/50">{request.time}</p>
              <Button
                size="sm"
                className="mt-3 w-full"
                onClick={() => router.push("/driver/active")}
              >
                View Active Trip
              </Button>
            </div>
          ))}

          {searching.map((request) => (
            <div key={request.id} className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-3 sm:p-4">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white shrink-0">
                  {request.riderName?.[0] || "?"}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{request.riderName}</p>
                  <p className="text-xs text-white/50 truncate">{request.route}</p>
                </div>
              </div>
              <div className="mb-3 flex items-center gap-3 text-xs text-white/50">
                <span>{request.time}</span>
                {request.meta && <span>· {request.meta}</span>}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => rejectMutation.mutate(request.id)}
                  disabled={rejectMutation.isPending || acceptMutation.isPending}
                >
                  <X className="h-4 w-4" /> Reject
                </Button>
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => acceptMutation.mutate(request.id)}
                  disabled={acceptMutation.isPending || rejectMutation.isPending}
                >
                  {acceptMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Check className="h-4 w-4" /> Accept
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No pending requests"
          description="Ride requests will appear here when you're online. Go online to start receiving them."
        />
      )}
    </div>
  );
}
