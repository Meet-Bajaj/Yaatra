"use client";

import { Users, Car, Wallet, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { API } from "@/lib/endpoints";
import { formatINR } from "@/lib/utils";

interface AdminStats {
  totalUsers?: number;
  activeRides?: number;
  revenue?: number;
  signupsToday?: number;
  totalDrivers?: number;
  totalRiders?: number;
}

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      try {
        const res = await api.get(API.admin.stats);
        return res.data as AdminStats;
      } catch {
        return null;
      }
    },
  });

  const statCards = [
    { label: "Total Users", value: stats?.totalUsers ?? 0, icon: Users, change: "+12%" },
    { label: "Active Rides", value: stats?.activeRides ?? 0, icon: Car, change: "+8%" },
    { label: "Revenue", value: formatINR(stats?.revenue ?? 0), icon: Wallet, change: "+15%" },
    { label: "Signups Today", value: stats?.signupsToday ?? 0, icon: TrendingUp, change: "+22%" },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>

      <div className="grid grid-cols-2 gap-3">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-4">
              <Icon className="mb-2 h-5 w-5 text-white/30" />
              <p className="text-2xl font-bold text-white">
                {isLoading ? "—" : stat.value}
              </p>
              <p className="text-xs text-white/40">{stat.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
