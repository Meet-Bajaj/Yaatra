"use client";

import { useState } from "react";
import { Plus, Trash2, Home, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Input } from "@/components/ui/input";

const savedPlaces = [
  { id: "1", label: "Home", name: "Home", address: "123 MG Road, Bangalore", icon: Home },
  { id: "2", label: "Work", name: "Office", address: "456 Tech Park, Bangalore", icon: Briefcase },
];

export default function PlacesPage() {
  const [showAdd, setShowAdd] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newName, setNewName] = useState("");
  const [newAddress, setNewAddress] = useState("");

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Saved Places</h1>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-1 text-xs text-white/50 hover:text-white">
          <Plus className="h-3 w-3" /> Add
        </button>
      </div>

      <div className="space-y-2">
        {savedPlaces.map((place) => {
          const Icon = place.icon;
          return (
            <div key={place.id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0a0a0a] p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                <Icon className="h-5 w-5 text-white/50" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{place.name}</p>
                <p className="text-xs text-white/40">{place.address}</p>
              </div>
              <button className="text-white/30 hover:text-red-400 transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>

      <BottomSheet open={showAdd} onClose={() => setShowAdd(false)} title="Add Place">
        <div className="space-y-3">
          <Input placeholder="Label (e.g. Home, Work)" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} />
          <Input placeholder="Place name" value={newName} onChange={(e) => setNewName(e.target.value)} />
          <Input placeholder="Address" value={newAddress} onChange={(e) => setNewAddress(e.target.value)} />
          <Button className="w-full" onClick={() => setShowAdd(false)}>Save Place</Button>
        </div>
      </BottomSheet>
    </div>
  );
}
