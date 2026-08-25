"use client";

import { Globe, Bell, CreditCard, Ban, Info, ChevronRight } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="animate-fade-in space-y-6">
      <h1 className="text-2xl font-bold text-white">Settings</h1>

      <div className="space-y-2">
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
          <CreditCard className="h-5 w-5 text-white/30" />
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Payment Methods</p>
            <p className="text-xs text-white/40">Manage UPI, cards, and wallet</p>
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
    </div>
  );
}
