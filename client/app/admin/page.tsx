"use client";

import { Users, Car, Wallet, FileCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { API } from "@/lib/endpoints";
import { formatINR } from "@/lib/utils";

interface AdminStats {
  totalUsers?: number;
  activeUsers?: number;
  totalDrivers?: number;
  totalRiders?: number;
  totalBookings?: number;
  completedBookings?: number;
  pendingDocVerifications?: number;
  openDisputes?: number;
  totalRevenue?: number;
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
    { label: "Total Users", value: stats?.totalUsers ?? 0, icon: Users },
    { label: "Active Users", value: stats?.activeUsers ?? 0, icon: Users },
    { label: "Revenue", value: formatINR(stats?.totalRevenue ?? 0), icon: Wallet },
    { label: "Completed Rides", value: stats?.completedBookings ?? 0, icon: Car },
    { label: "Pending Verifications", value: stats?.pendingDocVerifications ?? 0, icon: FileCheck },
    { label: "Open Disputes", value: stats?.openDisputes ?? 0, icon: Users },
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

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-4">
          <p className="text-xs text-white/40 mb-1">Drivers</p>
          <p className="text-xl font-bold text-white">{stats?.totalDrivers ?? 0}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-4">
          <p className="text-xs text-white/40 mb-1">Riders</p>
          <p className="text-xl font-bold text-white">{stats?.totalRiders ?? 0}</p>
        </div>
      </div>
    </div>
  );
}
