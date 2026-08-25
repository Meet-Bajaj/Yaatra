"use client";

import { Users, Car, Wallet, TrendingUp } from "lucide-react";

const stats = [
  { label: "Total Users", value: "1,234", icon: Users, change: "+12%" },
  { label: "Active Rides", value: "56", icon: Car, change: "+8%" },
  { label: "Revenue", value: "₹2.4L", icon: Wallet, change: "+15%" },
  { label: "Signups Today", value: "28", icon: TrendingUp, change: "+22%" },
];

export default function AdminDashboardPage() {
  return (
    <div className="animate-fade-in space-y-6">
      <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>

      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-4">
              <Icon className="mb-2 h-5 w-5 text-white/30" />
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-white/40">{stat.label}</p>
              <p className="mt-1 text-[10px] text-green-400">{stat.change} this week</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
