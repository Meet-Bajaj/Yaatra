"use client";

import { useState } from "react";
import { Search, ChevronRight, X, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { API } from "@/lib/endpoints";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { EmptyState } from "@/components/ui/empty-state";

interface AdminUser {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: string;
  status: string;
  city?: string;
  gender?: string;
  createdAt?: string;
  driverProfile?: {
    verificationStatus?: string;
    totalRating?: string;
    ratingCount?: number;
  } | null;
}

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin-users", search],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        const res = await api.get(`${API.admin.users}?${params.toString()}`);
        const data = res.data;
        const list = Array.isArray(data) ? data : data?.users ?? [];
        return list as AdminUser[];
      } catch {
        return [];
      }
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch(API.admin.updateUserStatus(id), { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setSelectedUser(null);
    },
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
      ) : users.length > 0 ? (
        <div className="space-y-2">
          {users.map((user) => (
            <button
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-[#0a0a0a] p-3 text-left hover:bg-white/5 transition-colors"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white">
                {user.name?.[0] || "?"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user.name}</p>
                <p className="text-xs text-white/40 truncate">
                  {user.phone}{user.city ? ` · ${user.city}` : ""}
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                  user.status === "ACTIVE" ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400"
                )}>
                  {user.status}
                </span>
                <p className="mt-1 text-[10px] text-white/30">{user.role}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-white/20 shrink-0" />
            </button>
          ))}
        </div>
      ) : (
        <EmptyState title="No users found" />
      )}

      {/* User Detail Bottom Sheet */}
      <BottomSheet
        open={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        title="User Details"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-xl font-bold text-white">
                {selectedUser.name?.[0] || "?"}
              </div>
              <div>
                <p className="text-lg font-semibold text-white">{selectedUser.name}</p>
                <p className="text-sm text-white/50">{selectedUser.phone}</p>
              </div>
            </div>

            <div className="space-y-2 rounded-xl border border-white/10 bg-white/5 p-3">
              <DetailRow label="Email" value={selectedUser.email || "—"} />
              <DetailRow label="Role" value={selectedUser.role} />
              <DetailRow label="Status" value={selectedUser.status} />
              <DetailRow label="City" value={selectedUser.city || "—"} />
              <DetailRow label="Gender" value={selectedUser.gender || "—"} />
              <DetailRow
                label="Joined"
                value={selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : "—"}
              />
              {selectedUser.driverProfile && (
                <>
                  <DetailRow label="Driver Verification" value={selectedUser.driverProfile.verificationStatus || "—"} />
                  <DetailRow label="Rating" value={`${selectedUser.driverProfile.totalRating || "0"} (${selectedUser.driverProfile.ratingCount || 0} trips)`} />
                </>
              )}
            </div>

            <div className="flex gap-2">
              {selectedUser.status === "ACTIVE" ? (
                <Button
                  variant="outline"
                  className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10"
                  onClick={() => statusMutation.mutate({ id: selectedUser.id, status: "SUSPENDED" })}
                  disabled={statusMutation.isPending}
                >
                  {statusMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Suspend User"}
                </Button>
              ) : (
                <Button
                  className="flex-1"
                  onClick={() => statusMutation.mutate({ id: selectedUser.id, status: "ACTIVE" })}
                  disabled={statusMutation.isPending}
                >
                  {statusMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Activate User"}
                </Button>
              )}
            </div>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-white/40">{label}</span>
      <span className="text-sm text-white">{value}</span>
    </div>
  );
}
