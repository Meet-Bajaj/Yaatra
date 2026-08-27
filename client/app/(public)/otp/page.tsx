"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, ArrowLeft, RotateCcw, Lock } from "lucide-react";
import api from "@/lib/api";
import { API } from "@/lib/endpoints";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { OTPInput } from "@/components/auth/otp-input";

const MAX_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 300;
const RESEND_SECONDS = 30;

function OTPContent() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone") || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [lockoutTimer, setLockoutTimer] = useState(0);
  const [resendCountdown, setResendCountdown] = useState(RESEND_SECONDS);
  const canResend = resendCountdown <= 0 && !locked;

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

  const handleVerify = useCallback(async () => {
    if (otp.length !== 6 || locked) return;
    setLoading(true);
    setError("");
    try {
      const res = await api.post(API.auth.login, { phone, otp });
      const { user, access_token } = res.data;
      setAuth(user, access_token);
      router.push("/dashboard");
    } catch (err: unknown) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= MAX_ATTEMPTS) {
        setLocked(true);
        setLockoutTimer(LOCKOUT_SECONDS);
        setError(`Too many failed attempts. Try again in ${LOCKOUT_SECONDS / 60} minutes.`);
      } else {
        const remaining = MAX_ATTEMPTS - newAttempts;
        setError(`Invalid OTP. ${remaining} attempt${remaining !== 1 ? "s" : ""} remaining.`);
      }
      setOtp("");
    } finally {
      setLoading(false);
    }
  }, [otp, locked, phone, attempts, setAuth, router]);

  const handleResend = async () => {
    if (!canResend) return;
    setResendCountdown(RESEND_SECONDS);
    setError("");
    try {
      await api.post("/auth/resend-otp", { phone });
    } catch {
      setResendCountdown(0);
      setError("Failed to resend OTP. Please try again.");
    }
  };

  return (
    <div className="animate-fade-in rounded-2xl border border-white/10 bg-[#0a0a0a] p-8">
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <h2 className="mb-2 text-xl font-semibold text-white">Verify OTP</h2>
      <p className="mb-6 text-sm text-white/50">
        Enter the 6-digit code sent to <span className="text-white">+91 {phone}</span>
      </p>

      {error && (
        <div className="mb-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {locked ? (
        <div className="mb-6 flex flex-col items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4">
          <Lock className="h-8 w-8 text-red-400" />
          <div className="text-center">
            <p className="text-sm font-medium text-red-400">Account temporarily locked</p>
            <p className="mt-1 text-xs text-white/40">
              Try again in {Math.floor(lockoutTimer / 60)}:{String(lockoutTimer % 60).padStart(2, "0")}
            </p>
          </div>
        </div>
      ) : (
        <OTPInput value={otp} onChange={setOtp} className="mb-6 justify-center" />
      )}

      <Button
        onClick={handleVerify}
        className="w-full"
        size="lg"
        disabled={otp.length !== 6 || loading || locked}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify"}
      </Button>

      <div className="mt-4 text-center">
        {canResend ? (
          <button
            onClick={handleResend}
            className="flex items-center gap-1.5 mx-auto text-sm font-medium text-white hover:underline"
          >
            <RotateCcw className="h-3 w-3" />
            Resend OTP
          </button>
        ) : (
          <p className="text-sm text-white/40">
            Resend OTP in <span className="font-medium text-white">{resendCountdown}s</span>
          </p>
        )}
      </div>

      {attempts > 0 && !locked && (
        <p className="mt-3 text-center text-[10px] text-white/30">
          {MAX_ATTEMPTS - attempts} attempt{MAX_ATTEMPTS - attempts !== 1 ? "s" : ""} remaining before lockout
        </p>
      )}
    </div>
  );
}

export default function OTPPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-white/50" />
        </div>
      }
    >
      <OTPContent />
    </Suspense>
  );
}
