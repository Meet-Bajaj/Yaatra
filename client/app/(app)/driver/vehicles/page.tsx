"use client";

import { useState } from "react";
import { Car, Plus, Trash2, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BottomSheet } from "@/components/ui/bottom-sheet";

const vehicles = [
  { id: "1", make: "Maruti", model: "Swift Dzire", color: "White", plate: "KA 01 AB 1234", capacity: 4 },
];

export default function DriverVehiclesPage() {
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Vehicles</h1>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-1 text-xs text-white/50 hover:text-white">
          <Plus className="h-3 w-3" /> Add
        </button>
      </div>

      <div className="space-y-3">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                <Car className="h-5 w-5 text-white/50" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{vehicle.make} {vehicle.model}</p>
                <p className="text-xs text-white/40">{vehicle.color} - {vehicle.plate}</p>
                <p className="text-xs text-white/40">Capacity: {vehicle.capacity}</p>
              </div>
              <div className="flex gap-1">
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

      <BottomSheet open={showAdd} onClose={() => setShowAdd(false)} title="Add Vehicle">
        <div className="space-y-3">
          <Input placeholder="Make (e.g. Maruti)" />
          <Input placeholder="Model (e.g. Swift)" />
          <Input placeholder="Color" />
          <Input placeholder="License Plate" />
          <Input type="number" placeholder="Capacity" />
          <Button className="w-full" onClick={() => setShowAdd(false)}>Add Vehicle</Button>
        </div>
      </BottomSheet>
    </div>
  );
}
