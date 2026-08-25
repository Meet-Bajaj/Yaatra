"use client";

import { Wallet, ArrowUpRight, TrendingUp, Calendar } from "lucide-react";

export default function DriverEarningsPage() {
  return (
    <div className="animate-fade-in space-y-6">
      <h1 className="text-2xl font-bold text-white">Earnings</h1>

      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-6">
        <p className="mb-1 text-sm text-white/50">Total Earnings</p>
        <p className="mb-4 text-4xl font-bold text-white">₹12,450</p>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-xs font-medium text-black hover:bg-white/90 transition-colors">
            <ArrowUpRight className="h-3 w-3" /> Withdraw
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-white/10 bg-[#0a0a0a] p-4">
          <TrendingUp className="mb-2 h-5 w-5 text-white/30" />
          <p className="text-lg font-bold text-white">₹850</p>
          <p className="text-[10px] text-white/40">Today</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#0a0a0a] p-4">
          <Calendar className="mb-2 h-5 w-5 text-white/30" />
          <p className="text-lg font-bold text-white">₹4,200</p>
          <p className="text-[10px] text-white/40">This Week</p>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-white">Recent Payouts</h3>
        <div className="space-y-2">
          {[
            { id: "1", amount: 2400, date: "22 Aug 2026", status: "Completed" },
            { id: "2", amount: 1800, date: "15 Aug 2026", status: "Completed" },
            { id: "3", amount: 3200, date: "8 Aug 2026", status: "Completed" },
          ].map((payout) => (
            <div key={payout.id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0a0a0a] p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">
                <Wallet className="h-5 w-5 text-green-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">₹{payout.amount}</p>
                <p className="text-xs text-white/40">{payout.date}</p>
              </div>
              <span className="text-xs text-green-400">{payout.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
