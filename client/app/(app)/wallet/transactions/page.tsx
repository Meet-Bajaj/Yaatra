"use client";

import { ArrowUpRight, ArrowDownLeft, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

const allTransactions = [
  { id: "1", type: "DEBIT", amount: -120, description: "Ride: Koramangala to EC", date: "23 Aug 2026", method: "Wallet" },
  { id: "2", type: "TOPUP", amount: 500, description: "Wallet top-up via UPI", date: "22 Aug 2026", method: "UPI" },
  { id: "3", type: "DEBIT", amount: -80, description: "Ride: HSR to Whitefield", date: "22 Aug 2026", method: "Wallet" },
  { id: "4", type: "REFUND", amount: 50, description: "Refund - Ride cancelled", date: "21 Aug 2026", method: "Wallet" },
  { id: "5", type: "DEBIT", amount: -250, description: "Ride: Koramangala to EC", date: "20 Aug 2026", method: "Card" },
];

const typeIcon = {
  DEBIT: ArrowUpRight,
  TOPUP: ArrowDownLeft,
  REFUND: RefreshCw,
};

export default function WalletTransactionsPage() {
  return (
    <div className="animate-fade-in space-y-4">
      <h1 className="text-2xl font-bold text-white">Transactions</h1>

      <div className="space-y-2">
        {allTransactions.map((txn) => {
          const Icon = typeIcon[txn.type as keyof typeof typeIcon] || ArrowUpRight;
          return (
            <div key={txn.id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0a0a0a] p-3">
              <div className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl",
                txn.amount > 0 ? "bg-green-500/10" : "bg-white/5"
              )}>
                <Icon className="h-5 w-5 text-white/50" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{txn.description}</p>
                <p className="text-xs text-white/40">{txn.date} - {txn.method}</p>
              </div>
              <p className={cn(
                "text-sm font-semibold",
                txn.amount > 0 ? "text-green-400" : "text-white"
              )}>
                {txn.amount > 0 ? "+" : ""}₹{Math.abs(txn.amount)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
