import { NewChatScreen } from "@/src/components/chat/chats_screen/newChatScreen";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export default function GuestPage() {
  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      {/* Sleek Guest Mode Floating Banner */}
      <div className="w-full bg-zinc-950/60 backdrop-blur-md border-b border-white/10 px-4 py-2 flex flex-wrap items-center justify-between gap-2 z-20 shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FF6D1F]/15 border border-[#FF6D1F]/30 text-[#FF6D1F] font-semibold text-[11px] tracking-wide">
            <Sparkles className="w-3 h-3 text-[#FF6D1F]" />
            Guest Session
          </span>
          <span className="text-xs text-zinc-400 hidden sm:inline">
            Chats are temporary. Sign in anytime to preserve your conversations.
          </span>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#FF6D1F] hover:text-[#ff853e] transition-colors group cursor-pointer"
        >
          <span>Sign In / Create Account</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="relative flex-1 min-h-0 w-full overflow-hidden">
        <NewChatScreen />
      </div>
    </div>
  );
}

