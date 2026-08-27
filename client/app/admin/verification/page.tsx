"use client";

import { Check, X, FileText } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { API } from "@/lib/endpoints";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";

interface DocEntry {
  id: string;
  userName?: string;
  type: string;
  uploadedAt?: string;
  status: string;
}

export default function AdminVerificationPage() {
  const queryClient = useQueryClient();

  const { data: docs = [], isLoading } = useQuery({
    queryKey: ["admin-docs-queue"],
    queryFn: async () => {
      try {
        const res = await api.get(API.admin.docsQueue);
        return (Array.isArray(res.data) ? res.data : []) as DocEntry[];
      } catch {
        return [];
      }
    },
  });

  const verifyMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch(API.admin.verifyDoc(id), { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-docs-queue"] }),
  });

  return (
    <div className="animate-fade-in space-y-6">
      <h1 className="text-2xl font-bold text-white">Document Verification</h1>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-white/5" />
          ))}
        </div>
      ) : docs.length > 0 ? (
        <div className="space-y-3">
          {docs.map((doc) => (
            <div key={doc.id} className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-4">
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                    <FileText className="h-5 w-5 text-white/50" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{doc.userName || "Unknown"}</p>
                    <p className="text-xs text-white/40">
                      {doc.type.replace("_", " ")}
                      {doc.uploadedAt ? ` - ${doc.uploadedAt}` : ""}
                    </p>
                  </div>
                </div>
                <Badge variant={doc.status === "PENDING" ? "warning" : "success"}>
                  {doc.status}
                </Badge>
              </div>

              {doc.status === "PENDING" && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => verifyMutation.mutate({ id: doc.id, status: "REJECTED" })}
                    disabled={verifyMutation.isPending}
                  >
                    <X className="h-4 w-4" /> Reject
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => verifyMutation.mutate({ id: doc.id, status: "APPROVED" })}
                    disabled={verifyMutation.isPending}
                  >
                    <Check className="h-4 w-4" /> Approve
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon={<FileText className="h-12 w-12" />} title="No documents in queue" />
      )}
    </div>
  );
}
