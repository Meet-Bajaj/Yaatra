"use client";

import Link from "next/link";
import {
  Car, Calendar, ArrowRight, Clock, MapPin, Wallet, Bell, Shield,
  Wifi, WifiOff, TrendingUp, Users, ArrowUpRight, Check, X, Loader2,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { API } from "@/lib/endpoints";
import { cn, formatINR } from "@/lib/utils";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const isDriver = user?.role === "DRIVER" || user?.role === "BOTH";
  const isRider = user?.role === "RIDER" || user?.role === "BOTH";
  const isAdmin = user?.role === "ADMIN";

  // ─── Driver Data ────────────────────────────────────────
  const { data: driverProfile } = useQuery({
    queryKey: ["driver-profile"],
    queryFn: async () => {
      try {
        const res = await api.get(API.driver.profile);
        return res.data as { isOnline?: boolean };
      } catch {
        return null;
      }
    },
    enabled: isDriver,
  });

  const { data: earnings } = useQuery({
    queryKey: ["driver-earnings"],
    queryFn: async () => {
      try {
        const res = await api.get(API.driver.earnings);
        return res.data as { total: number; today: number; todayRides: number };
      } catch {
        return null;
      }
    },
    enabled: isDriver,
  });

  const { data: requests = [] } = useQuery({
    queryKey: ["driver-requests"],
    queryFn: async () => {
      try {
        const res = await api.get(API.driver.requests);
        return Array.isArray(res.data) ? res.data : [];
      } catch {
        return [];
      }
    },
    enabled: isDriver,
  });

  const { data: vehicles = [] } = useQuery({
    queryKey: ["vehicles"],
    queryFn: async () => {
      try {
        const res = await api.get(API.users.vehicles);
        return Array.isArray(res.data) ? res.data : [];
      } catch {
        return [];
      }
    },
    enabled: isDriver,
  });

  const toggleOnlineMutation = useMutation({
    mutationFn: async (goOnline: boolean) => {
      if (!goOnline) {
        return api.post(API.driver.goOffline);
      }

      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error("Geolocation not supported"));
          return;
        }
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        });
      });

      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      const grid = Math.floor(lat * 10) + "" + Math.floor(lng * 10);
      const zone = `zone-${grid}`;
      const vehicleId = vehicles[0]?.id;

      return api.post(API.driver.goOnline, { lat, lng, zone, vehicleId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["driver-profile"] });
      queryClient.invalidateQueries({ queryKey: ["driver-earnings"] });
    },
  });

  const acceptMutation = useMutation({
    mutationFn: (id: string) => api.post(API.driver.acceptRequest(id)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["driver-requests"] }),
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => api.post(API.driver.rejectRequest(id)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["driver-requests"] }),
  });

  const isOnline = driverProfile?.isOnline ?? false;
  const pendingRequests = requests.slice(0, 3);

  return (
    <div className="animate-fade-in space-y-5 md:space-y-6">
      {/* ─── Greeting ──────────────────────────────────── */}
      <div>
        <h1 className="text-xl font-bold text-white md:text-2xl">
          Hello, {user?.name?.split(" ")[0] || "there"}
        </h1>
        <p className="text-sm text-white/60">
          {isDriver && isRider
            ? "Ready to ride or drive?"
            : isDriver
              ? "Ready to hit the road?"
              : "Where would you like to go today?"}
        </p>
      </div>

      {/* ─── Driver: Online Toggle + Earnings ──────────── */}
      {isDriver && (
        <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl",
                isOnline ? "bg-green-500/15" : "bg-white/5"
              )}>
                {isOnline ? (
                  <Wifi className="h-5 w-5 text-green-400" />
                ) : (
                  <WifiOff className="h-5 w-5 text-white/50" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  {isOnline ? "You're Online" : "You're Offline"}
                </p>
                <p className="text-xs text-white/50">
                  {isOnline ? "Receiving ride requests" : "Go online to start earning"}
                </p>
              </div>
            </div>
            {!isOnline && (
              <p className="text-[10px] text-white/30 mt-1 mb-1.5">Location required</p>
            )}
            <button
              onClick={() => toggleOnlineMutation.mutate(!isOnline)}
              disabled={toggleOnlineMutation.isPending}
              className={cn(
                "rounded-xl px-4 py-2 text-xs font-semibold transition-all touch-target",
                isOnline
                  ? "bg-red-500/15 text-red-400 hover:bg-red-500/25"
                  : "bg-white text-black hover:bg-white/90"
              )}
            >
              {toggleOnlineMutation.isPending ? "..." : isOnline ? "Go Offline" : "Go Online"}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 border-t border-white/5 pt-3">
            <div className="text-center">
              <p className="text-lg font-bold text-white">{earnings?.todayRides ?? 0}</p>
              <p className="text-[10px] text-white/50">Rides Today</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-white">{formatINR(earnings?.today ?? 0)}</p>
              <p className="text-[10px] text-white/50">Earned Today</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-white">{formatINR(earnings?.total ?? 0)}</p>
              <p className="text-[10px] text-white/50">Total Earnings</p>
            </div>
          </div>
        </div>
      )}

      {/* ─── Driver: Incoming Requests ──────────────────── */}
      {isDriver && pendingRequests.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">Incoming Requests</h3>
            <Link href="/driver/requests" className="text-xs text-white/50 hover:text-white">
              View all
            </Link>
          </div>
          <div className="space-y-2">
            {pendingRequests.map((req: { id: string; riderName: string; route: string; time: string }) => (
              <div key={req.id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0a0a0a] p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white shrink-0">
                  {req.riderName?.[0] || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{req.riderName}</p>
                  <p className="text-xs text-white/50 truncate">{req.route}</p>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button
                    onClick={() => rejectMutation.mutate(req.id)}
                    disabled={rejectMutation.isPending || acceptMutation.isPending}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-red-400/60 hover:bg-red-500/10 hover:text-red-400 transition-colors touch-target"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => acceptMutation.mutate(req.id)}
                    disabled={acceptMutation.isPending || rejectMutation.isPending}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors touch-target"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Rider: Quick Actions ───────────────────────── */}
      {isRider && (
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
          <Link
            href="/ride-now"
            className={cn(
              "group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-5 md:p-6",
              "transition-all duration-300 hover:border-white/20 hover:from-white/15 hover:to-white/8",
              "active:scale-[0.98] active:transition-transform active:duration-100"
            )}
          >
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white md:mb-4 md:h-12 md:w-12">
              <Car className="h-5 w-5 md:h-6 md:w-6 text-black" />
            </div>
            <h3 className="mb-1 text-base font-semibold text-white md:text-lg">Ride Now</h3>
            <p className="mb-3 text-xs text-white/60 md:mb-4 md:text-sm">Find and book an on-demand ride</p>
            <div className="flex items-center gap-1 text-sm font-medium text-white/70 group-hover:text-white transition-colors">
              Get started <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          <Link
            href="/plan-commute"
            className={cn(
              "group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-5 md:p-6",
              "transition-all duration-300 hover:border-white/20 hover:from-white/10 hover:to-white/5",
              "active:scale-[0.98] active:transition-transform active:duration-100"
            )}
          >
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 md:mb-4 md:h-12 md:w-12">
              <Calendar className="h-5 w-5 md:h-6 md:w-6 text-white" />
            </div>
            <h3 className="mb-1 text-base font-semibold text-white md:text-lg">Plan Commute</h3>
            <p className="mb-3 text-xs text-white/60 md:mb-4 md:text-sm">Set up a recurring carpool schedule</p>
            <div className="flex items-center gap-1 text-sm font-medium text-white/70 group-hover:text-white transition-colors">
              Get started <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        </div>
      )}

      {/* ─── Upcoming Ride (shared) ─────────────────────── */}
      <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
            <Clock className="h-5 w-5 text-white/60" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">No upcoming rides</p>
            <p className="text-xs text-white/50">
              {isDriver ? "Your next trip will appear here" : "Your next ride will appear here"}
            </p>
          </div>
        </div>
      </div>

      {/* ─── Quick Links (shared) ───────────────────────── */}
      <div className={cn("grid gap-2 sm:gap-3", isDriver ? "grid-cols-4" : "grid-cols-3")}>
        <Link
          href="/wallet"
          className="flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-[#0a0a0a] p-3 transition-colors hover:bg-white/5 active:bg-white/10 sm:p-4 touch-target"
        >
          <Wallet className="h-5 w-5 text-white/60" />
          <span className="text-xs font-medium text-white/60">Wallet</span>
        </Link>
        <Link
          href="/notifications"
          className="flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-[#0a0a0a] p-3 transition-colors hover:bg-white/5 active:bg-white/10 sm:p-4 touch-target"
        >
          <Bell className="h-5 w-5 text-white/60" />
          <span className="text-xs font-medium text-white/60">Alerts</span>
        </Link>
        <Link
          href="/safety"
          className="flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-[#0a0a0a] p-3 transition-colors hover:bg-white/5 active:bg-white/10 sm:p-4 touch-target"
        >
          <Shield className="h-5 w-5 text-white/60" />
          <span className="text-xs font-medium text-white/60">Safety</span>
        </Link>
        {isDriver && (
          <Link
            href="/driver/earnings"
            className="flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-[#0a0a0a] p-3 transition-colors hover:bg-white/5 active:bg-white/10 sm:p-4 touch-target"
          >
            <TrendingUp className="h-5 w-5 text-white/60" />
            <span className="text-xs font-medium text-white/60">Earnings</span>
          </Link>
        )}
      </div>

      {/* ─── City (shared) ──────────────────────────────── */}
      <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-4">
        <div className="flex items-center gap-3">
          <MapPin className="h-4 w-4 text-white/50" />
          <p className="text-sm text-white/60">
            {user?.city || "Set your city for better results"}
          </p>
        </div>
      </div>
    </div>
  );
}
