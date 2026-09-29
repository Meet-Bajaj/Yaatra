"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, ArrowUpRight, ArrowDownLeft, CreditCard, Smartphone, ArrowRight, Banknote } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { API } from "@/lib/endpoints";
import { Button } from "@/components/ui/button";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { EmptyState } from "@/components/ui/empty-state";
import { cn, formatINR } from "@/lib/utils";
import { fetchWalletTransactions } from "@/lib/wallet";

const topupAmounts = [100, 200, 500, 1000];

export default function WalletPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showTopup, setShowTopup] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(200);
  const [topupMethod, setTopupMethod] = useState("upi");
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(1100);
  const [autoPay, setAutoPay] = useState(false);

  useEffect(() => {
    try {
      // Reading browser-only storage must happen after hydration.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAutoPay(localStorage.getItem("yaatra-autopay") === "1");
    } catch {
      // ignore
    }
  }, []);

  const toggleAutoPay = () => {
    const next = !autoPay;
    setAutoPay(next);
    try {
      localStorage.setItem("yaatra-autopay", next ? "1" : "0");
    } catch {
      // ignore
    }
  };

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
    queryFn: fetchWalletTransactions,
  });

  const topupMutation = useMutation({
    mutationFn: (amount: number) => api.post(API.wallet.topup, { amount }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet-balance"] });
      queryClient.invalidateQueries({ queryKey: ["wallet-transactions"] });
      setShowTopup(false);
    },
  });

  const withdrawMutation = useMutation({
    mutationFn: (amount: number) => api.post(API.wallet.withdraw, { amount }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet-balance"] });
      queryClient.invalidateQueries({ queryKey: ["wallet-transactions"] });
      setShowWithdraw(false);
    },
  });

  const withdrawError =
    (withdrawMutation.error as { response?: { data?: { message?: string } } })?.response?.data
      ?.message || "Withdrawal failed. Please try again.";

  const balance = wallet?.balance ?? 0;
  const recentTxns = transactions.slice(0, 3);

  return (
    <div className="animate-fade-in space-y-4 md:space-y-6">
      <h1 className="text-xl font-bold text-white md:text-2xl">Wallet</h1>

      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-5 md:p-6">
        <p className="mb-1 text-sm text-white/60">Available Balance</p>
        <p className="mb-4 text-3xl font-bold text-white md:text-4xl">
          {isLoading ? "—" : formatINR(balance)}
        </p>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => setShowTopup(true)}>
            <Plus className="h-4 w-4" /> Add Money
          </Button>
          <Button size="sm" variant="outline" onClick={() => setShowWithdraw(true)}>
            <ArrowUpRight className="h-4 w-4" /> Withdraw
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white">Auto Payment</h3>
          <button
            onClick={toggleAutoPay}
            aria-pressed={autoPay}
            className={cn(
              "relative h-7 w-12 rounded-full transition-colors touch-target",
              autoPay ? "bg-white" : "bg-white/20"
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 h-6 w-6 rounded-full transition-transform",
                autoPay ? "left-[22px] bg-black" : "left-0.5 bg-white"
              )}
            />
          </button>
        </div>
        <p className="text-xs text-white/50">Automatically pay for rides from your wallet</p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white">Recent Transactions</h3>
          {transactions.length > 0 && (
            <button
              onClick={() => router.push("/wallet/transactions")}
              className="flex items-center gap-1 text-xs text-white/50 hover:text-white transition-colors touch-target"
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
                  "flex h-10 w-10 items-center justify-center rounded-xl shrink-0",
                  txn.amount > 0 ? "bg-green-500/10" : "bg-white/5"
                )}>
                  {txn.amount > 0 ? (
                    <ArrowDownLeft className="h-5 w-5 text-green-400" />
                  ) : (
                    <ArrowUpRight className="h-5 w-5 text-white/60" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{txn.description}</p>
                  <p className="text-xs text-white/50">{new Date(txn.createdAt).toLocaleDateString()}</p>
                </div>
                <p className={cn(
                  "text-sm font-semibold shrink-0",
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
                  "rounded-xl border py-3.5 text-center text-sm font-semibold transition-all touch-target",
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
            <button
              onClick={() => setTopupMethod("upi")}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-xl border p-3.5 text-sm transition-colors touch-target",
                topupMethod === "upi"
                  ? "border-white bg-white/5 text-white"
                  : "border-white/10 bg-[#0a0a0a] text-white/60 hover:bg-white/5"
              )}
            >
              <Smartphone className="h-4 w-4" /> UPI
            </button>
            <button
              onClick={() => setTopupMethod("card")}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-xl border p-3.5 text-sm transition-colors touch-target",
                topupMethod === "card"
                  ? "border-white bg-white/5 text-white"
                  : "border-white/10 bg-[#0a0a0a] text-white/60 hover:bg-white/5"
              )}
            >
              <CreditCard className="h-4 w-4" /> Card
            </button>
          </div>
          <Button
            className="w-full"
            size="lg"
            onClick={() => topupMutation.mutate(selectedAmount)}
            disabled={topupMutation.isPending}
          >
            {topupMutation.isPending ? "Adding..." : `Add ${formatINR(selectedAmount)}`}
          </Button>
          {topupMutation.isError && (
            <p className="text-xs text-red-400">
              {(topupMutation.error as { response?: { data?: { message?: string } } })?.response?.data
                ?.message || "Top-up failed. Please try again."}
            </p>
          )}
        </div>
      </BottomSheet>

      <BottomSheet open={showWithdraw} onClose={() => setShowWithdraw(false)} title="Withdraw">
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-xs text-white/50">
              Available balance: {formatINR(balance)} · Minimum withdrawal ₹1,100
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[1100, 2000, 5000].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setWithdrawAmount(amount)}
                  className={cn(
                    "rounded-xl border py-3.5 text-center text-sm font-semibold transition-all touch-target",
                    withdrawAmount === amount
                      ? "border-white bg-white text-black"
                      : "border-white/10 bg-white/5 text-white hover:border-white/20"
                  )}
                >
                  {formatINR(amount)}
                </button>
              ))}
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3">
                <Banknote className="h-4 w-4 text-white/40" />
                <input
                  type="number"
                  min={1100}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(parseInt(e.target.value) || 0)}
                  className="w-full bg-transparent py-3.5 text-sm text-white focus:outline-none"
                />
              </div>
            </div>
          </div>
          <Button
            className="w-full"
            size="lg"
            onClick={() => withdrawMutation.mutate(withdrawAmount)}
            disabled={withdrawMutation.isPending || withdrawAmount < 1100}
          >
            {withdrawMutation.isPending ? "Withdrawing..." : `Withdraw ${formatINR(withdrawAmount)}`}
          </Button>
          {withdrawMutation.isError && <p className="text-xs text-red-400">{withdrawError}</p>}
        </div>
      </BottomSheet>
    </div>
  );
}
