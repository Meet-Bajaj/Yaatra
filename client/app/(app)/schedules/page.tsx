"use client";

import { useState } from "react";
import { Calendar, Pause, Play, Edit3, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const schedules = [
  { id: "1", route: "Home to Office", time: "Mon-Fri, 9:00 AM", driver: "Vikram P.", price: 80, active: true },
  { id: "2", route: "Office to Home", time: "Mon-Fri, 6:00 PM", driver: "Vikram P.", price: 80, active: true },
];

export default function SchedulesPage() {
  const [items, setItems] = useState(schedules);

  const toggleActive = (id: string) => {
    setItems((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    );
  };

  return (
    <div className="animate-fade-in space-y-6">
      <h1 className="text-2xl font-bold text-white">Schedules</h1>

      <div className="space-y-3">
        {items.map((schedule) => (
          <div key={schedule.id} className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-4">
            <div className="mb-3 flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-white">{schedule.route}</p>
                <p className="text-xs text-white/40">{schedule.time}</p>
                <p className="text-xs text-white/40">Driver: {schedule.driver}</p>
              </div>
              <span className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                schedule.active ? "bg-green-500/15 text-green-400" : "bg-white/10 text-white/40"
              )}>
                {schedule.active ? "Active" : "Paused"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-white">₹{schedule.price}/seat</p>
              <div className="flex gap-1">
                <button
                  onClick={() => toggleActive(schedule.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
                >
                  {schedule.active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>
                <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-colors">
                  <Edit3 className="h-4 w-4" />
                </button>
                <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-red-400/50 hover:bg-red-500/10 hover:text-red-400 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="py-12 text-center">
          <Calendar className="mx-auto mb-3 h-10 w-10 text-white/20" />
          <p className="text-sm text-white/50">No recurring schedules</p>
        </div>
      )}
    </div>
  );
}
