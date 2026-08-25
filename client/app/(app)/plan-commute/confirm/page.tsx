"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PlanCommuteConfirmPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setConfirmed(true);
    setTimeout(() => router.push("/schedules"), 1500);
  };

  if (confirmed) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center py-20">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white">
          <Check className="h-10 w-10 text-black" />
        </div>
        <h2 className="mb-2 text-xl font-bold text-white">Commute Booked!</h2>
        <p className="text-sm text-white/50">Your carpool schedule is confirmed</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white/60 hover:bg-white/10 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-bold text-white">Confirm Booking</h1>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-5 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-white/60">Driver</span>
          <span className="text-white">Vikram P.</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-white/60">Route</span>
          <span className="text-white">HSR Layout to Electronic City</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-white/60">Schedule</span>
          <span className="text-white">Mon-Fri, 9:00 AM</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-white/60">Price/seat</span>
          <span className="text-white">₹80</span>
        </div>
        <div className="border-t border-white/10 pt-3">
          <div className="flex justify-between">
            <span className="font-semibold text-white">Monthly Total</span>
            <span className="text-lg font-bold text-white">₹1,760</span>
          </div>
        </div>
      </div>

      <Button onClick={handleConfirm} className="w-full" size="lg" disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Commute"}
      </Button>
    </div>
  );
}
