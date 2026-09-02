"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, Repeat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { AddressAutocomplete } from "@/components/maps/address-autocomplete";
import { cn } from "@/lib/utils";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function PlanCommutePage() {
  const router = useRouter();
  const [homeAddress, setHomeAddress] = useState("");
  const [workAddress, setWorkAddress] = useState("");
  const [homeCoords, setHomeCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [workCoords, setWorkCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [scheduleType, setScheduleType] = useState<"single" | "recurring">("recurring");
  const [selectedDays, setSelectedDays] = useState<string[]>(["Mon", "Tue", "Wed", "Thu", "Fri"]);
  const [departureTime, setDepartureTime] = useState("09:00");

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSearch = () => {
    router.push("/plan-commute/matches");
  };

  const canSearch = homeAddress && workAddress && homeCoords && workCoords;

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Plan Commute</h1>
        <p className="text-sm text-white/50">Set up your daily carpool schedule</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-4 space-y-3">
        <AddressAutocomplete
          value={homeAddress}
          onChange={setHomeAddress}
          onPlaceSelect={(place) => { setHomeAddress(place.address); setHomeCoords({ lat: place.lat, lng: place.lng }); }}
          placeholder="Home address"
        />
        <AddressAutocomplete
          value={workAddress}
          onChange={setWorkAddress}
          onPlaceSelect={(place) => { setWorkAddress(place.address); setWorkCoords({ lat: place.lat, lng: place.lng }); }}
          placeholder="Work address"
        />
      </div>

      <div>
        <div className="flex gap-2 mb-4">
          <Chip active={scheduleType === "single"} onClick={() => setScheduleType("single")}>
            <Calendar className="h-3 w-3" /> Single Day
          </Chip>
          <Chip active={scheduleType === "recurring"} onClick={() => setScheduleType("recurring")}>
            <Repeat className="h-3 w-3" /> Recurring
          </Chip>
        </div>

        {scheduleType === "recurring" && (
          <div className="flex gap-2 mb-4">
            {days.map((day) => (
              <button
                key={day}
                onClick={() => toggleDay(day)}
                className={cn(
                  "h-9 w-9 rounded-lg text-xs font-medium transition-all",
                  selectedDays.includes(day)
                    ? "bg-white text-black"
                    : "bg-white/5 text-white/40 hover:bg-white/10"
                )}
              >
                {day}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0a0a0a] p-4">
          <Clock className="h-5 w-5 text-white/30" />
          <div className="flex-1">
            <p className="text-xs text-white/50">Departure Time</p>
            <input
              type="time"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
              className="bg-transparent text-sm text-white focus:outline-none"
            />
          </div>
        </div>
      </div>

      <Button onClick={handleSearch} className="w-full" size="lg" disabled={!canSearch}>
        Find Carpools
      </Button>
    </div>
  );
}
