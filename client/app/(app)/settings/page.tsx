"use client";

import { Globe, Bell, CreditCard, Ban, Info, ChevronRight, Shield, User, LogOut } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useState } from "react";

export default function SettingsPage() {
  const { user, updateUser, logout } = useAuthStore();
  const queryClient = useQueryClient();
  const [showRoleSwitch, setShowRoleSwitch] = useState(false);

  const roleMutation = useMutation({
    mutationFn: (role: string) => api.post("/users/me/role", { role }),
    onSuccess: (res) => {
      updateUser(res.data);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setShowRoleSwitch(false);
    },
  });

  const roles = ["RIDER", "DRIVER", "BOTH"];

  return (
    <div className="animate-fade-in space-y-6">
      <h1 className="text-2xl font-bold text-white">Settings</h1>

      <div className="space-y-2">
        <Link
          href="/safety"
          className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-[#0a0a0a] p-3 text-left hover:bg-white/5 transition-colors"
        >
          <Shield className="h-5 w-5 text-white/30" />
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Safety & Emergency</p>
            <p className="text-xs text-white/40">Emergency contacts, SOS, report issues</p>
          </div>
          <ChevronRight className="h-4 w-4 text-white/30" />
        </Link>

        <button
          onClick={() => setShowRoleSwitch(!showRoleSwitch)}
          className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-[#0a0a0a] p-3 text-left hover:bg-white/5 transition-colors"
        >
          <User className="h-5 w-5 text-white/30" />
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Switch Role</p>
            <p className="text-xs text-white/40">Currently: {user?.role?.toLowerCase()}</p>
          </div>
          <ChevronRight className="h-4 w-4 text-white/30" />
        </button>

        {showRoleSwitch && (
          <div className="ml-8 space-y-1">
            {roles.map((role) => (
              <button
                key={role}
                onClick={() => roleMutation.mutate(role)}
                disabled={roleMutation.isPending || user?.role === role}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  user?.role === role
                    ? "bg-white/10 text-white font-medium"
                    : "text-white/50 hover:bg-white/5 hover:text-white/80"
                } disabled:opacity-50`}
              >
                {role.charAt(0) + role.slice(1).toLowerCase()}
                {user?.role === role && " (current)"}
              </button>
            ))}
          </div>
        )}

        <Link
          href="/wallet"
          className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-[#0a0a0a] p-3 text-left hover:bg-white/5 transition-colors"
        >
          <CreditCard className="h-5 w-5 text-white/30" />
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Payment Methods</p>
            <p className="text-xs text-white/40">Manage UPI, cards, and wallet</p>
          </div>
          <ChevronRight className="h-4 w-4 text-white/30" />
        </Link>

        <button className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-[#0a0a0a] p-3 text-left hover:bg-white/5 transition-colors">
          <Globe className="h-5 w-5 text-white/30" />
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Language</p>
            <p className="text-xs text-white/40">English</p>
          </div>
          <ChevronRight className="h-4 w-4 text-white/30" />
        </button>

        <button className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-[#0a0a0a] p-3 text-left hover:bg-white/5 transition-colors">
          <Bell className="h-5 w-5 text-white/30" />
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Notification Preferences</p>
            <p className="text-xs text-white/40">Manage push and in-app notifications</p>
          </div>
          <ChevronRight className="h-4 w-4 text-white/30" />
        </button>

        <button className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-[#0a0a0a] p-3 text-left hover:bg-white/5 transition-colors">
          <Ban className="h-5 w-5 text-white/30" />
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Blocked Users</p>
            <p className="text-xs text-white/40">Manage your blocked list</p>
          </div>
          <ChevronRight className="h-4 w-4 text-white/30" />
        </button>

        <button className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-[#0a0a0a] p-3 text-left hover:bg-white/5 transition-colors">
          <Info className="h-5 w-5 text-white/30" />
          <div className="flex-1">
            <p className="text-sm font-medium text-white">About & Legal</p>
            <p className="text-xs text-white/40">Terms, privacy policy, version info</p>
          </div>
          <ChevronRight className="h-4 w-4 text-white/30" />
        </button>
      </div>

      <button
        onClick={logout}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
      >
        <LogOut className="h-4 w-4" /> Sign Out
      </button>
    </div>
  );
}
