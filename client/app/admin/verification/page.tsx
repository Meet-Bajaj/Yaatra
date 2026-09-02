"use client";

import { useState } from "react";
import { Check, X, FileText, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { API } from "@/lib/endpoints";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { BottomSheet } from "@/components/ui/bottom-sheet";

interface DocEntry {
  id: string;
  userId: string;
  type: string;
  s3Key?: string;
  status: string;
  rejectionReason?: string | null;
  uploadedAt?: string;
  user?: {
    id: string;
    name: string;
    phone: string;
    email?: string;
  };
}

export default function AdminVerificationPage() {
  const queryClient = useQueryClient();
  const [selectedDoc, setSelectedDoc] = useState<DocEntry | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const { data: docs = [], isLoading } = useQuery({
    queryKey: ["admin-docs-queue"],
    queryFn: async () => {
      try {
        const res = await api.get(API.admin.docsQueue);
        const data = res.data;
        const list = Array.isArray(data) ? data : data?.documents ?? [];
        return list as DocEntry[];
      } catch {
        return [];
      }
    },
  });

  const verifyMutation = useMutation({
    mutationFn: ({ id, action, rejectionReason }: { id: string; action: string; rejectionReason?: string }) =>
      api.patch(API.admin.verifyDoc(id), { action, rejectionReason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-docs-queue"] });
      setSelectedDoc(null);
      setRejectReason("");
    },
  });

  const handleApprove = (doc: DocEntry) => {
    verifyMutation.mutate({ id: doc.id, action: "PASSED" });
  };

  const handleReject = () => {
    if (!selectedDoc) return;
    verifyMutation.mutate({
      id: selectedDoc.id,
      action: "FAILED",
      rejectionReason: rejectReason || "Document does not meet requirements",
    });
  };

  return (
    <div className="animate-fade-in space-y-4 md:space-y-6">
      <h1 className="text-xl font-bold text-white md:text-2xl">Document Verification</h1>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-white/5" />
          ))}
        </div>
      ) : docs.length > 0 ? (
        <div className="space-y-2 sm:space-y-3">
          {docs.map((doc) => (
            <div key={doc.id} className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-3 sm:p-4">
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 shrink-0">
                    <FileText className="h-5 w-5 text-white/60" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {doc.user?.name || "Unknown User"}
                    </p>
                    <p className="text-xs text-white/50">
                      {doc.type.replace("_", " ")}
                      {doc.uploadedAt ? ` · ${new Date(doc.uploadedAt).toLocaleDateString()}` : ""}
                    </p>
                    {doc.user?.phone && (
                      <p className="text-[10px] text-white/40">{doc.user.phone}</p>
                    )}
                  </div>
                </div>
                <Badge variant={doc.status === "PENDING" ? "warning" : doc.status === "PASSED" ? "success" : "destructive"}>
                  {doc.status}
                </Badge>
              </div>

              {doc.status === "PENDING" && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setSelectedDoc(doc);
                      setRejectReason("");
                    }}
                    disabled={verifyMutation.isPending}
                  >
                    <X className="h-4 w-4" /> Reject
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => handleApprove(doc)}
                    disabled={verifyMutation.isPending}
                  >
                    <Check className="h-4 w-4" /> Approve
                  </Button>
                </div>
              )}

              {doc.status === "FAILED" && doc.rejectionReason && (
                <p className="text-xs text-red-400/70 mt-2">
                  Rejected: {doc.rejectionReason}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon={<FileText className="h-12 h-12" />} title="No documents in queue" />
      )}

      <BottomSheet
        open={!!selectedDoc}
        onClose={() => { setSelectedDoc(null); setRejectReason(""); }}
        title="Reject Document"
      >
        <div className="space-y-4">
          <p className="text-sm text-white/60">
            Provide a reason for rejecting {selectedDoc?.user?.name}&apos;s {selectedDoc?.type?.replace("_", " ")} document.
          </p>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="e.g. Document is blurry, expired, or illegible..."
            className="h-24 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/20 resize-none touch-target"
          />
          <Button
            variant="outline"
            className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10"
            size="lg"
            onClick={handleReject}
            disabled={verifyMutation.isPending}
          >
            {verifyMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Rejection"}
          </Button>
        </div>
      </BottomSheet>
    </div>
  );
}
