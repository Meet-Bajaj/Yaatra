"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2 } from "lucide-react";
import { loginSchema } from "@/lib/validators";
import type { z } from "zod";
import api from "@/lib/api";
import { API } from "@/lib/endpoints";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setLoading(true);
    setError("");
    try {
      const phone = data.phone.startsWith("+") ? data.phone : `+91${data.phone}`;
      const res = await api.post(API.auth.login, { phone, password: data.password });
      const { user, access_token } = res.data;
      setAuth(user, access_token);
      router.push("/dashboard");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Login failed. Please check your credentials.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in rounded-2xl border border-white/10 bg-[#0a0a0a] p-8">
      <h2 className="mb-6 text-xl font-semibold text-white">Sign In</h2>

      {error && (
        <div className="mb-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-white/70">Phone Number</label>
          <div className="flex">
            <span className="flex h-11 items-center rounded-l-xl border border-r-0 border-white/10 bg-white/5 px-3 text-sm text-white/50">
              +91
            </span>
            <input
              type="tel"
              placeholder="98765 43210"
              className="flex h-11 flex-1 rounded-r-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/20"
              {...register("phone")}
            />
          </div>
          {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone.message}</p>}
        </div>

        <Input
          label="Password"
          placeholder="Enter your password"
          type="password"
          {...register("password")}
          error={errors.password?.message}
        />

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Sign In
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-white/40">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-white hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}
