"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, X } from "lucide-react";

export default function RideSearchingPage() {
  const router = useRouter();

  return (
    <div className="animate-fade-in flex flex-col items-center justify-center py-20">
      <button
        onClick={() => router.back()}
        className="absolute left-6 top-20 flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>

      <div className="relative mb-8">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/5">
          <Loader2 className="h-10 w-10 text-white animate-spin" />
        </div>
        <div className="absolute inset-0 rounded-full border-2 border-white/10 animate-pulse-ring" />
        <div className="absolute inset-0 rounded-full border border-white/5 animate-pulse-ring" style={{ animationDelay: "0.5s" }} />
      </div>

      <h2 className="mb-2 text-xl font-bold text-white">Finding your ride</h2>
      <p className="mb-8 text-sm text-white/50">Searching for the best match nearby...</p>

      <button
        onClick={() => router.push("/dashboard")}
        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white hover:bg-white/10 transition-colors"
      >
        <X className="h-4 w-4" />
        Cancel Search
      </button>
    </div>
  );
}
