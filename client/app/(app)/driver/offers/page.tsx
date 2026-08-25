"use client";

import { useState } from "react";
import { Pause, Play, Edit3, Trash2, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const offers = [
  { id: "1", route: "HSR Layout to Electronic City", time: "Mon-Fri, 9:00 AM", seats: 3, price: 80, riders: 2, active: true },
  { id: "2", route: "HSR Layout to Whitefield", time: "Mon-Wed, 10:00 AM", seats: 2, price: 120, riders: 0, active: false },
];

export default function DriverOffersPage() {
  const [items, setItems] = useState(offers);

  const toggleActive = (id: string) => {
    setItems((prev) => prev.map((o) => (o.id === id ? { ...o, active: !o.active } : o)));
  };

  return (
    <div className="animate-fade-in space-y-6">
      <h1 className="text-2xl font-bold text-white">My Offers</h1>

      <div className="space-y-3">
        {items.map((offer) => (
          <div key={offer.id} className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-4">
            <div className="mb-3 flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-white">{offer.route}</p>
                <p className="text-xs text-white/40">{offer.time}</p>
              </div>
              <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", offer.active ? "bg-green-500/15 text-green-400" : "bg-white/10 text-white/40")}>
                {offer.active ? "Active" : "Paused"}
              </span>
            </div>

            <div className="mb-3 flex items-center gap-4 text-xs text-white/50">
              <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {offer.riders}/{offer.seats} riders</span>
              <span>₹{offer.price}/seat</span>
            </div>

            <div className="flex gap-1">
              <button onClick={() => toggleActive(offer.id)} className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-colors">
                {offer.active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-colors">
                <Edit3 className="h-4 w-4" />
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-red-400/50 hover:bg-red-500/10 hover:text-red-400 transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
