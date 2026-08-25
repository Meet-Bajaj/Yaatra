"use client";

import { RequireDriver } from "@/components/auth/require-driver";

export default function DriverLayout({ children }: { children: React.ReactNode }) {
  return <RequireDriver>{children}</RequireDriver>;
}
