"use client";

import { useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SafetyReportPage() {
  const router = useRouter();
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => router.push("/safety"), 2000);
  };

  if (submitted) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center py-20">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/10">
          <Send className="h-8 w-8 text-white" />
        </div>
        <h2 className="mb-2 text-xl font-bold text-white">Report Submitted</h2>
        <p className="text-sm text-white/50">Our safety team will review this shortly</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white/60 hover:bg-white/10 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-bold text-white">Report Issue</h1>
      </div>

      <div className="space-y-4">
        <Input
          label="Reason"
          placeholder="What happened?"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <div>
          <label className="mb-1.5 block text-sm font-medium text-white/70">Description</label>
          <textarea
            placeholder="Provide more details..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/20 resize-none"
          />
        </div>
        <Button onClick={handleSubmit} className="w-full" disabled={!reason || !description}>
          Submit Report
        </Button>
      </div>
    </div>
  );
}
