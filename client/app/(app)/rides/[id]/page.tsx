"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Clock, Receipt, RotateCcw, Flag } from "lucide-react";

export default function RideDetailPage({ params }: PageProps<"/rides/[id]">) {
  void params;
  const router = useRouter();

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white/60 hover:bg-white/10 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-bold text-white">Ride Details</h1>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-5 space-y-4">
        <div className="flex items-center gap-2 text-sm text-white/60">
          <MapPin className="h-4 w-4 text-white/30" />
          <span>Koramangala to Electronic City</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-white/60">
          <Clock className="h-4 w-4 text-white/30" />
          <span>21 Aug 2026, 9:00 AM</span>
        </div>
        <div className="border-t border-white/10 pt-3">
          <p className="text-xs text-white/40 mb-1">Driver</p>
          <p className="text-sm font-medium text-white">Arjun K. - Swift Dzire</p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-5 space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40">Fare Breakdown</h3>
        <div className="flex justify-between text-sm">
          <span className="text-white/60">Base fare</span>
          <span className="text-white">₹80</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-white/60">Distance</span>
          <span className="text-white">₹40</span>
        </div>
        <div className="border-t border-white/10 pt-3">
          <div className="flex justify-between">
            <span className="font-semibold text-white">Total</span>
            <span className="text-lg font-bold text-white">₹120</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <button className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-[#0a0a0a] p-3 text-left text-sm text-white/60 hover:bg-white/5 transition-colors">
          <Receipt className="h-4 w-4" /> View Receipt
        </button>
        <button className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-[#0a0a0a] p-3 text-left text-sm text-white/60 hover:bg-white/5 transition-colors">
          <RotateCcw className="h-4 w-4" /> Rebook
        </button>
        <button className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-[#0a0a0a] p-3 text-left text-sm text-white/60 hover:bg-white/5 transition-colors">
          <Flag className="h-4 w-4" /> Report Issue
        </button>
      </div>
    </div>
  );
}
