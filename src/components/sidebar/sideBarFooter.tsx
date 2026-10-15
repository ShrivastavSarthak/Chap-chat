"use client";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/lib/components/ui/avatar";
import { Button } from "@/src/lib/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/lib/components/ui/dropdown-menu";
import { useSidebar } from "@/src/lib/components/ui/sidebar";
import { useAppSelector } from "@/src/utils/services/store/hook";
import SignoutDialog from "./dialogs/signout_dialogs";
import { Sparkles } from "lucide-react";

export default function AppSidebarFooter() {
  const user = useAppSelector((state) => state.user);
  const { open, isMobile } = useSidebar();

  const isOpen = isMobile ? true : open;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="w-full">
        <Button
          variant="ghost"
          className={`${!isOpen
            ? "size-11 p-0 rounded-2xl flex items-center justify-center mx-auto"
            : "w-full h-auto p-2 rounded-2xl flex items-center justify-start gap-3"
            } bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 transition-all cursor-pointer text-left group`}
          title={!isOpen ? (user?.name || "Account") : undefined}
        >
          <Avatar
            className={`${!isOpen ? "size-8 rounded-xl" : "size-9 rounded-xl"
              } border border-[#FF6D1F]/40 shadow-sm shrink-0`}
          >
            <AvatarImage
              src={user?.image}
              alt={user?.name || "User"}
              className="object-cover rounded-xl"
            />
            <AvatarFallback
              className="bg-gradient-to-br from-[#FF6D1F] to-orange-700 text-white font-bold text-xs rounded-xl"
            >
              {user?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          {isOpen && (
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm font-semibold text-zinc-200 truncate group-hover:text-white transition-colors">
                {user?.name || "Guest User"}
              </span>
              <span className="text-[11px] text-zinc-400 truncate flex items-center gap-1">
                {user?.userType === "GUEST" ? (
                  <>
                    <Sparkles className="w-2.5 h-2.5 text-[#FF6D1F]" />
                    <span>Guest Mode</span>
                  </>
                ) : (
                  user?.email || "Signed in"
                )}
              </span>
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-60 bg-zinc-950/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-1.5 shadow-[0_15px_35px_rgba(0,0,0,0.6)] text-zinc-200 z-50"
        align={!isOpen ? "end" : "start"}
        side={!isOpen ? "right" : "top"}
        sideOffset={14}
      >
        <DropdownMenuLabel className="px-3 py-2 text-xs font-medium text-zinc-400">
          Account Settings
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/10 my-1" />
        <DropdownMenuItem
          className="rounded-xl px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 focus:bg-red-500/10 cursor-pointer transition-colors"
          onSelect={(e) => e.preventDefault()}
        >
          <SignoutDialog />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
