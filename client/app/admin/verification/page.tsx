"use client";

import { Check, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const docs = [
  { id: "1", userName: "Arjun Kumar", type: "DRIVING_LICENSE", uploadedAt: "22 Aug 2026", status: "PENDING" },
  { id: "2", userName: "Priya Mehta", type: "AADHAAR", uploadedAt: "21 Aug 2026", status: "PENDING" },
  { id: "3", userName: "Rahul Singh", type: "PAN", uploadedAt: "20 Aug 2026", status: "PASSED" },
];

export default function AdminVerificationPage() {
  return (
    <div className="animate-fade-in space-y-6">
      <h1 className="text-2xl font-bold text-white">Document Verification</h1>

      <div className="space-y-3">
        {docs.map((doc) => (
          <div key={doc.id} className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-4">
            <div className="mb-3 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                  <FileText className="h-5 w-5 text-white/50" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{doc.userName}</p>
                  <p className="text-xs text-white/40">{doc.type.replace("_", " ")} - {doc.uploadedAt}</p>
                </div>
              </div>
              <Badge variant={doc.status === "PENDING" ? "warning" : "success"}>
                {doc.status}
              </Badge>
            </div>

            {doc.status === "PENDING" && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <X className="h-4 w-4" /> Reject
                </Button>
                <Button size="sm" className="flex-1">
                  <Check className="h-4 w-4" /> Approve
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
