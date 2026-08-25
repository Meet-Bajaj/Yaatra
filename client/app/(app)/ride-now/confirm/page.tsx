"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, CreditCard, Wallet, Shield, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const paymentMethods = [
  { id: "wallet", label: "Yaatra Wallet", icon: Wallet, balance: "₹1,250" },
  { id: "upi", label: "UPI", icon: CreditCard, balance: "" },
  { id: "card", label: "Credit/Debit Card", icon: CreditCard, balance: "" },
];

export default function RideConfirmPage() {
  const router = useRouter();
  const [selectedPayment, setSelectedPayment] = useState("wallet");
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setConfirmed(true);
    setTimeout(() => router.push("/active-trip"), 1500);
  };

  if (confirmed) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center py-20">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white">
          <Check className="h-10 w-10 text-black" />
        </div>
        <h2 className="mb-2 text-xl font-bold text-white">Ride Confirmed!</h2>
        <p className="text-sm text-white/50">Your driver is on the way</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-bold text-white">Confirm Booking</h1>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-5">
        <h3 className="mb-4 text-sm font-semibold text-white/70 uppercase tracking-wider">Fare Breakdown</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Base fare</span>
            <span className="text-white">₹80</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Distance (12.5 km)</span>
            <span className="text-white">₹62</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Platform fee</span>
            <span className="text-white">₹10</span>
          </div>
          <div className="border-t border-white/10 pt-3">
            <div className="flex justify-between">
              <span className="font-semibold text-white">Total</span>
              <span className="text-lg font-bold text-white">₹152</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-5">
        <h3 className="mb-4 text-sm font-semibold text-white/70 uppercase tracking-wider">Payment Method</h3>
        <div className="space-y-2">
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            return (
              <button
                key={method.id}
                onClick={() => setSelectedPayment(method.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border p-3 transition-all",
                  selectedPayment === method.id
                    ? "border-white bg-white/5"
                    : "border-white/10 hover:border-white/20"
                )}
              >
                <Icon className="h-5 w-5 text-white/50" />
                <span className="flex-1 text-left text-sm text-white">{method.label}</span>
                {method.balance && <span className="text-xs text-white/40">{method.balance}</span>}
                {selectedPayment === method.id && <Check className="h-4 w-4 text-white" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-4">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-white/30 mt-0.5" />
          <div>
            <p className="text-xs text-white/50">
              Cancellation: Free cancellation up to 15 minutes before departure. Late cancellation fee applies.
            </p>
          </div>
        </div>
      </div>

      <Button onClick={handleConfirm} className="w-full" size="lg" disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm & Pay ₹152"}
      </Button>
    </div>
  );
}
