"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Car,
  Calendar,
  History,
  Wallet,
  Bell,
  Shield,
  User,
  LogOut,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/ride-now", label: "Ride Now", icon: Car },
  { href: "/plan-commute", label: "Plan Commute", icon: Calendar },
  { href: "/rides", label: "My Rides", icon: History },
  { href: "/wallet", label: "Wallet", icon: Wallet },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/safety", label: "Safety", icon: Shield },
  { href: "/profile", label: "Profile", icon: User },
];

const driverItems = [
  { href: "/driver/offer-seat", label: "Offer a Seat", icon: Car },
  { href: "/driver/offers", label: "My Offers", icon: History },
  { href: "/driver/requests", label: "Requests", icon: Bell },
  { href: "/driver/online", label: "Go Online", icon: LayoutDashboard },
  { href: "/driver/earnings", label: "Earnings", icon: Wallet },
  { href: "/driver/vehicles", label: "Vehicles", icon: Car },
];

const adminItems = [
  { href: "/admin", label: "Admin Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: User },
  { href: "/admin/verification", label: "Verification", icon: Shield },
  { href: "/admin/disputes", label: "Disputes", icon: Bell },
];

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const isDriver = user?.role === "DRIVER" || user?.role === "BOTH";
  const isAdmin = user?.role === "ADMIN";

  return (
    <aside className="flex h-full w-64 flex-col border-r border-white/5 bg-[#050505]">
      <div className="flex h-14 items-center justify-between border-b border-white/5 px-4">
        <Link href="/dashboard" className="text-lg font-bold tracking-tight text-white">
          Yaatra
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/50 hover:bg-white/10 hover:text-white transition-colors md:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-3">
        <div className="px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors mb-0.5 touch-target",
                  active
                    ? "bg-white/10 text-white"
                    : "text-white/50 hover:bg-white/5 hover:text-white/80"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {isDriver && (
          <div className="mt-4 px-3">
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-white/30">
              Driver
            </p>
            {driverItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors mb-0.5 touch-target",
                    active
                      ? "bg-white/10 text-white"
                      : "text-white/50 hover:bg-white/5 hover:text-white/80"
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}

        {isAdmin && (
          <div className="mt-4 px-3">
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-white/30">
              Admin
            </p>
            {adminItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors mb-0.5 touch-target",
                    active
                      ? "bg-white/10 text-white"
                      : "text-white/50 hover:bg-white/5 hover:text-white/80"
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      <div className="border-t border-white/5 p-3">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/50 hover:bg-white/5 hover:text-white/80 transition-colors touch-target"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
