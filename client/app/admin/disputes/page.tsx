"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { API } from "@/lib/endpoints";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { formatINR } from "@/lib/utils";

interface Dispute {
  id: string;
  rideId?: string;
  rider?: string;
  driver?: string;
  reason: string;
  amount?: number;
  status: string;
  createdAt?: string;
}

export default function AdminDisputesPage() {
  const queryClient = useQueryClient();

  const { data: disputes = [], isLoading } = useQuery({
    queryKey: ["admin-disputes"],
    queryFn: async () => {
      try {
        const res = await api.get(API.admin.disputes);
        return (Array.isArray(res.data) ? res.data : []) as Dispute[];
      } catch {
        return [];
      }
    },
  });

  const resolveMutation = useMutation({
    mutationFn: ({ id, resolution }: { id: string; resolution: string }) =>
      api.patch(API.admin.resolveDispute(id), { resolution }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-disputes"] }),
  });

  return (
    <div className="animate-fade-in space-y-6">
      <h1 className="text-2xl font-bold text-white">Disputes</h1>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-white/5" />
          ))}
        </div>
      ) : disputes.length > 0 ? (
        <div className="space-y-3">
          {disputes.map((dispute) => (
            <div key={dispute.id} className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-4">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-white">{dispute.reason}</p>
                  <p className="text-xs text-white/40">
                    {dispute.rideId ? `Ride ${dispute.rideId}` : ""}
                    {dispute.createdAt ? ` - ${new Date(dispute.createdAt).toLocaleDateString()}` : ""}
                  </p>
                </div>
                <Badge variant={dispute.status === "OPEN" ? "warning" : "success"}>
                  {dispute.status}
                </Badge>
              </div>

              <div className="mb-3 space-y-1 text-xs text-white/50">
                {dispute.rider && <p>Rider: {dispute.rider}</p>}
                {dispute.driver && <p>Driver: {dispute.driver}</p>}
                {dispute.amount != null && <p>Amount: {formatINR(dispute.amount)}</p>}
              </div>

              {dispute.status === "OPEN" && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => resolveMutation.mutate({ id: dispute.id, resolution: "DISMISSED" })}
                    disabled={resolveMutation.isPending}
                  >
                    Dismiss
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => resolveMutation.mutate({ id: dispute.id, resolution: "RESOLVED" })}
                    disabled={resolveMutation.isPending}
                  >
                    Resolve
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title="No open disputes" />
      )}
    </div>
  );
}
