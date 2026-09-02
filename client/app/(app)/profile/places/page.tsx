"use client";

import { useState } from "react";
import { Plus, Trash2, Home, Briefcase, MapPin, Building } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { API } from "@/lib/endpoints";
import { Button } from "@/components/ui/button";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Input } from "@/components/ui/input";
import { AddressAutocomplete } from "@/components/maps/address-autocomplete";
import { EmptyState } from "@/components/ui/empty-state";

interface SavedPlace {
  id: string;
  label: string;
  name: string;
  address: string;
  lat?: number;
  lng?: number;
}

const iconMap: Record<string, typeof Home> = {
  Home,
  Work: Briefcase,
  Office: Briefcase,
};

export default function PlacesPage() {
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newName, setNewName] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newCoords, setNewCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [editId, setEditId] = useState<string | null>(null);

  const { data: places, isLoading } = useQuery({
    queryKey: ["places"],
    queryFn: async () => {
      try {
        const res = await api.get(API.users.places);
        const data = res.data;
        return (Array.isArray(data) ? data : []) as SavedPlace[];
      } catch {
        return [];
      }
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: { label: string; name: string; address: string; lat: number; lng: number }) =>
      api.post(API.users.places, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["places"] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(API.users.placeById(id)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["places"] }),
  });

  const resetForm = () => {
    setShowAdd(false);
    setNewLabel("");
    setNewName("");
    setNewAddress("");
    setNewCoords(null);
    setEditId(null);
  };

  const handleSave = () => {
    if (!newName || !newAddress || !newCoords) return;
    createMutation.mutate({ label: newLabel || newName, name: newName, address: newAddress, lat: newCoords.lat, lng: newCoords.lng });
  };

  const getIcon = (label: string) => iconMap[label] || MapPin;

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Saved Places</h1>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-1 text-xs text-white/50 hover:text-white">
          <Plus className="h-3 w-3" /> Add
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-white/5" />
          ))}
        </div>
      ) : places && places.length > 0 ? (
        <div className="space-y-2">
          {places.map((place) => {
            const Icon = getIcon(place.label);
            return (
              <div key={place.id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0a0a0a] p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                  <Icon className="h-5 w-5 text-white/50" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{place.name}</p>
                  <p className="text-xs text-white/40">{place.address}</p>
                </div>
                <button
                  onClick={() => deleteMutation.mutate(place.id)}
                  disabled={deleteMutation.isPending}
                  className="text-white/30 hover:text-red-400 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState icon={<Building className="h-12 w-12" />} title="No saved places yet" />
      )}

      <BottomSheet open={showAdd} onClose={resetForm} title={editId ? "Edit Place" : "Add Place"}>
        <div className="space-y-3">
          <Input placeholder="Label (e.g. Home, Work)" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} />
          <Input placeholder="Place name" value={newName} onChange={(e) => setNewName(e.target.value)} />
          <AddressAutocomplete
            value={newAddress}
            onChange={setNewAddress}
            onPlaceSelect={(place) => { setNewAddress(place.address); setNewCoords({ lat: place.lat, lng: place.lng }); }}
            placeholder="Search address"
          />
          <Button
            className="w-full"
            onClick={handleSave}
            disabled={!newName || !newAddress || !newCoords || createMutation.isPending}
          >
            {createMutation.isPending ? "Saving..." : "Save Place"}
          </Button>
        </div>
      </BottomSheet>
    </div>
  );
}
