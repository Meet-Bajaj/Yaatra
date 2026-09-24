"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, CreditCard, Wallet, Shield, Check } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { API } from "@/lib/endpoints";
import { useRideSearchStore } from "@/stores/rideSearchStore";
import { Button } from "@/components/ui/button";
import { cn, formatINR } from "@/lib/utils";

interface PriceEstimate {
  baseFare: number;
  distanceFare: number;
  platformFee: number;
  total: number;
  distance?: number;
}

const paymentMethods = [
  { id: "wallet", label: "Yaatra Wallet", icon: Wallet },
  { id: "upi", label: "UPI", icon: CreditCard },
  { id: "card", label: "Credit/Debit Card", icon: CreditCard },
];

export default function RideConfirmPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { pickup, dropoff } = useRideSearchStore();
  const [selectedPayment, setSelectedPayment] = useState("wallet");

  const { data: pricing, isLoading: pricingLoading } = useQuery({
    queryKey: ["pricing-estimate", pickup?.address, dropoff?.address],
    queryFn: async () => {
      try {
        const res = await api.post(API.pricing.estimate, {
          pickupLat: pickup?.lat,
          pickupLng: pickup?.lng,
          pickupAddress: pickup?.address,
          dropoffLat: dropoff?.lat,
          dropoffLng: dropoff?.lng,
          dropoffAddress: dropoff?.address,
        });
        return res.data as PriceEstimate;
      } catch {
        return null;
      }
    },
    enabled: !!(pickup && dropoff),
  });

  const bookMutation = useMutation({
    mutationFn: () =>
      api.post(API.rides.book, {
        pickupLat: pickup?.lat,
        pickupLng: pickup?.lng,
        pickupAddress: pickup?.address,
        dropoffLat: dropoff?.lat,
        dropoffLng: dropoff?.lng,
        dropoffAddress: dropoff?.address,
        paymentMethod: selectedPayment.toUpperCase(),
      }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["active-trip"] });
      router.push("/active-trip");
    },
  });

  const total = pricing?.total ?? 0;

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
        {pricingLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-5 animate-pulse rounded bg-white/5" />
            ))}
          </div>
        ) : pricing ? (
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Base fare</span>
              <span className="text-white">{formatINR(pricing.baseFare)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Distance{pricing.distance ? ` (${pricing.distance} km)` : ""}</span>
              <span className="text-white">{formatINR(pricing.distanceFare)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Platform fee</span>
              <span className="text-white">{formatINR(pricing.platformFee)}</span>
            </div>
            <div className="border-t border-white/10 pt-3">
              <div className="flex justify-between">
                <span className="font-semibold text-white">Total</span>
                <span className="text-lg font-bold text-white">{formatINR(total)}</span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-white/40">Pricing unavailable. Please try again.</p>
        )}
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

      {bookMutation.isError && (
        <div className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
          Failed to book ride. Please try again.
        </div>
      )}

      <Button
        onClick={() => bookMutation.mutate()}
        className="w-full"
        size="lg"
        disabled={bookMutation.isPending || pricingLoading || !pricing}
      >
        {bookMutation.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          `Confirm & Pay ${formatINR(total)}`
        )}
      </Button>
    </div>
  );
}
