"use client";

import { useState } from "react";
import { Search, ChevronRight, Loader2, Filter, X, LayoutList, LayoutGrid } from "lucide-react";
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

type ViewMode = "list" | "grid-2" | "grid-3" | "grid-5";

const PAGE_SIZE = 20;

const roleOptions = ["RIDER", "DRIVER", "BOTH", "ADMIN"] as const;
const statusOptions = ["ACTIVE", "SUSPENDED", "PENDING"] as const;

const viewOptions: { value: ViewMode; label: string; cols: number }[] = [
  { value: "list", label: "List", cols: 0 },
  { value: "grid-2", label: "2", cols: 2 },
  { value: "grid-3", label: "3", cols: 3 },
  { value: "grid-5", label: "5", cols: 5 },
];

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(0);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const skip = page * PAGE_SIZE;

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users", search, roleFilter, statusFilter, skip],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (roleFilter) params.set("role", roleFilter);
        if (statusFilter) params.set("status", statusFilter);
        params.set("skip", String(skip));
        params.set("take", String(PAGE_SIZE));
        const res = await api.get(`${API.admin.users}?${params.toString()}`);
        const raw = res.data;
        const list = Array.isArray(raw) ? raw : raw?.users ?? [];
        const total = raw?.total ?? list.length;
        return { users: list as AdminUser[], total };
      } catch {
        return { users: [] as AdminUser[], total: 0 };
      }
    },
  });

  const users = data?.users ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const hasNext = skip + PAGE_SIZE < total;
  const hasPrev = page > 0;

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch(API.admin.updateUserStatus(id), { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setSelectedUser(null);
    },
  });

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(0);
  };

  const handleRoleFilter = (role: string) => {
    setRoleFilter(role === roleFilter ? "" : role);
    setPage(0);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status === statusFilter ? "" : status);
    setPage(0);
  };

  const clearFilters = () => {
    setSearch("");
    setRoleFilter("");
    setStatusFilter("");
    setPage(0);
  };

  const hasActiveFilters = roleFilter || statusFilter;

  return (
    <div className="animate-fade-in space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white md:text-2xl">Users</h1>
        <span className="text-xs text-white/40">{total} total</span>
      </div>

      {/* ─── Search ──────────────────────────────────── */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
        <input
          type="text"
          placeholder="Search by name, phone, or email..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="h-12 w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 text-sm text-white placeholder:text-white/40 focus:border-white/20 focus:outline-none touch-target md:h-11"
        />
      </div>

      {/* ─── Filter Bar ──────────────────────────────── */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition-all touch-target",
              showFilters || hasActiveFilters
                ? "border-white/20 bg-white/10 text-white"
                : "border-white/10 bg-white/5 text-white/50 hover:text-white/70"
            )}
          >
            <Filter className="h-3.5 w-3.5" />
            Filters
            {hasActiveFilters && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-[9px] font-bold text-black">
                {[roleFilter, statusFilter].filter(Boolean).length}
              </span>
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/50 hover:text-white transition-colors touch-target"
            >
              <X className="h-3 w-3" />
              Clear
            </button>
          )}

          {/* Active filter chips */}
          {roleFilter && (
            <span className="flex items-center gap-1 rounded-lg bg-white/10 px-2 py-1 text-[10px] text-white">
              {roleFilter}
              <button onClick={() => setRoleFilter("")} className="ml-0.5 hover:text-white/60">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {statusFilter && (
            <span className="flex items-center gap-1 rounded-lg bg-white/10 px-2 py-1 text-[10px] text-white">
              {statusFilter}
              <button onClick={() => setStatusFilter("")} className="ml-0.5 hover:text-white/60">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>

        {/* ─── View Toggle ───────────────────────────── */}
        <div className="flex items-center gap-0.5 rounded-lg border border-white/10 bg-white/5 p-0.5">
          {viewOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setViewMode(opt.value)}
              title={opt.value === "list" ? "List view" : `${opt.cols} column grid`}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-md text-xs font-medium transition-all touch-target",
                viewMode === opt.value
                  ? "bg-white text-black"
                  : "text-white/40 hover:text-white/70"
              )}
            >
              {opt.value === "list" ? (
                <LayoutList className="h-3.5 w-3.5" />
              ) : (
                <LayoutGrid className="h-3.5 w-3.5" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Filter Panel ─────────────────────────────── */}
      {showFilters && (
        <div className="rounded-xl border border-white/10 bg-[#0a0a0a] p-4 space-y-3">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/50">Role</p>
            <div className="flex flex-wrap gap-2">
              {roleOptions.map((role) => (
                <button
                  key={role}
                  onClick={() => handleRoleFilter(role)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-medium transition-all touch-target",
                    roleFilter === role
                      ? "bg-white text-black"
                      : "border border-white/10 bg-white/5 text-white/50 hover:border-white/20"
                  )}
                >
                  {role.charAt(0) + role.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/50">Status</p>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusFilter(status)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-medium transition-all touch-target",
                    statusFilter === status
                      ? "bg-white text-black"
                      : "border border-white/10 bg-white/5 text-white/50 hover:border-white/20"
                  )}
                >
                  {status.charAt(0) + status.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── User List / Grid ─────────────────────────── */}
      {isLoading ? (
        <div className={cn(
          viewMode === "list" ? "space-y-2" : "grid gap-3",
          viewMode === "grid-2" && "grid-cols-2",
          viewMode === "grid-3" && "grid-cols-3",
          viewMode === "grid-5" && "grid-cols-5",
        )}>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={cn("animate-pulse rounded-xl bg-white/5", viewMode === "list" ? "h-16" : "h-32")} />
          ))}
        </div>
      ) : users.length > 0 ? (
        <>
          {viewMode === "list" ? (
            /* ─── List View ──────────────────────────── */
            <div className="space-y-2">
              {users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-[#0a0a0a] p-3 text-left hover:bg-white/5 active:bg-white/10 transition-colors touch-target"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white shrink-0">
                    {user.name?.[0] || "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{user.name}</p>
                    <p className="text-xs text-white/50 truncate">
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
                    <p className="mt-1 text-[10px] text-white/40">{user.role}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-white/30 shrink-0" />
                </button>
              ))}
            </div>
          ) : (
            /* ─── Grid View ──────────────────────────── */
            <div className={cn(
              "grid gap-3",
              viewMode === "grid-2" && "grid-cols-2",
              viewMode === "grid-3" && "grid-cols-3",
              viewMode === "grid-5" && "grid-cols-5",
            )}>
              {users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className={cn(
                    "flex flex-col items-center rounded-xl border border-white/10 bg-[#0a0a0a] p-3 text-center hover:bg-white/5 active:bg-white/10 transition-colors touch-target",
                    viewMode === "grid-5" ? "gap-1.5 p-2" : "gap-2 p-3"
                  )}
                >
                  <div className={cn(
                    "flex items-center justify-center rounded-full bg-white/10 font-bold text-white",
                    viewMode === "grid-5" ? "h-10 w-10 text-xs" : "h-12 w-12 text-sm"
                  )}>
                    {user.name?.[0] || "?"}
                  </div>
                  <div className="min-w-0 w-full">
                    <p className={cn(
                      "font-medium text-white truncate",
                      viewMode === "grid-5" ? "text-[10px]" : "text-xs"
                    )}>{user.name}</p>
                    <p className={cn(
                      "text-white/50 truncate",
                      viewMode === "grid-5" ? "text-[9px]" : "text-[10px]"
                    )}>
                      {viewMode === "grid-3" || viewMode === "grid-5" ? user.phone : user.phone.slice(0, 5) + "..."}
                    </p>
                  </div>
                  <span className={cn(
                    "rounded-full px-1.5 py-0.5 font-semibold",
                    user.status === "ACTIVE" ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400",
                    viewMode === "grid-5" ? "text-[8px]" : "text-[9px]"
                  )}>
                    {user.status}
                  </span>
                  {viewMode !== "grid-5" && (
                    <p className="text-[9px] text-white/40">{user.role}</p>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* ─── Pagination ──────────────────────────── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={!hasPrev}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white/60 hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed touch-target"
              >
                Previous
              </button>
              <span className="text-xs text-white/40">
                Page {page + 1} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!hasNext}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white/60 hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed touch-target"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <EmptyState title="No users found" />
      )}

      {/* ─── User Detail Sheet ────────────────────────── */}
      <BottomSheet
        open={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        title="User Details"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-xl font-bold text-white shrink-0">
                {selectedUser.name?.[0] || "?"}
              </div>
              <div className="min-w-0">
                <p className="text-lg font-semibold text-white">{selectedUser.name}</p>
                <p className="text-sm text-white/60">{selectedUser.phone}</p>
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
      <span className="text-xs text-white/50">{label}</span>
      <span className="text-sm text-white">{value}</span>
    </div>
  );
}
