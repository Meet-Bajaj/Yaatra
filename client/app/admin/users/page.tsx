"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

const users = [
  { id: "1", name: "Arjun Kumar", phone: "+91 98765 43210", role: "DRIVER", status: "ACTIVE", city: "Bangalore" },
  { id: "2", name: "Priya Mehta", phone: "+91 87654 32109", role: "RIDER", status: "ACTIVE", city: "Bangalore" },
  { id: "3", name: "Rahul Singh", phone: "+91 76543 21098", role: "BOTH", status: "SUSPENDED", city: "Mumbai" },
];

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.phone.includes(search)
  );

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

      <div className="space-y-2">
        {filtered.map((user) => (
          <div key={user.id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0a0a0a] p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white">
              {user.name[0]}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{user.name}</p>
              <p className="text-xs text-white/40">{user.phone} - {user.city}</p>
            </div>
            <div className="text-right">
              <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", user.status === "ACTIVE" ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400")}>
                {user.status}
              </span>
              <p className="mt-1 text-[10px] text-white/30">{user.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
