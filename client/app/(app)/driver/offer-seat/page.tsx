"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Car } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { API } from "@/lib/endpoints";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Stepper } from "@/components/ui/stepper";
import { AddressAutocomplete } from "@/components/maps/address-autocomplete";
import { cn } from "@/lib/utils";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const DAY_MAP: Record<string, string> = {
  Mon: "MONDAY",
  Tue: "TUESDAY",
  Wed: "WEDNESDAY",
  Thu: "THURSDAY",
  Fri: "FRIDAY",
  Sat: "SATURDAY",
  Sun: "SUNDAY",
};

interface Vehicle {
  id: string;
  make?: string;
  model?: string;
  color?: string;
  licensePlate?: string;
}

export default function OfferSeatPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [homeAddress, setHomeAddress] = useState("");
  const [workAddress, setWorkAddress] = useState("");
  const [homeCoords, setHomeCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [workCoords, setWorkCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [departureTime, setDepartureTime] = useState("09:00");
  const [selectedDays, setSelectedDays] = useState<string[]>(["Mon", "Tue", "Wed", "Thu", "Fri"]);
  const [seats, setSeats] = useState(2);
  const [pricePerSeat, setPricePerSeat] = useState(80);
  const [womenOnly, setWomenOnly] = useState(false);
  const [vehicleId, setVehicleId] = useState<string>("");

  const { data: vehicles = [] } = useQuery({
    queryKey: ["vehicles"],
    queryFn: async () => {
      try {
        const res = await api.get(API.users.vehicles);
        return (Array.isArray(res.data) ? res.data : []) as Vehicle[];
      } catch {
        return [];
      }
    },
  });

  const effectiveVehicleId = vehicleId || vehicles[0]?.id || "";

  const steps = [
    { label: "Route", description: "Set home and work" },
    { label: "Schedule", description: "Time and days" },
    { label: "Details", description: "Seats and price" },
    { label: "Publish", description: "Review and publish" },
  ];

  const publishMutation = useMutation({
    mutationFn: () => {
      if (!homeCoords || !workCoords) throw new Error("Missing route coordinates");
      return api.post(API.driver.offer, {
        pickup: { lat: homeCoords.lat, lng: homeCoords.lng, address: homeAddress },
        drop: { lat: workCoords.lat, lng: workCoords.lng, address: workAddress },
        schedule: selectedDays.map((d) => ({ day: DAY_MAP[d], departureTime })),
        seats,
        pricePerSeat,
        womenOnly,
        vehicleId: effectiveVehicleId,
      });
    },
    onSuccess: () => {
      router.push("/driver/offers");
    },
  });

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handlePublish = () => {
    publishMutation.mutate();
  };

  const publishError =
    (publishMutation.error as { response?: { data?: { message?: string } } })?.response?.data
      ?.message || "Failed to publish offer. Please try again.";

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white/60 hover:bg-white/10 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-bold text-white">Offer a Seat</h1>
      </div>

      <Stepper steps={steps} currentStep={step} />

      {step === 0 && (
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-white/70">Home Address</label>
            <AddressAutocomplete
              value={homeAddress}
              onChange={setHomeAddress}
              onPlaceSelect={(place) => { setHomeAddress(place.address); setHomeCoords({ lat: place.lat, lng: place.lng }); }}
              placeholder="Enter home address"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-white/70">Work Address</label>
            <AddressAutocomplete
              value={workAddress}
              onChange={setWorkAddress}
              onPlaceSelect={(place) => { setWorkAddress(place.address); setWorkCoords({ lat: place.lat, lng: place.lng }); }}
              placeholder="Enter work address"
            />
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <div className="flex gap-2">
            {days.map((day) => (
              <button key={day} onClick={() => toggleDay(day)} className={cn("h-9 w-9 rounded-lg text-xs font-medium transition-all", selectedDays.includes(day) ? "bg-white text-black" : "bg-white/5 text-white/40 hover:bg-white/10")}>
                {day}
              </button>
            ))}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-white/70">Departure</label>
            <input type="time" value={departureTime} onChange={(e) => setDepartureTime(e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:outline-none" />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-white/70">Vehicle</label>
            {vehicles.length === 0 ? (
              <p className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 px-4 py-3 text-xs text-yellow-400">
                No vehicles found. Add a vehicle in your profile first.
              </p>
            ) : (
              <div className="space-y-2">
                {vehicles.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setVehicleId(v.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all",
                      effectiveVehicleId === v.id
                        ? "border-white bg-white/5"
                        : "border-white/10 hover:border-white/20"
                    )}
                  >
                    <Car className="h-5 w-5 text-white/50" />
                    <span className="flex-1 text-sm text-white">
                      {v.make} {v.model}
                      {v.color ? ` · ${v.color}` : ""}
                    </span>
                    {v.licensePlate && <span className="text-xs text-white/40">{v.licensePlate}</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-white/70">Available Seats</label>
            <div className="flex gap-2">
              {[1, 2, 3].map((n) => (
                <button key={n} onClick={() => setSeats(n)} className={cn("flex h-12 w-12 items-center justify-center rounded-xl border text-lg font-semibold transition-all", seats === n ? "border-white bg-white text-black" : "border-white/10 bg-white/5 text-white/60")}>
                  {n}
                </button>
              ))}
            </div>
          </div>
          <Input label="Price per Seat (₹)" type="number" value={pricePerSeat.toString()} onChange={(e) => setPricePerSeat(parseInt(e.target.value) || 0)} />
          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-[#0a0a0a] p-3">
            <span className="text-sm text-white">Women Only</span>
            <button onClick={() => setWomenOnly(!womenOnly)} className={cn("relative h-6 w-11 rounded-full transition-colors", womenOnly ? "bg-pink-500" : "bg-white/20")}>
              <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform", womenOnly ? "left-[22px]" : "left-0.5")} />
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-5 space-y-3">
            <div className="flex justify-between text-sm"><span className="text-white/60">Route</span><span className="text-white">{homeAddress || "Home"} to {workAddress || "Work"}</span></div>
            <div className="flex justify-between text-sm"><span className="text-white/60">Schedule</span><span className="text-white">{selectedDays.join(", ")}</span></div>
            <div className="flex justify-between text-sm"><span className="text-white/60">Departure</span><span className="text-white">{departureTime}</span></div>
            <div className="flex justify-between text-sm"><span className="text-white/60">Seats</span><span className="text-white">{seats}</span></div>
            <div className="flex justify-between text-sm"><span className="text-white/60">Price/seat</span><span className="text-white">₹{pricePerSeat}</span></div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Vehicle</span>
              <span className="text-white">
                {(() => {
                  const v = vehicles.find((x) => x.id === effectiveVehicleId);
                  return v ? `${v.make} ${v.model || ""}` : "—";
                })()}
              </span>
            </div>
            {womenOnly && <div className="flex justify-between text-sm"><span className="text-white/60">Women Only</span><span className="text-pink-400">Yes</span></div>}
          </div>

          {publishMutation.isError && (
            <p className="text-xs text-red-400">{publishError}</p>
          )}
        </div>
      )}

      <div className="flex gap-3">
        {step > 0 && (
          <Button variant="outline" className="flex-1" onClick={() => setStep(step - 1)}>
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        )}
        <Button
          className="flex-1"
          onClick={() => {
            if (step === steps.length - 1) handlePublish();
            else setStep(step + 1);
          }}
          disabled={
            (step === 0 && (!homeAddress || !workAddress || !homeCoords || !workCoords)) ||
            (step === 1 && selectedDays.length === 0) ||
            (step === 2 && (!effectiveVehicleId || pricePerSeat < 10 || pricePerSeat > 500)) ||
            publishMutation.isPending
          }
        >
          {step === steps.length - 1
            ? (publishMutation.isPending ? "Publishing..." : "Publish")
            : "Continue"} <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
