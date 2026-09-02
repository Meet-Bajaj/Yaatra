"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const hasHydrated = useAuthStore((s) => s._hasHydrated);

  useEffect(() => {
    if (hasHydrated && token) {
      router.replace("/dashboard");
    }
  }, [hasHydrated, token, router]);

  if (hasHydrated && token) return null;

  return (
    <div className="flex min-h-dvh items-center justify-center bg-black px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white">Yaatra</h1>
          <p className="mt-2 text-sm text-white/60">Smart rides, shared smarter</p>
        </div>
        {children}
      </div>
    </div>
  );
}
