"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { API } from "@/lib/endpoints";
import { useAuthStore } from "@/stores/authStore";

const MAX_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 300;
const RESEND_SECONDS = 30;

export const OTP_LIMITS = { MAX_ATTEMPTS, LOCKOUT_SECONDS, RESEND_SECONDS };

/**
 * Shared OTP verify/resend flow with attempt lockout and resend countdown.
 * Used by both the login page (inline OTP) and the standalone /otp page.
 */
export function useOtpFlow({ phone }: { phone: string }) {
  const router = useRouter();
  const { setAuth, setOnboardingComplete } = useAuthStore();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [lockoutTimer, setLockoutTimer] = useState(0);
  const [resendCountdown, setResendCountdown] = useState(0);
  const canResend = resendCountdown <= 0 && !locked;

  useEffect(() => {
    if (resendCountdown <= 0) return;
    const timer = setTimeout(() => setResendCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  useEffect(() => {
    if (lockoutTimer <= 0) return;
    const timer = setTimeout(() => {
      if (lockoutTimer <= 1) setLocked(false);
      setLockoutTimer((t) => Math.max(0, t - 1));
    }, 1000);
    return () => clearTimeout(timer);
  }, [lockoutTimer]);

  const startResendCountdown = useCallback(() => setResendCountdown(RESEND_SECONDS), []);

  const verify = useCallback(async () => {
    if (otp.length !== 6 || locked) return;
    setLoading(true);
    setError("");
    try {
      const res = await api.post(API.auth.verify, { phone, code: otp });
      const { user, access_token, isNewUser } = res.data;

      if (isNewUser) {
        // Backend auto-created a stub user — this phone is NOT registered.
        setError("No account found for this number. Please register first.");
        setOtp("");
        return;
      }

      setAuth(user, access_token);
      setOnboardingComplete(true);
      router.push("/dashboard");
    } catch {
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
  }, [otp, locked, phone, attempts, setAuth, setOnboardingComplete, router]);

  const resend = useCallback(async () => {
    if (!canResend) return;
    setResendCountdown(RESEND_SECONDS);
    setError("");
    try {
      await api.post(API.auth.resendOtp, { phone });
    } catch {
      setResendCountdown(0);
      setError("Failed to resend OTP. Please try again.");
    }
  }, [canResend, phone]);

  const reset = useCallback(() => {
    setOtp("");
    setAttempts(0);
    setLocked(false);
    setLockoutTimer(0);
    setResendCountdown(0);
    setError("");
  }, []);

  return {
    otp,
    setOtp,
    error,
    setError,
    loading,
    attempts,
    locked,
    lockoutTimer,
    resendCountdown,
    canResend,
    verify,
    resend,
    reset,
    startResendCountdown,
  };
}
