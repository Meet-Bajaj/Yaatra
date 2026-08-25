"use client";

import { useState } from "react";
import { Bell, CheckCheck, Car, AlertCircle, Tag, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const notifications = [
  { id: "1", type: "booking", title: "Ride Confirmed", message: "Your ride with Arjun K. is confirmed for tomorrow 9 AM", time: "2h ago", read: false },
  { id: "2", type: "reminder", title: "Commute Reminder", message: "Your carpool departs in 30 minutes", time: "5h ago", read: false },
  { id: "3", type: "cancel", title: "Ride Cancelled", message: "Ride with Priya M. has been cancelled", time: "1d ago", read: true },
  { id: "4", type: "promo", title: "Weekend Offer", message: "Get 20% off on your next ride this weekend", time: "2d ago", read: true },
];

const typeIcons = {
  booking: Car,
  reminder: Clock,
  cancel: AlertCircle,
  promo: Tag,
};

export default function NotificationsPage() {
  const [items, setItems] = useState(notifications);

  const markAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Notifications</h1>
        <button onClick={markAllRead} className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors">
          <CheckCheck className="h-4 w-4" /> Mark all read
        </button>
      </div>

      <div className="space-y-2">
        {items.map((notification) => {
          const Icon = typeIcons[notification.type as keyof typeof typeIcons] || Bell;
          return (
            <div
              key={notification.id}
              className={cn(
                "flex gap-3 rounded-xl border p-3 transition-all",
                notification.read
                  ? "border-white/5 bg-[#050505]"
                  : "border-white/10 bg-[#0a0a0a]"
              )}
            >
              <div className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                notification.read ? "bg-white/5" : "bg-white/10"
              )}>
                <Icon className="h-5 w-5 text-white/50" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={cn("text-sm font-medium", notification.read ? "text-white/70" : "text-white")}>
                    {notification.title}
                  </p>
                  {!notification.read && (
                    <div className="h-1.5 w-1.5 rounded-full bg-white" />
                  )}
                </div>
                <p className="text-xs text-white/40 line-clamp-2">{notification.message}</p>
                <p className="mt-1 text-[10px] text-white/30">{notification.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
