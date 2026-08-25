"use client";

import Link from "next/link";
import { Car, Calendar, ArrowRight, Clock, MapPin, Wallet, Bell, Shield } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const { user } = useAuthStore();

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">
          Hello, {user?.name?.split(" ")[0] || "there"}
        </h1>
        <p className="text-sm text-white/50">Where would you like to go today?</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/ride-now"
          className={cn(
            "group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-6",
            "transition-all duration-300 hover:border-white/20 hover:from-white/15 hover:to-white/8"
          )}
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-black">
            <Car className="h-6 w-6" />
          </div>
          <h3 className="mb-1 text-lg font-semibold text-white">Ride Now</h3>
          <p className="mb-4 text-sm text-white/50">Find and book an on-demand ride</p>
          <div className="flex items-center gap-1 text-sm font-medium text-white/70 group-hover:text-white transition-colors">
            Get started <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

        <Link
          href="/plan-commute"
          className={cn(
            "group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6",
            "transition-all duration-300 hover:border-white/20 hover:from-white/10 hover:to-white/5"
          )}
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-white">
            <Calendar className="h-6 w-6" />
          </div>
          <h3 className="mb-1 text-lg font-semibold text-white">Plan Commute</h3>
          <p className="mb-4 text-sm text-white/50">Set up a recurring carpool schedule</p>
          <div className="flex items-center gap-1 text-sm font-medium text-white/70 group-hover:text-white transition-colors">
            Get started <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
            <Clock className="h-5 w-5 text-white/50" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">No upcoming rides</p>
            <p className="text-xs text-white/40">Your next ride will appear here</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Link
          href="/wallet"
          className="flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-[#0a0a0a] p-4 transition-colors hover:bg-white/5"
        >
          <Wallet className="h-5 w-5 text-white/50" />
          <span className="text-xs font-medium text-white/60">Wallet</span>
        </Link>
        <Link
          href="/notifications"
          className="flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-[#0a0a0a] p-4 transition-colors hover:bg-white/5"
        >
          <Bell className="h-5 w-5 text-white/50" />
          <span className="text-xs font-medium text-white/60">Alerts</span>
        </Link>
        <Link
          href="/safety"
          className="flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-[#0a0a0a] p-4 transition-colors hover:bg-white/5"
        >
          <Shield className="h-5 w-5 text-white/50" />
          <span className="text-xs font-medium text-white/60">Safety</span>
        </Link>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-4">
        <div className="flex items-center gap-3">
          <MapPin className="h-4 w-4 text-white/30" />
          <p className="text-sm text-white/50">
            {user?.city || "Set your city for better results"}
          </p>
        </div>
      </div>
    </div>
  );
}
