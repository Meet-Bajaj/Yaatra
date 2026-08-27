"use client";

import { useState } from "react";
import { Search, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { API } from "@/lib/endpoints";
import { cn } from "@/lib/utils";

interface AdminUser {
  id: string;
  name: string;
  phone: string;
  role: string;
  status: string;
  city?: string;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin-users", search],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        const res = await api.get(`${API.admin.users}?${params.toString()}`);
        return (Array.isArray(res.data) ? res.data : []) as AdminUser[];
      } catch {
        return [];
      }
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch(API.admin.updateUserStatus(id), { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-users"] }),
  });

  return (
    <div className="animate-fade-in space-y-6">
      <h1 className="text-2xl font-bold text-white">Users</h1>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-11 w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:border-white/20 focus:outline-none"
        />
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-white/5" />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {users.map((user) => (
            <div key={user.id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0a0a0a] p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white">
                {user.name?.[0] || "?"}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{user.name}</p>
                <p className="text-xs text-white/40">{user.phone}{user.city ? ` - ${user.city}` : ""}</p>
              </div>
              <div className="text-right">
                <span className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                  user.status === "ACTIVE" ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400"
                )}>
                  {user.status}
                </span>
                <p className="mt-1 text-[10px] text-white/30">{user.role}</p>
              </div>
              {user.status === "ACTIVE" && (
                <button
                  onClick={() => statusMutation.mutate({ id: user.id, status: "SUSPENDED" })}
                  className="text-[10px] text-red-400 hover:text-red-300"
                >
                  Suspend
                </button>
              )}
              {user.status === "SUSPENDED" && (
                <button
                  onClick={() => statusMutation.mutate({ id: user.id, status: "ACTIVE" })}
                  className="text-[10px] text-green-400 hover:text-green-300"
                >
                  Activate
                </button>
              )}
            </div>
          ))}
          {users.length === 0 && (
            <p className="py-12 text-center text-sm text-white/40">No users found</p>
          )}
        </div>
      )}
    </div>
  );
}
