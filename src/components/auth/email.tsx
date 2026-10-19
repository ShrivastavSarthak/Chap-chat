"use client";
import { registerUser } from "@/src/app/(main)/(login)/action";
import { Button } from "@/src/lib/components/ui/button";
import { Mail, ArrowRight, Loader2, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function Email() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useRouter();

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidName = name.trim().length >= 2;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidName || !isValidEmail || isLoading) return;

    try {
      setIsLoading(true);
      const result = await registerUser(email, name);
      if (result.status === 200) {
        toast.success("OTP sent! Check your inbox.");
        window.location.href = "/otp";
      } else {
        toast.error(result.message || "Failed to send OTP. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
      {/* Name Input */}
      <div className="relative flex flex-col gap-1.5">
        <label
          htmlFor="name-input"
          className="text-xs font-medium text-zinc-400 uppercase tracking-wider pl-0.5"
        >
          Full name
        </label>
        <div className="relative group">
          {/* Left Icon */}
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
            <User className="w-4.5 h-4.5 text-zinc-500 group-focus-within:text-[#FF6D1F] transition-colors duration-200" />
          </div>

          <input
            id="name-input"
            type="text"
            autoComplete="name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            className="w-full h-12 sm:h-13 pl-11 pr-4 rounded-xl bg-white/[0.05] border border-white/15 text-white placeholder:text-zinc-500 text-sm font-medium outline-none
              focus:border-[#FF6D1F]/60 focus:ring-2 focus:ring-[#FF6D1F]/20 focus:bg-white/[0.08]
              hover:border-white/25 hover:bg-white/[0.07]
              transition-all duration-200 shadow-inner"
          />

          {/* Animated bottom glow on focus */}
          <div
            aria-hidden="true"
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-focus-within:w-2/3 h-[1px] bg-gradient-to-r from-transparent via-[#FF6D1F]/60 to-transparent transition-all duration-500 rounded-full"
          />
        </div>

        {/* Validation hint */}
        {name.length > 0 && !isValidName && (
          <p className="text-[11px] text-red-400/80 pl-0.5 flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-red-400/80 inline-block" />
            Name must be at least 2 characters
          </p>
        )}
      </div>

      {/* Email Input */}
      <div className="relative flex flex-col gap-1.5">
        <label
          htmlFor="email-input"
          className="text-xs font-medium text-zinc-400 uppercase tracking-wider pl-0.5"
        >
          Email address
        </label>
        <div className="relative group">
          {/* Left Icon */}
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
            <Mail className="w-4.5 h-4.5 text-zinc-500 group-focus-within:text-[#FF6D1F] transition-colors duration-200" />
          </div>

          <input
            id="email-input"
            type="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit(e as unknown as React.FormEvent);
            }}
            placeholder="you@example.com"
            className="w-full h-12 sm:h-13 pl-11 pr-4 rounded-xl bg-white/[0.05] border border-white/15 text-white placeholder:text-zinc-500 text-sm font-medium outline-none
              focus:border-[#FF6D1F]/60 focus:ring-2 focus:ring-[#FF6D1F]/20 focus:bg-white/[0.08]
              hover:border-white/25 hover:bg-white/[0.07]
              transition-all duration-200 shadow-inner"
          />

          {/* Animated bottom glow on focus */}
          <div
            aria-hidden="true"
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-focus-within:w-2/3 h-[1px] bg-gradient-to-r from-transparent via-[#FF6D1F]/60 to-transparent transition-all duration-500 rounded-full"
          />
        </div>

        {/* Validation hint */}
        {email.length > 0 && !isValidEmail && (
          <p className="text-[11px] text-red-400/80 pl-0.5 flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-red-400/80 inline-block" />
            Enter a valid email address
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={!isValidName || !isValidEmail || isLoading}
        className="w-full h-12 sm:h-13 rounded-xl font-semibold text-sm sm:text-base flex items-center justify-center gap-2.5
          bg-gradient-to-r from-[#FF6D1F] via-[#FF8038] to-[#FF6D1F] bg-size-200 bg-pos-0 hover:bg-pos-100
          hover:from-[#ff7930] hover:to-[#ff5c00] text-white
          shadow-[0_4px_20px_rgba(255,109,31,0.35)] hover:shadow-[0_6px_28px_rgba(255,109,31,0.55)]
          transition-all duration-200 active:scale-[0.99]
          disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Sending code...</span>
          </>
        ) : (
          <>
            <span>Continue with Email</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </>
        )}
      </Button>

      {/* Divider */}
      <div className="relative my-1 flex items-center justify-center w-full">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10" />
        </div>
        <div className="relative bg-zinc-900/90 px-3 text-[11px] uppercase tracking-wider text-zinc-400 font-medium rounded-full">
          or
        </div>
      </div>
    </form>
  );
}
