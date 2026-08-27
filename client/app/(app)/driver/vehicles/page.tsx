"use client";

import { useState } from "react";
import { Car, Plus, Trash2, Edit3 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { API } from "@/lib/endpoints";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { EmptyState } from "@/components/ui/empty-state";

interface Vehicle {
  id: string;
  make: string;
  model: string;
  color: string;
  licensePlate: string;
  capacity: number;
}

export default function DriverVehiclesPage() {
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [color, setColor] = useState("");
  const [plate, setPlate] = useState("");
  const [capacity, setCapacity] = useState(4);

  const { data: vehicles = [], isLoading } = useQuery({
    queryKey: ["vehicles"],
    queryFn: async () => {
      try {
        const res = await api.get(API.users.vehicles);
        return (res.data || []) as Vehicle[];
      } catch {
        return [];
      }
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: { make: string; model: string; color: string; licensePlate: string; capacity: number }) =>
      api.post(API.users.vehicles, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Vehicle> }) =>
      api.patch(API.users.vehicleById(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(API.users.vehicleById(id)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["vehicles"] }),
  });

  const resetForm = () => {
    setShowAdd(false);
    setEditId(null);
    setMake("");
    setModel("");
    setColor("");
    setPlate("");
    setCapacity(4);
  };

  const handleSave = () => {
    if (!make || !model) return;
    const data = { make, model, color, licensePlate: plate, capacity };
    if (editId) {
      updateMutation.mutate({ id: editId, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const startEdit = (vehicle: Vehicle) => {
    setEditId(vehicle.id);
    setMake(vehicle.make);
    setModel(vehicle.model);
    setColor(vehicle.color);
    setPlate(vehicle.licensePlate);
    setCapacity(vehicle.capacity);
    setShowAdd(true);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Vehicles</h1>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-1 text-xs text-white/50 hover:text-white">
          <Plus className="h-3 w-3" /> Add
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-white/5" />
          ))}
        </div>
      ) : vehicles.length > 0 ? (
        <div className="space-y-3">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                  <Car className="h-5 w-5 text-white/50" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{vehicle.make} {vehicle.model}</p>
                  <p className="text-xs text-white/40">{vehicle.color} - {vehicle.licensePlate}</p>
                  <p className="text-xs text-white/40">Capacity: {vehicle.capacity}</p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => startEdit(vehicle)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(vehicle.id)}
                    disabled={deleteMutation.isPending}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-red-400/50 hover:bg-red-500/10 hover:text-red-400 transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon={<Car className="h-12 w-12" />} title="No vehicles added yet" />
      )}

      <BottomSheet open={showAdd} onClose={resetForm} title={editId ? "Edit Vehicle" : "Add Vehicle"}>
        <div className="space-y-3">
          <Input placeholder="Make (e.g. Maruti)" value={make} onChange={(e) => setMake(e.target.value)} />
          <Input placeholder="Model (e.g. Swift)" value={model} onChange={(e) => setModel(e.target.value)} />
          <Input placeholder="Color" value={color} onChange={(e) => setColor(e.target.value)} />
          <Input placeholder="License Plate" value={plate} onChange={(e) => setPlate(e.target.value)} />
          <Input type="number" placeholder="Capacity" value={capacity.toString()} onChange={(e) => setCapacity(parseInt(e.target.value) || 4)} />
          <Button
            className="w-full"
            onClick={handleSave}
            disabled={!make || !model || createMutation.isPending || updateMutation.isPending}
          >
            {(createMutation.isPending || updateMutation.isPending)
              ? "Saving..."
              : editId ? "Update Vehicle" : "Add Vehicle"}
          </Button>
        </div>
      </BottomSheet>
    </div>
  );
}
