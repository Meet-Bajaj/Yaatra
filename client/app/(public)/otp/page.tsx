"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, ArrowLeft, RotateCcw } from "lucide-react";
import api from "@/lib/api";
import { API } from "@/lib/endpoints";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { OTPInput } from "@/components/auth/otp-input";

function OTPContent() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone") || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(30);
  const canResend = countdown <= 0;

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleVerify = async () => {
    if (otp.length !== 6) return;
    setLoading(true);
    setError("");
    try {
      const res = await api.post(API.auth.login, { phone, otp });
      const { user, access_token } = res.data;
      setAuth(user, access_token);
      router.push("/dashboard");
    } catch {
      setError("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setCountdown(30);
    try {
      await api.post("/auth/otp", { phone });
    } catch {
      setCountdown(0);
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

      <OTPInput value={otp} onChange={setOtp} className="mb-6 justify-center" />

      <Button
        onClick={handleVerify}
        className="w-full"
        size="lg"
        disabled={otp.length !== 6 || loading}
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
            Resend OTP in <span className="font-medium text-white">{countdown}s</span>
          </p>
        )}
      </div>
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
