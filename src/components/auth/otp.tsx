"use client";
import {
  getOtpEmail,
  resendOtp,
  verifyOtp,
} from "@/src/app/(main)/(login)/action";
import { Button } from "@/src/lib/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/src/lib/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, MailCheck, RotateCcw } from "lucide-react";

export default function Otp() {
  const [otpValue, setOtpValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [countdown, setCountdown] = useState(30);
  const [isResending, setIsResending] = useState(false);

  // Load user email from session cookie if available
  useEffect(() => {
    getOtpEmail().then((email) => {
      if (email) setUserEmail(email);
    });
  }, []);

  // 30-second countdown timer for resending OTP
  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const handleSendOtp = async () => {
    try {
      setIsLoading(true);
      const result = await verifyOtp(otpValue);
      if (result.status === 200) {
        toast.success(result.data?.message || "OTP verified successfully");
        window.location.href = "/home/chat";
      } else {
        toast.error(
          result.data?.message ||
            result.message ||
            "Failed to verify OTP",
        );
      }
    } catch {
      toast.error("Something went wrong, Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0 || isResending) return;

    try {
      setIsResending(true);
      const result = await resendOtp();
      if (result.status === 200) {
        toast.success(result.data?.message || "OTP resent successfully");
        setCountdown(30);
      } else {
        toast.error(
          result.data?.message ||
            result.message ||
            "Failed to resend OTP. Please try again.",
        );
      }
    } catch {
      toast.error("Something went wrong while resending OTP.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="w-full flex flex-col justify-center items-center">
        <div className="w-12 h-12 rounded-2xl bg-[#FF6D1F]/10 border border-[#FF6D1F]/20 flex items-center justify-center mb-3 text-[#FF6D1F]">
          <MailCheck className="w-6 h-6" />
        </div>
        <p className="text-xs sm:text-sm text-zinc-400 font-medium text-center mb-1">
          Enter the 4-digit code sent to
        </p>
        <p className="text-xs sm:text-sm text-zinc-200 font-semibold text-center mb-5 truncate max-w-full px-2">
          {userEmail || "your email address"}
        </p>
        <InputOTP
          maxLength={4}
          minLength={4}
          value={otpValue}
          onChange={(value) => setOtpValue(value)}
          pattern={REGEXP_ONLY_DIGITS}
          onKeyDown={(event) => {
            if (event.key === "Enter" && otpValue.length === 4 && !isLoading) {
              handleSendOtp();
            }
          }}
        >
          <InputOTPGroup className="gap-2.5 sm:gap-3.5">
            <InputOTPSlot
              className="border border-white/15 bg-white/[0.04] rounded-xl text-xl sm:text-2xl font-bold text-white w-13 h-15 sm:w-16 sm:h-18 transition-all data-[active=true]:border-[#FF6D1F] data-[active=true]:ring-2 data-[active=true]:ring-[#FF6D1F]/40 data-[active=true]:bg-white/[0.08] shadow-inner"
              index={0}
            />
            <InputOTPSeparator className="hidden" />
            <InputOTPSlot
              className="border border-white/15 bg-white/[0.04] rounded-xl text-xl sm:text-2xl font-bold text-white w-13 h-15 sm:w-16 sm:h-18 transition-all data-[active=true]:border-[#FF6D1F] data-[active=true]:ring-2 data-[active=true]:ring-[#FF6D1F]/40 data-[active=true]:bg-white/[0.08] shadow-inner"
              index={1}
            />
            <InputOTPSeparator className="hidden" />
            <InputOTPSlot
              className="border border-white/15 bg-white/[0.04] rounded-xl text-xl sm:text-2xl font-bold text-white w-13 h-15 sm:w-16 sm:h-18 transition-all data-[active=true]:border-[#FF6D1F] data-[active=true]:ring-2 data-[active=true]:ring-[#FF6D1F]/40 data-[active=true]:bg-white/[0.08] shadow-inner"
              index={2}
            />
            <InputOTPSeparator className="hidden" />
            <InputOTPSlot
              className="border border-white/15 bg-white/[0.04] rounded-xl text-xl sm:text-2xl font-bold text-white w-13 h-15 sm:w-16 sm:h-18 transition-all data-[active=true]:border-[#FF6D1F] data-[active=true]:ring-2 data-[active=true]:ring-[#FF6D1F]/40 data-[active=true]:bg-white/[0.08] shadow-inner"
              index={3}
            />
          </InputOTPGroup>
        </InputOTP>

        {/* Resend OTP with 30s Countdown Timer */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-zinc-400 mt-5">
          <span>Didn&apos;t receive the code?</span>
          <button
            type="button"
            disabled={countdown > 0 || isResending}
            onClick={handleResendOtp}
            className={`font-semibold transition-all inline-flex items-center gap-1.5 ${
              countdown === 0 && !isResending
                ? "text-[#FF6D1F] hover:text-[#ff8543] underline cursor-pointer"
                : "text-zinc-500 cursor-not-allowed opacity-60"
            }`}
          >
            {isResending ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin text-[#FF6D1F]" />
                <span>Resending...</span>
              </>
            ) : countdown > 0 ? (
              <span>Resend in {countdown}s</span>
            ) : (
              <>
                <RotateCcw className="w-3 h-3" />
                <span>Resend Code</span>
              </>
            )}
          </button>
        </div>
      </div>

      <Button
        size="lg"
        type="button"
        onClick={handleSendOtp}
        disabled={otpValue.length !== 4 || isLoading}
        className="w-full h-12 sm:h-13 rounded-xl font-semibold text-sm sm:text-base flex items-center justify-center gap-2 bg-gradient-to-r from-[#FF6D1F] via-[#FF8038] to-[#FF6D1F] hover:from-[#ff7930] hover:to-[#ff5c00] text-white shadow-[0_4px_20px_rgba(255,109,31,0.35)] hover:shadow-[0_6px_25px_rgba(255,109,31,0.5)] transition-all duration-200 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-white" />
            <span>Verifying code...</span>
          </>
        ) : (
          <span>Verify & Continue</span>
        )}
      </Button>
    </div>
  );
}
