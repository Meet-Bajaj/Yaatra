"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Check, Loader2, MapPin, Calendar, User } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { API } from "@/lib/endpoints";
import { Button } from "@/components/ui/button";
import { formatINR } from "@/lib/utils";

function ConfirmContent() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  const instanceId = searchParams.get("instanceId") || "";
  const driverName = searchParams.get("driverName") || "Driver";
  const price = Number(searchParams.get("price") || 0);
  const when = searchParams.get("when") || "";
  const pickupAddress = searchParams.get("pickupAddress") || "";
  const dropAddress = searchParams.get("dropAddress") || "";

  const [confirmed, setConfirmed] = useState(false);

  const bookMutation = useMutation({
    mutationFn: () =>
      api.post(API.rides.book, {
        type: "SCHEDULED",
        instanceId,
        seats: 1,
        pickupAddress,
        dropAddress,
        paymentMethod: "WALLET",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      queryClient.invalidateQueries({ queryKey: ["rides-upcoming"] });
      setConfirmed(true);
      setTimeout(() => router.push("/schedules"), 1500);
    },
  });

  if (confirmed) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center py-20">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white">
          <Check className="h-10 w-10 text-black" />
        </div>
        <h2 className="mb-2 text-xl font-bold text-white">Commute Booked!</h2>
        <p className="text-sm text-white/50">Your carpool seat is confirmed</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white/60 hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-bold text-white">Confirm Booking</h1>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-5 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="flex items-center gap-2 text-white/60">
            <User className="h-4 w-4" /> Driver
          </span>
          <span className="text-white">{driverName}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="flex items-center gap-2 text-white/60">
            <MapPin className="h-4 w-4" /> Route
          </span>
          <span className="max-w-[60%] text-right text-white">
            {pickupAddress || "—"} to {dropAddress || "—"}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="flex items-center gap-2 text-white/60">
            <Calendar className="h-4 w-4" /> Schedule
          </span>
          <span className="text-white">{when || "—"}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-white/60">Seats</span>
          <span className="text-white">1</span>
        </div>
        <div className="border-t border-white/10 pt-3">
          <div className="flex justify-between">
            <span className="font-semibold text-white">Total per ride</span>
            <span className="text-lg font-bold text-white">{formatINR(price)}</span>
          </div>
        </div>
      </div>

      {!instanceId && (
        <div className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
          Missing ride details. Please go back and select a carpool again.
        </div>
      )}
      {bookMutation.isError && (
        <div className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
          Failed to book commute. The ride may be full — try another match.
        </div>
      )}

      <Button
        onClick={() => bookMutation.mutate()}
        className="w-full"
        size="lg"
        disabled={bookMutation.isPending || !instanceId}
      >
        {bookMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Commute"}
      </Button>
    </div>
  );
}

export default function PlanCommuteConfirmPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-white/50" />
        </div>
      }
    >
      <ConfirmContent />
    </Suspense>
  );
}
