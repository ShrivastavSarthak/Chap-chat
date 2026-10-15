"use client";
import { verifyOtp } from "@/src/app/(main)/(login)/action";
import { Button } from "@/src/lib/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/src/lib/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, MailCheck } from "lucide-react";

export default function Otp() {
  const [otpValue, setOtpValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useRouter();
  const handleSendOtp = async () => {
    try {
      setIsLoading(true);
      const result = await verifyOtp(otpValue);
      if (result.status === 200) {
        toast.success(result.data?.message || "OTP verified successfully");
        navigate.push("/home/chat");
      } else {
        toast.error(result.message || "Failed to verify OTP");
      }
    } catch {
      toast.error("Something went wrong, Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="w-full flex flex-col justify-center items-center">
        <div className="w-12 h-12 rounded-2xl bg-[#FF6D1F]/10 border border-[#FF6D1F]/20 flex items-center justify-center mb-3 text-[#FF6D1F]">
          <MailCheck className="w-6 h-6" />
        </div>
        <p className="text-xs sm:text-sm text-zinc-400 font-medium text-center mb-5">
          Enter the 4-digit code sent to your email
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

