"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, ArrowUpRight, ArrowDownLeft, CreditCard, Smartphone, ArrowRight } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { API } from "@/lib/endpoints";
import { Button } from "@/components/ui/button";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { EmptyState } from "@/components/ui/empty-state";
import { cn, formatINR } from "@/lib/utils";

const topupAmounts = [100, 200, 500, 1000];

export default function WalletPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showTopup, setShowTopup] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(200);

  const { data: wallet, isLoading } = useQuery({
    queryKey: ["wallet-balance"],
    queryFn: async () => {
      try {
        const res = await api.get(API.wallet.balance);
        return res.data as { balance: number };
      } catch {
        return { balance: 0 };
      }
    },
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ["wallet-transactions"],
    queryFn: async () => {
      try {
        const res = await api.get(API.wallet.transactions);
        return (res.data || []) as Array<{
          id: string;
          type: string;
          amount: number;
          description: string;
          createdAt: string;
        }>;
      } catch {
        return [];
      }
    },
  });

  const topupMutation = useMutation({
    mutationFn: (amount: number) => api.post(API.wallet.topup, { amount }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet-balance"] });
      queryClient.invalidateQueries({ queryKey: ["wallet-transactions"] });
      setShowTopup(false);
    },
  });

  const balance = wallet?.balance ?? 0;
  const recentTxns = transactions.slice(0, 3);

  return (
    <div className="animate-fade-in space-y-6">
      <h1 className="text-2xl font-bold text-white">Wallet</h1>

      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-6">
        <p className="mb-1 text-sm text-white/50">Available Balance</p>
        <p className="mb-4 text-4xl font-bold text-white">
          {isLoading ? "—" : formatINR(balance)}
        </p>
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
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white">Recent Transactions</h3>
          {transactions.length > 0 && (
            <button
              onClick={() => router.push("/wallet/transactions")}
              className="flex items-center gap-1 text-xs text-white/40 hover:text-white transition-colors"
            >
              View all <ArrowRight className="h-3 w-3" />
            </button>
          )}
        </div>
        {recentTxns.length > 0 ? (
          <div className="space-y-2">
            {recentTxns.map((txn) => (
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
                  <p className="text-xs text-white/40">{new Date(txn.createdAt).toLocaleDateString()}</p>
                </div>
                <p className={cn(
                  "text-sm font-semibold",
                  txn.amount > 0 ? "text-green-400" : "text-white"
                )}>
                  {txn.amount > 0 ? "+" : ""}{formatINR(txn.amount)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="No transactions yet" />
        )}
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
                {formatINR(amount)}
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
          <Button
            className="w-full"
            onClick={() => topupMutation.mutate(selectedAmount)}
            disabled={topupMutation.isPending}
          >
            {topupMutation.isPending ? "Adding..." : `Add ${formatINR(selectedAmount)}`}
          </Button>
        </div>
      </BottomSheet>
    </div>
  );
}
