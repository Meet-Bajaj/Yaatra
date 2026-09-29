"use client";

import { useState } from "react";
import { Check, X, FileText, Loader2, Eye, ChevronDown, ChevronUp } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { API } from "@/lib/endpoints";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { BottomSheet } from "@/components/ui/bottom-sheet";

interface DocUser {
  id: string;
  name: string;
  phone: string;
  email?: string;
}

interface DocEntry {
  id: string;
  userId: string;
  type: string;
  s3Key?: string;
  status: string;
  rejectionReason?: string | null;
  uploadedAt?: string;
  verifiedAt?: string;
  user?: DocUser;
}

interface UserDocs {
  user: DocUser;
  docs: DocEntry[];
  expanded: boolean;
}

const PAGE_SIZE = 20;

const docTypeLabels: Record<string, string> = {
  AADHAAR: "Aadhaar Card",
  DRIVING_LICENSE: "Driving License",
  PAN: "PAN Card",
};

export default function AdminVerificationPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [selectedDoc, setSelectedDoc] = useState<DocEntry | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewName, setPreviewName] = useState("");
  const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set());

  const skip = page * PAGE_SIZE;

  const { data, isLoading } = useQuery({
    queryKey: ["admin-docs-queue", skip],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        params.set("skip", String(skip));
        params.set("take", String(PAGE_SIZE));
        const res = await api.get(`${API.admin.docsQueue}?${params.toString()}`);
        const raw = res.data;
        const list = Array.isArray(raw) ? raw : raw?.documents ?? [];
        const total = raw?.total ?? list.length;
        return { documents: list as DocEntry[], total };
      } catch {
        return { documents: [] as DocEntry[], total: 0 };
      }
    },
  });

  const documents = data?.documents ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const hasNext = skip + PAGE_SIZE < total;
  const hasPrev = page > 0;

  // Group documents by userId
  const groupedByUser: UserDocs[] = [];
  const userMap = new Map<string, UserDocs>();
  for (const doc of documents) {
    const uid = doc.userId;
    if (!userMap.has(uid)) {
      const entry: UserDocs = {
        user: doc.user || { id: uid, name: "Unknown", phone: "" },
        docs: [],
        expanded: expandedUsers.has(uid),
      };
      userMap.set(uid, entry);
      groupedByUser.push(entry);
    }
    userMap.get(uid)!.docs.push(doc);
  }

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

  const handlePreview = async (doc: DocEntry) => {
    try {
      const res = await api.get(API.admin.docUrl(doc.id));
      setPreviewUrl(res.data.url);
      setPreviewName(`${doc.user?.name || "user"} - ${docTypeLabels[doc.type] || doc.type}`);
    } catch {
      setPreviewUrl(null);
    }
  };

  const toggleUserExpand = (userId: string) => {
    setExpandedUsers((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return next;
    });
  };

  return (
    <div className="animate-fade-in space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white md:text-2xl">Document Verification</h1>
        <span className="text-xs text-white/40">{total} pending</span>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-white/5" />
          ))}
        </div>
      ) : groupedByUser.length > 0 ? (
        <>
          <div className="space-y-3">
            {groupedByUser.map((group) => (
              <div key={group.user.id} className="rounded-2xl border border-white/10 bg-[#0a0a0a] overflow-hidden">
                {/* ─── User Header ─────────────────────── */}
                <button
                  onClick={() => toggleUserExpand(group.user.id)}
                  className="flex w-full items-center gap-3 p-3 sm:p-4 text-left hover:bg-white/5 transition-colors touch-target"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white shrink-0">
                    {group.user.name?.[0] || "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{group.user.name}</p>
                    <p className="text-xs text-white/50">
                      {group.user.phone}
                      {group.user.email ? ` · ${group.user.email}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="rounded-full bg-yellow-500/15 px-2 py-0.5 text-[10px] font-semibold text-yellow-400">
                      {group.docs.length} doc{group.docs.length > 1 ? "s" : ""}
                    </span>
                    {group.expanded ? (
                      <ChevronUp className="h-4 w-4 text-white/40" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-white/40" />
                    )}
                  </div>
                </button>

                {/* ─── Documents List ──────────────────── */}
                {group.expanded && (
                  <div className="border-t border-white/5 space-y-0">
                    {group.docs.map((doc) => (
                      <div key={doc.id} className="flex items-center gap-3 border-b border-white/5 last:border-b-0 p-3 sm:px-4 sm:py-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 shrink-0">
                          <FileText className="h-4 w-4 text-white/50" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white">
                            {docTypeLabels[doc.type] || doc.type}
                          </p>
                          <p className="text-[10px] text-white/40">
                            {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : ""}
                            {doc.s3Key ? ` · ${doc.s3Key.split("/").pop()}` : ""}
                          </p>
                        </div>

                        <Badge
                          variant={
                            doc.status === "PENDING"
                              ? "warning"
                              : doc.status === "PASSED"
                                ? "success"
                                : "destructive"
                          }
                        >
                          {doc.status}
                        </Badge>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {doc.s3Key && (
                            <button
                              onClick={() => handlePreview(doc)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-colors touch-target"
                              title="Preview document"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          )}

                          {doc.status === "PENDING" && (
                            <>
                              <button
                                onClick={() => {
                                  setSelectedDoc(doc);
                                  setRejectReason("");
                                }}
                                disabled={verifyMutation.isPending}
                                className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-400/60 hover:bg-red-500/20 hover:text-red-400 transition-colors touch-target disabled:opacity-50"
                                title="Reject"
                              >
                                <X className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleApprove(doc)}
                                disabled={verifyMutation.isPending}
                                className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10 text-green-400/60 hover:bg-green-500/20 hover:text-green-400 transition-colors touch-target disabled:opacity-50"
                                title="Approve"
                              >
                                {verifyMutation.isPending && selectedDoc?.id === doc.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Check className="h-4 w-4" />
                                )}
                              </button>
                            </>
                          )}
                        </div>

                        {doc.status === "FAILED" && doc.rejectionReason && (
                          <p className="w-full text-[10px] text-red-400/70 mt-1 pl-12">
                            Rejected: {doc.rejectionReason}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ─── Pagination ──────────────────────────── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={!hasPrev}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white/60 hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed touch-target"
              >
                Previous
              </button>
              <span className="text-xs text-white/40">
                Page {page + 1} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!hasNext}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white/60 hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed touch-target"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <EmptyState icon={<FileText className="h-12 h-12" />} title="No documents in queue" />
      )}

      {/* ─── Reject Reason Sheet ─────────────────────── */}
      <BottomSheet
        open={!!selectedDoc}
        onClose={() => { setSelectedDoc(null); setRejectReason(""); }}
        title="Reject Document"
      >
        <div className="space-y-4">
          <p className="text-sm text-white/60">
            Provide a reason for rejecting {selectedDoc?.user?.name}&apos;s{" "}
            {docTypeLabels[selectedDoc?.type || ""] || selectedDoc?.type?.replace("_", " ")} document.
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

      {/* ─── Document Preview Sheet ──────────────────── */}
      <BottomSheet
        open={!!previewUrl}
        onClose={() => { setPreviewUrl(null); setPreviewName(""); }}
        title={previewName}
      >
        <div className="flex flex-col items-center gap-4">
          {previewUrl ? (
            previewUrl.endsWith(".pdf") ? (
              <iframe
                src={previewUrl}
                className="h-[60vh] w-full rounded-xl border border-white/10"
                title="Document preview"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt="Document preview"
                className="max-h-[60vh] w-auto rounded-xl border border-white/10 object-contain"
              />
            )
          ) : (
            <div className="flex h-40 items-center justify-center text-sm text-white/40">
              Failed to load preview
            </div>
          )}
        </div>
      </BottomSheet>
    </div>
  );
}
