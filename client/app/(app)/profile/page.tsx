"use client";

import { User, MapPin, ChevronRight, LogOut, Camera } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { getInitials } from "@/lib/utils";

export default function ProfilePage() {
  const { user, logout } = useAuthStore();

  return (
    <div className="animate-fade-in space-y-6">
      <h1 className="text-2xl font-bold text-white">Profile</h1>

      <div className="flex flex-col items-center rounded-2xl border border-white/10 bg-[#0a0a0a] p-6">
        <div className="relative mb-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10 text-2xl font-bold text-white">
            {user?.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.avatarUrl} alt={user.name} className="h-20 w-20 rounded-full object-cover" />
            ) : (
              getInitials(user?.name || "U")
            )}
          </div>
          <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-white text-black hover:bg-white/90 transition-colors">
            <Camera className="h-4 w-4" />
          </button>
        </div>
        <h2 className="text-lg font-semibold text-white">{user?.name}</h2>
        <p className="text-sm text-white/50">{user?.phone}</p>
        <p className="text-xs text-white/30 capitalize mt-1">{user?.role?.toLowerCase()}</p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0a0a0a] p-3">
          <User className="h-5 w-5 text-white/30" />
          <div className="flex-1">
            <p className="text-xs text-white/40">Name</p>
            <p className="text-sm text-white">{user?.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0a0a0a] p-3">
          <MapPin className="h-5 w-5 text-white/30" />
          <div className="flex-1">
            <p className="text-xs text-white/40">City</p>
            <p className="text-sm text-white">{user?.city || "Not set"}</p>
          </div>
        </div>
      </div>

      <button className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-[#0a0a0a] p-3 text-left text-sm text-white/60 hover:bg-white/5 transition-colors">
        Saved Places <ChevronRight className="ml-auto h-4 w-4" />
      </button>

      <button
        onClick={logout}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
      >
        <LogOut className="h-4 w-4" /> Sign Out
      </button>
    </div>
  );
}
