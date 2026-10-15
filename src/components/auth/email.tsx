"use client";
import { Button } from "@/src/lib/components/ui/button";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

export default function Email() {
  return (
    <form
      className="w-full flex flex-col gap-4"
      action={() => {
        signIn("google");
      }}
    >
      <Button
        variant="outline"
        type="submit"
        className="relative group w-full h-12 sm:h-13 px-4 rounded-xl font-medium text-sm sm:text-base flex items-center justify-center gap-3 bg-white/[0.07] hover:bg-white/[0.13] border border-white/15 hover:border-white/25 text-white transition-all duration-200 cursor-pointer shadow-sm hover:shadow-[0_4px_20px_rgba(255,255,255,0.06)] active:scale-[0.99]"
      >
        <FcGoogle className="w-5 h-5 scale-110 shrink-0" />
        <span className="font-semibold tracking-wide">Continue with Google</span>
      </Button>

      {/* Modern Divider */}
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

