"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2, RotateCcw, Lock, MessageSquare, KeyRound } from "lucide-react";
import { loginSchema } from "@/lib/validators";
import api from "@/lib/api";
import { API } from "@/lib/endpoints";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OTPInput } from "@/components/auth/otp-input";
import { cn } from "@/lib/utils";

type LoginMode = "otp" | "password";

const MAX_OTP_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 300;
const RESEND_SECONDS = 30;

export default function LoginPage() {
  const router = useRouter();
  const { setAuth, setOnboardingComplete } = useAuthStore();
  const [mode, setMode] = useState<LoginMode>("otp");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [lockoutTimer, setLockoutTimer] = useState(0);
  const [resendCountdown, setResendCountdown] = useState(0);
  const canResend = resendCountdown <= 0 && !locked;

  const [phone, setPhone] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ password: string }>({
    resolver: zodResolver(loginSchema.pick({ password: true })),
  });

  useEffect(() => {
    if (resendCountdown <= 0) return;
    const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  useEffect(() => {
    if (lockoutTimer <= 0) {
      if (locked) setLocked(false);
      return;
    }
    const timer = setTimeout(() => setLockoutTimer(lockoutTimer - 1), 1000);
    return () => clearTimeout(timer);
  }, [lockoutTimer, locked]);

  const formatPhone = (p: string) => (p.startsWith("+") ? p : `+91${p}`);

  const handleSendOtp = async () => {
    if (!phone || phone.length < 10) {
      setError("Please enter a valid phone number.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await api.post(API.auth.otp, { phone: formatPhone(phone) });
      setOtpSent(true);
      setResendCountdown(RESEND_SECONDS);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to send OTP. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = useCallback(async () => {
    if (otp.length !== 6 || locked) return;
    setLoading(true);
    setError("");
    try {
      const res = await api.post(API.auth.verify, { phone: formatPhone(phone), code: otp });
      const { user, access_token, isNewUser } = res.data;

      if (isNewUser) {
        // Backend auto-created a stub user — this phone is NOT registered.
        // Do NOT store auth. Redirect to register.
        setError("No account found for this number. Please register first.");
        setOtp("");
        return;
      }

      // Existing registered user — store auth and proceed to dashboard
      setAuth(user, access_token);
      setOnboardingComplete(true);
      router.push("/dashboard");
    } catch (err: unknown) {
      const newAttempts = otpAttempts + 1;
      setOtpAttempts(newAttempts);

      if (newAttempts >= MAX_OTP_ATTEMPTS) {
        setLocked(true);
        setLockoutTimer(LOCKOUT_SECONDS);
        setError(`Too many failed attempts. Try again in ${LOCKOUT_SECONDS / 60} minutes.`);
      } else {
        const remaining = MAX_OTP_ATTEMPTS - newAttempts;
        setError(`Invalid OTP. ${remaining} attempt${remaining !== 1 ? "s" : ""} remaining.`);
      }
      setOtp("");
    } finally {
      setLoading(false);
    }
  }, [otp, locked, phone, otpAttempts, setAuth, setOnboardingComplete, router]);

  const handleResendOtp = async () => {
    if (!canResend) return;
    setResendCountdown(RESEND_SECONDS);
    setError("");
    try {
      await api.post(API.auth.resendOtp, { phone: formatPhone(phone) });
    } catch {
      setResendCountdown(0);
      setError("Failed to resend OTP. Please try again.");
    }
  };

  const onSubmitPassword = async (data: { password: string }) => {
    setLoading(true);
    setError("");
    try {
      const res = await api.post(API.auth.login, { phone: formatPhone(phone), password: data.password });
      const { user, access_token } = res.data;
      setAuth(user, access_token);
      setOnboardingComplete(true);
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

  const switchMode = (newMode: LoginMode) => {
    if (newMode === mode) return;
    setMode(newMode);
    setError("");
    setOtp("");
    setOtpSent(false);
    setOtpAttempts(0);
    setLocked(false);
    setLockoutTimer(0);
    setResendCountdown(0);
  };

  return (
    <div className="animate-fade-in mx-auto w-full max-w-md px-4 py-8 md:px-8 md:py-12">
      <div className="mb-8 text-center md:text-left">
        <h1 className="mb-2 text-2xl font-bold text-white md:text-3xl">Welcome back</h1>
        <p className="text-sm text-white/60">Sign in to your Yaatra account</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-5 md:p-8">
        {error && (
          <div className="mb-4 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="mb-5">
          <label className="mb-1.5 block text-sm font-medium text-white/70">Phone Number</label>
          <div className="flex">
            <span className="flex h-12 items-center rounded-l-xl border border-r-0 border-white/10 bg-white/5 px-3 text-sm text-white/60 md:h-11">
              +91
            </span>
            <input
              type="tel"
              inputMode="numeric"
              placeholder="98765 43210"
              maxLength={10}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              className="flex h-12 flex-1 rounded-r-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/20 md:h-11 touch-target"
            />
          </div>
        </div>

        <div className="mb-6 flex rounded-xl border border-white/10 bg-white/5 p-1">
          <button
            onClick={() => switchMode("otp")}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-lg py-3 text-sm font-medium transition-all touch-target md:py-2.5",
              mode === "otp"
                ? "bg-white text-black"
                : "text-white/50 hover:text-white/70"
            )}
          >
            <MessageSquare className="h-4 w-4" />
            OTP
          </button>
          <button
            onClick={() => switchMode("password")}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-lg py-3 text-sm font-medium transition-all touch-target md:py-2.5",
              mode === "password"
                ? "bg-white text-black"
                : "text-white/50 hover:text-white/70"
            )}
          >
            <KeyRound className="h-4 w-4" />
            Password
          </button>
        </div>

        {mode === "otp" && (
          <div className="space-y-4">
            {!otpSent ? (
              <Button
                onClick={handleSendOtp}
                className="w-full"
                size="lg"
                disabled={loading || !phone || phone.length < 10}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send OTP"}
              </Button>
            ) : (
              <>
                <p className="text-center text-sm text-white/60">
                  Enter the 6-digit code sent to <span className="text-white">+91 {phone}</span>
                </p>

                {locked ? (
                  <div className="flex flex-col items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-5">
                    <Lock className="h-8 w-8 text-red-400" />
                    <div className="text-center">
                      <p className="text-sm font-medium text-red-400">Account temporarily locked</p>
                      <p className="mt-1 text-xs text-white/50">
                        Try again in {Math.floor(lockoutTimer / 60)}:{String(lockoutTimer % 60).padStart(2, "0")}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <OTPInput value={otp} onChange={setOtp} />
                  </div>
                )}

                <Button
                  onClick={handleVerifyOtp}
                  className="w-full"
                  size="lg"
                  disabled={otp.length !== 6 || loading || locked}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify"}
                </Button>

                <div className="text-center">
                  {canResend ? (
                    <button
                      onClick={handleResendOtp}
                      className="flex items-center gap-1.5 mx-auto text-sm font-medium text-white hover:underline touch-target"
                    >
                      <RotateCcw className="h-3 w-3" />
                      Resend OTP
                    </button>
                  ) : (
                    <p className="text-sm text-white/50">
                      Resend OTP in <span className="font-medium text-white">{resendCountdown}s</span>
                    </p>
                  )}
                </div>

                {otpAttempts > 0 && !locked && (
                  <p className="text-center text-[10px] text-white/40">
                    {MAX_OTP_ATTEMPTS - otpAttempts} attempt{MAX_OTP_ATTEMPTS - otpAttempts !== 1 ? "s" : ""} remaining before lockout
                  </p>
                )}
              </>
            )}
          </div>
        )}

        {mode === "password" && (
          <form onSubmit={handleSubmit(onSubmitPassword)} className="space-y-4">
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
        )}
      </div>

      <p className="mt-6 text-center text-sm text-white/50">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-white hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}
