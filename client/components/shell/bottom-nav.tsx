"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Car,
  Calendar,
  History,
  Wallet,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/ride-now", label: "Ride", icon: Car },
  { href: "/plan-commute", label: "Commute", icon: Calendar },
  { href: "/rides", label: "Rides", icon: History },
  { href: "/wallet", label: "Wallet", icon: Wallet },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-30 border-t border-white/10 bg-black/90 pb-safe backdrop-blur-xl">
      <div className="flex items-center justify-around px-2 py-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-xl px-3 py-2 text-[10px] font-medium transition-colors min-w-[52px]",
                active
                  ? "text-white"
                  : "text-white/40 active:text-white/60"
              )}
            >
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                  active ? "bg-white/15" : ""
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
