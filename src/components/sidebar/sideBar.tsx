"use client";
import { media } from "@/public";
import { SetExistingChat } from "@/src/app/(main)/home/action";
import { GetChatHistory } from "@/src/utils/services/api_services/tankstack/chat";
import { useAppDispatch } from "@/src/utils/services/store/hook";
import { resetChats } from "@/src/utils/services/store/slice/chat";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LuMessageCirclePlus } from "react-icons/lu";
import { toast } from "sonner";
import { Button } from "../../lib/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarTrigger,
  useSidebar,
} from "../../lib/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../lib/components/ui/tooltip";
import AppSidebarFooter from "./sideBarFooter";

export function AppSidebar() {
  const [, setChatHistory] = useState<any[]>([]);
  const dispatch = useAppDispatch();
  const navigate = useRouter();
  const { data } = GetChatHistory();
  const { open, isMobile } = useSidebar();

  // Always keep sidebar open if mobile
  const isOpen = isMobile ? true : open;

  useEffect(() => {
    if (data?.status === 200) {
      setChatHistory(data?.data?.chats);
    }
  }, [data]);

  const handleNewChat = async () => {
    await fetch("/api/newChat", { method: "GET" });
    dispatch(resetChats());
    navigate.push("/home/chat");
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent
        className={`bg-[#0B0D13] border-r border-white/10 ${
          !isOpen ? "w-20 px-3 py-6 items-center" : "w-64 p-4"
        } flex flex-col h-screen text-zinc-200 transition-all duration-300`}
      >
        <SidebarHeader className={`w-full ${!isOpen ? "p-0 flex flex-col items-center" : "pb-2"}`}>
          <div
            className={`w-full flex ${
              !isOpen ? "flex-col items-center gap-4" : "flex-row justify-between items-center"
            }`}
          >
            <div className="flex items-center justify-center">
              {isOpen ? (
                <Image
                  src={media.CCLogoBlue}
                  width={140}
                  height={40}
                  alt="Chap-Chat Logo"
                  className="object-contain filter drop-shadow-[0_2px_8px_rgba(255,109,31,0.2)]"
                />
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="size-11 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center shadow-sm hover:border-[#FF6D1F]/40 transition-colors cursor-pointer">
                      <Image
                        src={media.CCShortLogo}
                        width={26}
                        height={26}
                        alt="Chap-Chat Logo"
                        className="object-contain filter drop-shadow-[0_2px_8px_rgba(255,109,31,0.3)]"
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={12} className="bg-zinc-900 border border-white/10 text-white font-medium text-xs px-3 py-1.5 rounded-lg shadow-xl">
                    Chap-Chat
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            <div className="flex items-center justify-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <SidebarTrigger className={`${!isOpen ? "size-11 rounded-2xl" : "size-9 rounded-xl"} text-zinc-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all cursor-pointer`} />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={12} className="bg-zinc-900 border border-white/10 text-white font-medium text-xs px-3 py-1.5 rounded-lg shadow-xl">
                  {isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          {!isOpen && (
            <div className="w-8 h-[1px] bg-white/10 my-3 rounded-full" />
          )}
        </SidebarHeader>

        <SidebarGroup className={`flex flex-col flex-1 overflow-y-auto no-scrollbar ${!isOpen ? "p-0 items-center w-full" : "pt-2"}`}>
          <SidebarGroupContent className="flex-1 flex flex-col items-center w-full">
            <SidebarMenu className={`w-full flex flex-col ${!isOpen ? "items-center gap-3" : "gap-2"}`}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="default"
                    className={`${
                      !isOpen
                        ? "size-11 p-0 rounded-2xl flex items-center justify-center mx-auto"
                        : "w-full h-11 px-4 rounded-2xl flex items-center justify-start gap-2.5 text-sm font-medium"
                    } bg-gradient-to-r from-[#FF6D1F] to-[#FF853E] hover:from-[#ff7930] hover:to-[#ff5c00] text-white shadow-[0_2px_14px_rgba(255,109,31,0.35)] hover:shadow-[0_4px_18px_rgba(255,109,31,0.5)] transition-all duration-200 active:scale-[0.98] cursor-pointer`}
                    onClick={handleNewChat}
                  >
                    <LuMessageCirclePlus className="size-5 shrink-0" />
                    {isOpen && <span>New Chat</span>}
                  </Button>
                </TooltipTrigger>
                {!isOpen && (
                  <TooltipContent side="right" sideOffset={12} className="bg-zinc-900 border border-white/10 text-white font-medium text-xs px-3 py-1.5 rounded-lg shadow-xl">
                    New Chat
                  </TooltipContent>
                )}
              </Tooltip>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Footer stays fixed */}
        <SidebarFooter className={`pt-3 border-t border-white/5 ${!isOpen ? "p-0 pb-2 flex flex-col justify-center items-center w-full" : ""}`}>
          <AppSidebarFooter />
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}

