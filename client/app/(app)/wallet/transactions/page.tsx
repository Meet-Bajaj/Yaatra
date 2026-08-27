"use client";

import { ArrowUpRight, ArrowDownLeft, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { API } from "@/lib/endpoints";
import { cn, formatINR } from "@/lib/utils";
import { EmptyState } from "@/components/ui/empty-state";

interface Transaction {
  id: string;
  type: string;
  amount: number;
  description: string;
  createdAt: string;
  method?: string;
}

const typeIcon: Record<string, typeof ArrowUpRight> = {
  DEBIT: ArrowUpRight,
  TOPUP: ArrowDownLeft,
  CREDIT: ArrowDownLeft,
  REFUND: RefreshCw,
};

export default function WalletTransactionsPage() {
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ["wallet-transactions"],
    queryFn: async () => {
      try {
        const res = await api.get(API.wallet.transactions);
        return (res.data || []) as Transaction[];
      } catch {
        return [];
      }
    },
  });

  return (
    <div className="animate-fade-in space-y-4">
      <h1 className="text-2xl font-bold text-white">Transactions</h1>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-white/5" />
          ))}
        </div>
      ) : transactions.length > 0 ? (
        <div className="space-y-2">
          {transactions.map((txn) => {
            const Icon = typeIcon[txn.type] || ArrowUpRight;
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
                  <p className="text-xs text-white/40">
                    {new Date(txn.createdAt).toLocaleDateString()}
                    {txn.method ? ` - ${txn.method}` : ""}
                  </p>
                </div>
                <p className={cn(
                  "text-sm font-semibold",
                  txn.amount > 0 ? "text-green-400" : "text-white"
                )}>
                  {txn.amount > 0 ? "+" : ""}{formatINR(txn.amount)}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState title="No transactions yet" />
      )}
    </div>
  );
}
