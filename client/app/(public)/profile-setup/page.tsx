"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, User, MapPin } from "lucide-react";
import { profileSchema } from "@/lib/validators";
import type { z } from "zod";
import api from "@/lib/api";
import { API } from "@/lib/endpoints";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/authStore";

const genders = ["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"] as const;

export default function ProfileSetupPage() {
  const router = useRouter();
  const { user, updateUser, setOnboardingComplete } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedGender, setSelectedGender] = useState<string>(user?.gender || "");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      city: user?.city || "",
      gender: undefined,
    },
  });

  const onSubmit = async (data: z.infer<typeof profileSchema>) => {
    setLoading(true);
    setError("");
    try {
      const res = await api.patch(API.users.updateMe, {
        ...data,
        gender: selectedGender || undefined,
      });
      if (res.data) {
        updateUser(res.data);
      }
      setOnboardingComplete(true);
      router.push("/dashboard");
    } catch {
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in rounded-2xl border border-white/10 bg-[#0a0a0a] p-8">
      <h2 className="mb-2 text-xl font-semibold text-white">Set Up Profile</h2>
      <p className="mb-6 text-sm text-white/50">Tell us a bit about yourself</p>

      {error && (
        <div className="mb-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full Name"
          placeholder="Enter your full name"
          icon={<User className="h-4 w-4" />}
          {...register("name")}
          error={errors.name?.message}
        />

        <Input
          label="City"
          placeholder="Enter your city"
          icon={<MapPin className="h-4 w-4" />}
          {...register("city")}
          error={errors.city?.message}
        />

        <div>
          <label className="mb-1.5 block text-sm font-medium text-white/70">Gender</label>
          <div className="flex gap-2">
            {genders.map((gender) => (
              <button
                key={gender}
                type="button"
                onClick={() => setSelectedGender(gender)}
                className={`flex-1 rounded-xl border px-3 py-2.5 text-xs font-medium transition-all ${
                  selectedGender === gender
                    ? "border-white bg-white text-black"
                    : "border-white/10 bg-white/5 text-white/60 hover:border-white/20"
                }`}
              >
                {gender.replace("_", " ").toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase())}
              </button>
            ))}
          </div>
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Complete Profile"}
        </Button>
      </form>
    </div>
  );
}
