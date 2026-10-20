"use client";

import { media } from "@/public";
import { SidebarTrigger, useSidebar } from "@/src/lib/components/ui/sidebar";
import Image from "next/image";

export default function MobileSidebar() {
  const { isMobile } = useSidebar();
  return (
    isMobile && (
      <header className="bg-[#0B0D13]/90 backdrop-blur-xl border-b border-white/10 w-full px-4 py-3 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="text-zinc-300 hover:text-white hover:bg-white/10 rounded-xl p-2 cursor-pointer transition-all" />
          <Image
            src={media.CCShortLogo}
            width={32}
            height={32}
            alt="Chap-Chat Logo"
            className="filter drop-shadow-[0_2px_8px_rgba(255,109,31,0.3)]"
          />
          <span className="text-lg font-bold tracking-tight text-white">
            Chap<span className="text-[#FF6D1F]">Chat</span>
          </span>
        </div>
      </header>
    )
  );
}

