"use client";

import { Bell, Menu, Search } from "lucide-react";
import Link from "next/link";
import { useNotificationStore } from "@/stores/notificationStore";
import { useAuthStore } from "@/stores/authStore";
import { getInitials } from "@/lib/utils";

interface TopbarProps {
  onMenuToggle?: () => void;
}

export function Topbar({ onMenuToggle }: TopbarProps) {
  const { user } = useAuthStore();
  const { unreadCount } = useNotificationStore();

  return (
    <header className="flex h-14 items-center justify-between border-b border-white/5 bg-[#050505]/80 px-4 backdrop-blur-xl md:px-6">
      <div className="flex items-center gap-3">
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-white/50 hover:bg-white/10 hover:text-white transition-colors md:hidden touch-target"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Search..."
            className="h-10 w-64 rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 text-sm text-white placeholder:text-white/40 focus:border-white/20 focus:outline-none touch-target"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href="/notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl text-white/50 hover:bg-white/10 hover:text-white transition-colors touch-target"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold text-black">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Link>

        <Link
          href="/profile"
          className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-white/5 transition-colors touch-target"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white">
            {user?.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              getInitials(user?.name || "U")
            )}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-white leading-none">{user?.name}</p>
            <p className="text-[10px] text-white/50 capitalize">{user?.role?.toLowerCase()}</p>
          </div>
        </Link>
      </div>
    </header>
  );
}
