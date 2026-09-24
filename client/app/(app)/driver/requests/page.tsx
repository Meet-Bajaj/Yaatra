"use client";

import { Check, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { API } from "@/lib/endpoints";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

interface Request {
  id: string;
  riderName: string;
  route: string;
  time: string;
  seats?: number;
}

export default function DriverRequestsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["driver-requests"],
    queryFn: async () => {
      try {
        const res = await api.get(API.driver.requests);
        return (Array.isArray(res.data) ? res.data : []) as Request[];
      } catch {
        return [];
      }
    },
  });

  const acceptMutation = useMutation({
    mutationFn: (id: string) => api.post(API.driver.acceptRequest(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["driver-requests"] });
      queryClient.invalidateQueries({ queryKey: ["driver-active-trip"] });
      router.push("/driver/active");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => api.post(API.driver.rejectRequest(id)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["driver-requests"] }),
  });

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
          {requests.map((request) => (
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
              <p className="mb-3 text-xs text-white/50">{request.time}</p>
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
                    <><Check className="h-4 w-4" /> Accept</>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title="No pending requests" description="Requests from riders will appear here" />
      )}
    </div>
  );
}
