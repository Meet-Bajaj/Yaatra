"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

export function RequireDriver({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const hasHydrated = useAuthStore((s) => s._hasHydrated);

  useEffect(() => {
    if (hasHydrated) {
      if (!token) router.replace("/login");
      else if (user?.role !== "DRIVER" && user?.role !== "BOTH") router.replace("/dashboard");
    }
  }, [hasHydrated, token, user, router]);

  if (!hasHydrated) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      </div>
    );
  }

  if (!token || (user?.role !== "DRIVER" && user?.role !== "BOTH")) return null;

  return <>{children}</>;
}
