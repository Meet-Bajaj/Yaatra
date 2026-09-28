import api from "@/lib/api";
import { API } from "@/lib/endpoints";

interface RawWalletTxn {
  txn_id?: string;
  id?: string;
  amount: number | string;
  type: string;
  reference_id?: string | null;
  created_at?: string;
  createdAt?: string;
}

export interface WalletTxn {
  id: string;
  type: string;
  /** Signed: positive credits, negative debits */
  amount: number;
  description: string;
  createdAt: string;
}

const TYPE_LABELS: Record<string, string> = {
  TOPUP: "Wallet top-up",
  DEBIT: "Ride payment",
  REFUND: "Refund",
  ADJUSTMENT: "Adjustment",
};

export function mapWalletTxn(raw: RawWalletTxn): WalletTxn {
  const value = Number(raw.amount) || 0;
  const isCredit = raw.type === "TOPUP" || raw.type === "REFUND";
  return {
    id: raw.txn_id || raw.id || `${raw.type}-${raw.created_at}-${value}`,
    type: raw.type,
    amount: isCredit ? Math.abs(value) : -Math.abs(value),
    description: TYPE_LABELS[raw.type] || raw.type,
    createdAt: raw.created_at || raw.createdAt || new Date().toISOString(),
  };
}

export async function fetchWalletTransactions(): Promise<WalletTxn[]> {
  try {
    const res = await api.get(API.wallet.transactions);
    const data = res.data;
    const raw: RawWalletTxn[] = Array.isArray(data) ? data : (data?.transactions ?? []);
    return raw.map(mapWalletTxn);
  } catch {
    return [];
  }
}
