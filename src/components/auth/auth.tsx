"use client";
import { Button } from "@/src/lib/components/ui/button";
import { useAppDispatch } from "@/src/utils/services/store/hook";
import { setUserData } from "@/src/utils/services/store/slice/user";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { Sparkles, ShieldCheck, Loader2 } from "lucide-react";
import Image from "next/image";
import { media } from "@/public";

export default function AuthPage({ compo }: { compo: ReactNode }) {
  const navigate = useRouter();
  const pathname = usePathname();
  const isOtp = pathname?.includes("otp") || pathname?.split("/")[1] === "otp";
  const dispatch = useAppDispatch();
  const [isGuestLoading, setIsGuestLoading] = useState(false);

  async function handleGuestLogin() {
    try {
      setIsGuestLoading(true);
      const loginAsGuest = await fetch("/api/guest-login");
      const data = await loginAsGuest.json();
      if (data) {
        dispatch(
          setUserData({
            email: "",
            image: "",
            name: "Guest",
            userType: "GUEST",
          }),
        );
        navigate.push("/home/chat/guest");
      }
    } catch (error) {
      console.error("Guest login failed:", error);
    } finally {
      setIsGuestLoading(false);
    }
  }

  return (
    <div className="w-full flex flex-col items-center">
      {/* Mobile-only Top Brand Header */}
      <div className="flex lg:hidden items-center justify-center gap-3 mb-6">
        <Image
          src={media.CCShortLogo}
          alt="Chap-Chat"
          width={36}
          height={36}
          className="rounded-xl shadow-md drop-shadow-[0_2px_10px_rgba(255,109,31,0.3)]"
        />
        <span className="text-2xl font-bold tracking-tight text-white">
          Chap<span className="text-[#FF6D1F]">Chat</span>
        </span>
      </div>

      {/* Main Glassmorphic Card */}
      <div className="relative w-full rounded-3xl backdrop-blur-2xl bg-zinc-900/70 border border-white/10 p-6 sm:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col gap-6 overflow-hidden">
        {/* Subtle Ambient Top Border Highlight */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-[#FF6D1F]/50 to-transparent pointer-events-none"
        />

        {/* Card Header */}
        <div className="flex flex-col gap-1.5">
          {isOtp && (
            <button
              type="button"
              onClick={() => navigate.back()}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-medium text-zinc-300 hover:text-white transition-all cursor-pointer mb-3 w-fit"
            >
              <FaArrowLeftLong className="w-3.5 h-3.5 text-[#FF6D1F]" />
              <span>Back</span>
            </button>
          )}

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {isOtp ? "Verification Code" : "Sign In"}
          </h2>
          <p className="text-sm text-zinc-400 font-normal leading-relaxed">
            {isOtp
              ? "Enter your 4-digit verification code to access your workspace."
              : "Enter your email address to receive a one-time sign-in code."}
          </p>
        </div>

        {/* Dynamic Form Component (Email / Google / OTP) */}
        {compo}

        {/* Guest Sign-in Option (Only when not in OTP flow) */}
        {!isOtp && (
          <Button
            type="button"
            onClick={handleGuestLogin}
            disabled={isGuestLoading}
            variant="outline"
            className="w-full h-12 rounded-xl font-medium text-sm sm:text-base flex items-center justify-center gap-2.5 bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 hover:border-white/20 text-zinc-200 hover:text-white transition-all duration-200 cursor-pointer shadow-sm active:scale-[0.99] disabled:opacity-50"
          >
            {isGuestLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#FF6D1F]" />
            ) : (
              <Sparkles className="w-4 h-4 text-[#FF6D1F]" />
            )}
            <span>
              {isGuestLoading ? "Entering as Guest..." : "Continue as a Guest"}
            </span>
          </Button>
        )}

        {/* Terms & Privacy Note */}
        <p className="text-xs text-zinc-400 text-center leading-relaxed pt-2 border-t border-white/5">
          By signing up, you agree to{" "}
          <span className="text-zinc-300 hover:text-[#FF6D1F] transition-colors cursor-pointer">
            Terms and Conditions
          </span>
          ,{" "}
          <span className="text-zinc-300 hover:text-[#FF6D1F] transition-colors cursor-pointer">
            Privacy Policy
          </span>{" "}
          &{" "}
          <span className="text-zinc-300 hover:text-[#FF6D1F] transition-colors cursor-pointer">
            End User License Agreement
          </span>
        </p>
      </div>

      {/* Security Assurance Tag */}
      <div className="flex items-center justify-center gap-2 text-xs text-zinc-400 mt-5">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>256-bit encrypted • Private & secure authentication</span>
      </div>
    </div>
  );
}

