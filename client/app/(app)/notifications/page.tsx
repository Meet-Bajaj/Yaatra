"use client";

import { useRef, useEffect } from "react";
import { Bell, CheckCheck, Car, AlertCircle, Tag, Clock } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { useNotificationStore } from "@/stores/notificationStore";
import { EmptyState } from "@/components/ui/empty-state";

interface Notification {
  id: string;
  type: string;
  payload: Record<string, unknown>;
  readAt: string | null;
  createdAt: string;
}

const typeConfig: Record<string, { icon: typeof Car; title: string }> = {
  booking: { icon: Car, title: "Booking" },
  reminder: { icon: Clock, title: "Reminder" },
  cancel: { icon: AlertCircle, title: "Cancelled" },
  promo: { icon: Tag, title: "Promo" },
};

function formatTimeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay === 1) return "1d ago";
  return `${diffDay}d ago`;
}

export default function NotificationsPage() {
  const queryClient = useQueryClient();
  const setUnreadCount = useNotificationStore((s) => s.setUnreadCount);
  const lastCountRef = useRef<number>(-1);

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      try {
        const res = await api.get("/notifications");
        return (res.data || []) as Notification[];
      } catch {
        return [];
      }
    },
  });

  useEffect(() => {
    const unread = notifications.filter((n) => !n.readAt).length;
    if (unread !== lastCountRef.current) {
      lastCountRef.current = unread;
      setUnreadCount(unread);
    }
  }, [notifications, setUnreadCount]);

  const markAllMutation = useMutation({
    mutationFn: async () => {
      const unread = notifications.filter((n) => !n.readAt);
      await Promise.all(
        unread.map((n) => api.patch(`/notifications/${n.id}/read`))
      );
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const markAllRead = () => {
    const unread = notifications.filter((n) => !n.readAt);
    if (unread.length === 0) return;
    markAllMutation.mutate();
  };

  return (
    <div className="animate-fade-in space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white md:text-2xl">Notifications</h1>
        {notifications.some((n) => !n.readAt) && (
          <button onClick={markAllRead} className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors touch-target">
            <CheckCheck className="h-4 w-4" /> Mark all read
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-white/5" />
          ))}
        </div>
      ) : notifications.length > 0 ? (
        <div className="space-y-2">
          {notifications.map((notification) => {
            const config = typeConfig[notification.type] || { icon: Bell, title: notification.type };
            const Icon = config.icon;
            const payload = notification.payload as { title?: string; message?: string };
            return (
              <div
                key={notification.id}
                className={cn(
                  "flex gap-3 rounded-xl border p-3 transition-all",
                  notification.readAt
                    ? "border-white/5 bg-[#050505]"
                    : "border-white/10 bg-[#0a0a0a]"
                )}
              >
                <div className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                  notification.readAt ? "bg-white/5" : "bg-white/10"
                )}>
                  <Icon className="h-5 w-5 text-white/60" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={cn("text-sm font-medium", notification.readAt ? "text-white/60" : "text-white")}>
                      {payload.title || config.title}
                    </p>
                    {!notification.readAt && (
                      <div className="h-1.5 w-1.5 rounded-full bg-white shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-white/50 line-clamp-2">{payload.message || ""}</p>
                  <p className="mt-1 text-[10px] text-white/40">{formatTimeAgo(notification.createdAt)}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState icon={<Bell className="h-12 w-12" />} title="No notifications yet" />
      )}
    </div>
  );
}
