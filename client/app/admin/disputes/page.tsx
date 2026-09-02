"use client";

import { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { API } from "@/lib/endpoints";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { formatINR } from "@/lib/utils";
import { BottomSheet } from "@/components/ui/bottom-sheet";

interface Dispute {
  id: string;
  bookingStatus?: string;
  paymentStatus?: string;
  fareEstimate?: number;
  createdAt?: string;
  rider?: { id: string; name: string; phone: string } | null;
  instance?: {
    ride?: {
      driver?: {
        user?: { id: string; name: string; phone: string };
      } | null;
    } | null;
  } | null;
}

export default function AdminDisputesPage() {
  const queryClient = useQueryClient();
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [resolution, setResolution] = useState<string>("");

  const { data: disputes = [], isLoading } = useQuery({
    queryKey: ["admin-disputes"],
    queryFn: async () => {
      try {
        const res = await api.get(API.admin.disputes);
        const data = res.data;
        const list = Array.isArray(data) ? data : data?.disputes ?? [];
        return list as Dispute[];
      } catch {
        return [];
      }
    },
  });

  const resolveMutation = useMutation({
    mutationFn: ({ id, resolution }: { id: string; resolution: string }) =>
      api.patch(API.admin.resolveDispute(id), { resolution }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-disputes"] });
      setSelectedDispute(null);
      setResolution("");
    },
  });

  const getDriverName = (dispute: Dispute) =>
    dispute.instance?.ride?.driver?.user?.name || "—";
  const getRiderName = (dispute: Dispute) =>
    dispute.rider?.name || "—";

  const resolutions = [
    { value: "REFUND_RIDER", label: "Refund Rider", desc: "Full refund to rider" },
    { value: "PAY_DRIVER", label: "Pay Driver", desc: "Release payment to driver" },
    { value: "SPLIT", label: "Split", desc: "Split fare between both" },
    { value: "DISMISS", label: "Dismiss", desc: "Dismiss this dispute" },
  ];

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
            <button
              key={dispute.id}
              onClick={() => { setSelectedDispute(dispute); setResolution(""); }}
              className="w-full rounded-2xl border border-white/10 bg-[#0a0a0a] p-4 text-left hover:bg-white/5 transition-colors"
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {dispute.paymentStatus === "FAILED" ? "Payment Failed" : "Payment Pending"}
                    </p>
                    <p className="text-xs text-white/40">
                      {dispute.createdAt ? new Date(dispute.createdAt).toLocaleDateString() : ""}
                    </p>
                  </div>
                </div>
                <Badge variant="warning">
                  {dispute.paymentStatus || "OPEN"}
                </Badge>
              </div>

              <div className="space-y-1 text-xs text-white/50">
                <p>Rider: {getRiderName(dispute)}</p>
                <p>Driver: {getDriverName(dispute)}</p>
                {dispute.fareEstimate != null && (
                  <p>Amount: {formatINR(dispute.fareEstimate)}</p>
                )}
              </div>
            </button>
          ))}
        </div>
      ) : (
        <EmptyState title="No open disputes" />
      )}

      {/* Resolve Bottom Sheet */}
      <BottomSheet
        open={!!selectedDispute}
        onClose={() => { setSelectedDispute(null); setResolution(""); }}
        title="Resolve Dispute"
      >
        {selectedDispute && (
          <div className="space-y-4">
            <div className="space-y-1 rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white/50">
              <p>Rider: <span className="text-white">{getRiderName(selectedDispute)}</span></p>
              <p>Driver: <span className="text-white">{getDriverName(selectedDispute)}</span></p>
              {selectedDispute.fareEstimate != null && (
                <p>Amount: <span className="text-white">{formatINR(selectedDispute.fareEstimate)}</span></p>
              )}
            </div>

            <div className="space-y-2">
              {resolutions.map((r) => (
                <button
                  key={r.value}
                  onClick={() => setResolution(r.value)}
                  className={`w-full rounded-xl border p-3 text-left transition-all ${
                    resolution === r.value
                      ? "border-white bg-white/10"
                      : "border-white/10 bg-white/5 hover:border-white/20"
                  }`}
                >
                  <p className={`text-sm font-medium ${resolution === r.value ? "text-white" : "text-white/70"}`}>
                    {r.label}
                  </p>
                  <p className="text-xs text-white/40">{r.desc}</p>
                </button>
              ))}
            </div>

            <Button
              className="w-full"
              onClick={() => {
                if (!resolution) return;
                resolveMutation.mutate({ id: selectedDispute.id, resolution });
              }}
              disabled={!resolution || resolveMutation.isPending}
            >
              {resolveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Resolution"}
            </Button>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
