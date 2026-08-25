"use client";

import { useState } from "react";
import { Plus, ArrowUpRight, ArrowDownLeft, CreditCard, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { cn } from "@/lib/utils";

const topupAmounts = [100, 200, 500, 1000];

const transactions = [
  { id: "1", type: "DEBIT", amount: -120, description: "Ride payment", date: "Today" },
  { id: "2", type: "TOPUP", amount: 500, description: "Wallet top-up", date: "Yesterday" },
  { id: "3", type: "DEBIT", amount: -80, description: "Ride payment", date: "22 Aug" },
];

export default function WalletPage() {
  const [showTopup, setShowTopup] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(200);

  return (
    <div className="animate-fade-in space-y-6">
      <h1 className="text-2xl font-bold text-white">Wallet</h1>

      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-6">
        <p className="mb-1 text-sm text-white/50">Available Balance</p>
        <p className="mb-4 text-4xl font-bold text-white">₹1,250</p>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => setShowTopup(true)}>
            <Plus className="h-4 w-4" /> Add Money
          </Button>
          <Button size="sm" variant="outline">
            <ArrowUpRight className="h-4 w-4" /> Withdraw
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white">Auto Payment</h3>
          <button className="relative h-6 w-11 rounded-full bg-white/20 transition-colors">
            <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform" />
          </button>
        </div>
        <p className="text-xs text-white/40">Automatically pay for rides from your wallet</p>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-white">Recent Transactions</h3>
        <div className="space-y-2">
          {transactions.map((txn) => (
            <div key={txn.id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0a0a0a] p-3">
              <div className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl",
                txn.amount > 0 ? "bg-green-500/10" : "bg-white/5"
              )}>
                {txn.amount > 0 ? (
                  <ArrowDownLeft className="h-5 w-5 text-green-400" />
                ) : (
                  <ArrowUpRight className="h-5 w-5 text-white/50" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{txn.description}</p>
                <p className="text-xs text-white/40">{txn.date}</p>
              </div>
              <p className={cn(
                "text-sm font-semibold",
                txn.amount > 0 ? "text-green-400" : "text-white"
              )}>
                {txn.amount > 0 ? "+" : ""}₹{Math.abs(txn.amount)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <BottomSheet open={showTopup} onClose={() => setShowTopup(false)} title="Add Money">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {topupAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() => setSelectedAmount(amount)}
                className={cn(
                  "rounded-xl border py-3 text-center text-sm font-semibold transition-all",
                  selectedAmount === amount
                    ? "border-white bg-white text-black"
                    : "border-white/10 bg-white/5 text-white hover:border-white/20"
                )}
              >
                ₹{amount}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#0a0a0a] p-3 text-sm text-white hover:bg-white/5 transition-colors">
              <Smartphone className="h-4 w-4" /> UPI
            </button>
            <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#0a0a0a] p-3 text-sm text-white hover:bg-white/5 transition-colors">
              <CreditCard className="h-4 w-4" /> Card
            </button>
          </div>
          <Button className="w-full">Add ₹{selectedAmount}</Button>
        </div>
      </BottomSheet>
    </div>
  );
}
