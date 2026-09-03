"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2, User, Mail, Lock } from "lucide-react";
import { registerSchema } from "@/lib/validators";
import type { z } from "zod";
import api from "@/lib/api";
import { API } from "@/lib/endpoints";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const roles = [
  { value: "RIDER" as const, label: "Rider" },
  { value: "DRIVER" as const, label: "Driver" },
  { value: "BOTH" as const, label: "Both" },
];

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth, setOnboardingComplete } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedRole, setSelectedRole] = useState<"RIDER" | "DRIVER" | "BOTH">("RIDER");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "RIDER" },
  });

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    setLoading(true);
    setError("");
    try {
      const phone = data.phone.startsWith("+") ? data.phone : `+91${data.phone}`;
      const res = await api.post(API.auth.register, {
        phone,
        name: data.name,
        email: data.email || undefined,
        password: data.password,
        role: selectedRole,
      });
      const { user, access_token } = res.data;
      setAuth(user, access_token);
      setOnboardingComplete(false);
      router.push("/role");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Registration failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in rounded-2xl border border-white/10 bg-[#0a0a0a] p-8">
      <h2 className="mb-2 text-xl font-semibold text-white">Create Account</h2>
      <p className="mb-6 text-sm text-white/50">Join Yaatra and start riding or driving</p>

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

        <div>
          <label className="mb-1.5 block text-sm font-medium text-white/70">Phone Number</label>
          <div className="flex">
            <span className="flex h-11 items-center rounded-l-xl border border-r-0 border-white/10 bg-white/5 px-3 text-sm text-white/50">
              +91
            </span>
            <input
              type="tel"
              placeholder="98765 43210"
              maxLength={10}
              onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "").slice(0, 10); }}
              className="flex h-11 flex-1 rounded-r-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/20"
              {...register("phone")}
            />
          </div>
          {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone.message}</p>}
        </div>

        <Input
          label="Email (optional)"
          placeholder="you@example.com"
          type="email"
          icon={<Mail className="h-4 w-4" />}
          {...register("email")}
          error={errors.email?.message}
        />

        <Input
          label="Password"
          placeholder="Min 8 chars, upper + lower + number + special"
          type="password"
          icon={<Lock className="h-4 w-4" />}
          {...register("password")}
          error={errors.password?.message}
        />

        <div>
          <label className="mb-1.5 block text-sm font-medium text-white/70">I want to</label>
          <div className="flex gap-2">
            {roles.map((role) => (
              <button
                key={role.value}
                type="button"
                onClick={() => setSelectedRole(role.value)}
                className={cn(
                  "flex-1 rounded-xl border py-2.5 text-sm font-medium transition-all",
                  selectedRole === role.value
                    ? "border-white bg-white text-black"
                    : "border-white/10 bg-white/5 text-white/60 hover:border-white/20"
                )}
              >
                {role.label}
              </button>
            ))}
          </div>
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Create Account
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-white/40">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-white hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}
