"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, ArrowLeft, RotateCcw, Lock } from "lucide-react";
import { useOtpFlow, OTP_LIMITS } from "@/hooks/use-otp";
import { Button } from "@/components/ui/button";
import { OTPInput } from "@/components/auth/otp-input";

function OTPContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone") || "";

  const otpFlow = useOtpFlow({ phone });

  // Start the resend countdown as soon as the page opens
  useEffect(() => {
    otpFlow.startResendCountdown();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

      {otpFlow.error && (
        <div className="mb-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {otpFlow.error}
        </div>
      )}

      {otpFlow.locked ? (
        <div className="mb-6 flex flex-col items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4">
          <Lock className="h-8 w-8 text-red-400" />
          <div className="text-center">
            <p className="text-sm font-medium text-red-400">Account temporarily locked</p>
            <p className="mt-1 text-xs text-white/40">
              Try again in {Math.floor(otpFlow.lockoutTimer / 60)}:
              {String(otpFlow.lockoutTimer % 60).padStart(2, "0")}
            </p>
          </div>
        </div>
      ) : (
        <OTPInput value={otpFlow.otp} onChange={otpFlow.setOtp} className="mb-6 justify-center" />
      )}

      <Button
        onClick={otpFlow.verify}
        className="w-full"
        size="lg"
        disabled={otpFlow.otp.length !== 6 || otpFlow.loading || otpFlow.locked}
      >
        {otpFlow.loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify"}
      </Button>

      <div className="mt-4 text-center">
        {otpFlow.canResend ? (
          <button
            onClick={otpFlow.resend}
            className="flex items-center gap-1.5 mx-auto text-sm font-medium text-white hover:underline"
          >
            <RotateCcw className="h-3 w-3" />
            Resend OTP
          </button>
        ) : (
          <p className="text-sm text-white/40">
            Resend OTP in <span className="font-medium text-white">{otpFlow.resendCountdown}s</span>
          </p>
        )}
      </div>

      {otpFlow.attempts > 0 && !otpFlow.locked && (
        <p className="mt-3 text-center text-[10px] text-white/30">
          {OTP_LIMITS.MAX_ATTEMPTS - otpFlow.attempts} attempt
          {OTP_LIMITS.MAX_ATTEMPTS - otpFlow.attempts !== 1 ? "s" : ""} remaining before lockout
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
