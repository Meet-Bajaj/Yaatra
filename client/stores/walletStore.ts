"use client";

import { create } from "zustand";

interface WalletState {
  balance: number;
  recentTransactions: WalletTransaction[];
  setBalance: (balance: number) => void;
  setTransactions: (transactions: WalletTransaction[]) => void;
  deductBalance: (amount: number) => void;
}

interface WalletTransaction {
  id: string;
  amount: number;
  type: string;
  referenceId?: string;
  createdAt: string;
}

export const useWalletStore = create<WalletState>((set) => ({
  balance: 0,
  recentTransactions: [],
  setBalance: (balance) => set({ balance }),
  setTransactions: (transactions) => set({ recentTransactions: transactions }),
  deductBalance: (amount) =>
    set((state) => ({ balance: state.balance - amount })),
}));
