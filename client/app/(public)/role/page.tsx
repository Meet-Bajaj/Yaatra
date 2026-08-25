"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Car, Users, Briefcase, Check } from "lucide-react";
import api from "@/lib/api";
import { API } from "@/lib/endpoints";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const roles = [
  {
    value: "RIDER",
    label: "Rider",
    description: "Find and book rides from carpool drivers or professionals",
    icon: Users,
  },
  {
    value: "CARPOOL",
    label: "Carpool Driver",
    description: "Share your daily commute and earn from empty seats",
    icon: Car,
  },
  {
    value: "PROFESSIONAL",
    label: "Professional Driver",
    description: "Offer your driving services for on-demand rides",
    icon: Briefcase,
  },
  {
    value: "BOTH",
    label: "Both",
    description: "Switch between riding and driving modes",
    icon: Check,
  },
];

export default function RolePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSelect = async () => {
    if (!selected) return;
    setLoading(true);
    setError("");
    try {
      await api.post(API.users.setRole, { role: selected });
      if (selected === "RIDER") {
        router.push("/profile-setup");
      } else {
        router.push("/driver-documents");
      }
    } catch {
      setError("Failed to set role. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in rounded-2xl border border-white/10 bg-[#0a0a0a] p-8">
      <h2 className="mb-2 text-xl font-semibold text-white">Choose Your Role</h2>
      <p className="mb-6 text-sm text-white/50">How do you want to use Yaatra?</p>

      {error && (
        <div className="mb-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="space-y-3 mb-6">
        {roles.map((role) => {
          const Icon = role.icon;
          const isSelected = selected === role.value;
          return (
            <button
              key={role.value}
              onClick={() => setSelected(role.value)}
              className={cn(
                "flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-all duration-200",
                isSelected
                  ? "border-white bg-white/5"
                  : "border-white/10 hover:border-white/20 hover:bg-white/[0.02]"
              )}
            >
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                  isSelected ? "bg-white text-black" : "bg-white/10 text-white/50"
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-white">{role.label}</p>
                <p className="text-sm text-white/40">{role.description}</p>
              </div>
              {isSelected && (
                <div className="ml-auto mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-white">
                  <Check className="h-3 w-3 text-black" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <Button
        onClick={handleSelect}
        className="w-full"
        size="lg"
        disabled={!selected || loading}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Continue"}
      </Button>
    </div>
  );
}
