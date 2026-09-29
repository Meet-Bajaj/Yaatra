"use client";

import Link from "next/link";
import { ArrowUpRight, TrendingUp, Car, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { API } from "@/lib/endpoints";
import { formatINR } from "@/lib/utils";
import { EmptyState } from "@/components/ui/empty-state";

interface Earnings {
  totalEarnings: number;
  tripEarnings: number;
  offerEarnings: number;
  totalTrips: number;
  totalBookings: number;
  recentTrips: Array<{
    id: string;
    fareFinal?: number | string | null;
    fareEstimate?: number | string | null;
    createdAt: string;
    endTime?: string | null;
  }>;
  recentBookings: Array<{
    id: string;
    fareTotal: number | string;
    commission: number | string;
    createdAt: string;
  }>;
}

type Activity = { id: string; amount: number; date: string; label: string };

export default function DriverEarningsPage() {
  const { data: earnings, isLoading } = useQuery({
    queryKey: ["driver-earnings"],
    queryFn: async () => {
      try {
        const res = await api.get(API.driver.earnings);
        return res.data as Earnings;
      } catch {
        return null;
      }
    },
  });

  const activity: Activity[] = [
    ...(earnings?.recentTrips ?? []).map((t) => ({
      id: t.id,
      amount: Number(t.fareFinal || t.fareEstimate || 0),
      date: String(t.endTime || t.createdAt),
      label: "On-demand ride",
    })),
    ...(earnings?.recentBookings ?? []).map((b) => ({
      id: b.id,
      amount: Number(b.fareTotal) - Number(b.commission),
      date: String(b.createdAt),
      label: "Carpool booking",
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  return (
    <div className="animate-fade-in space-y-4 md:space-y-6">
      <h1 className="text-xl font-bold text-white md:text-2xl">Earnings</h1>

      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-5 md:p-6">
        <p className="mb-1 text-sm text-white/60">Total Earnings</p>
        <p className="mb-4 text-3xl font-bold text-white md:text-4xl">
          {isLoading ? "—" : formatINR(earnings?.totalEarnings || 0)}
        </p>
        <Link
          href="/wallet"
          className="inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2.5 text-xs font-medium text-black hover:bg-white/90 transition-colors touch-target"
        >
          <ArrowUpRight className="h-3 w-3" /> Withdraw
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <div className="rounded-xl border border-white/10 bg-[#0a0a0a] p-3 sm:p-4">
          <Car className="mb-2 h-5 w-5 text-white/50" />
          <p className="text-lg font-bold text-white">
            {isLoading ? "—" : formatINR(earnings?.tripEarnings || 0)}
          </p>
          <p className="text-[10px] text-white/50">
            On-demand · {earnings?.totalTrips ?? 0} trips
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#0a0a0a] p-3 sm:p-4">
          <Users className="mb-2 h-5 w-5 text-white/50" />
          <p className="text-lg font-bold text-white">
            {isLoading ? "—" : formatINR(earnings?.offerEarnings || 0)}
          </p>
          <p className="text-[10px] text-white/50">
            Carpool · {earnings?.totalBookings ?? 0} bookings
          </p>
        </div>
      </div>

      <div>
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
          <TrendingUp className="h-4 w-4 text-white/50" /> Recent Earnings
        </h3>
        {activity.length > 0 ? (
          <div className="space-y-2">
            {activity.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-[#0a0a0a] p-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white">{item.label}</p>
                  <p className="text-xs text-white/50">
                    {new Date(item.date).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-sm font-semibold text-white shrink-0">
                  {formatINR(item.amount)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="No earnings yet" description="Completed rides will show up here." />
        )}
      </div>
    </div>
  );
}
