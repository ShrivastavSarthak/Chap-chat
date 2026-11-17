"use client";
import { media } from "@/public";
import { ClearExistingChat, SetExistingChat } from "@/src/app/(main)/home/action";
import { GetChatHistory } from "@/src/utils/services/api_services/tankstack/chat";
import { useAppDispatch, useAppSelector } from "@/src/utils/services/store/hook";
import { resetChats } from "@/src/utils/services/store/slice/chat";
import Cookies from "js-cookie";
import { MessageSquare } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";
import { LuMessageCirclePlus } from "react-icons/lu";
import { TbLayoutSidebarLeftExpand } from "react-icons/tb";
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
  const dispatch = useAppDispatch();
  const navigate = useRouter();
  const pathname = usePathname();
  const user = useAppSelector((state) => state.user);
  const { open, isMobile, toggleSidebar } = useSidebar();

  // Always keep sidebar open if mobile
  const isOpen = isMobile ? true : open;

  const resolvedUserId =
    user?.id ||
    Cookies.get("user_id") ||
    Cookies.get("guestSessionId") ||
    "";

  const { data, isLoading } = GetChatHistory(resolvedUserId);

  const chatList = useMemo(() => {
    if (!data?.data) return [];
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.data?.chats)) return data.data.chats;
    if (Array.isArray(data.data?.data)) return data.data.data;
    if (Array.isArray(data.data?.data?.chats)) return data.data.data.chats;
    if (Array.isArray((data.data as any)?.result)) return (data.data as any).result;
    if (Array.isArray((data.data as any)?.history)) return (data.data as any).history;
    return [];
  }, [data]);

  const handleNewChat = async () => {
    Cookies.remove("chatId");
    await ClearExistingChat().catch(() => {});
    dispatch(resetChats());
    navigate.push("/home/chat");
  };

  const handleSelectChat = (chatId: string) => {
    Cookies.set("chatId", chatId);
    SetExistingChat(chatId).catch(() => {});
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent
        className={`bg-[#0B0D13] border-r border-white/10 ${
          !isOpen ? "w-20 px-3 py-6 items-center" : "w-64 p-4"
        } flex flex-col h-screen text-zinc-200 transition-all duration-300`}
      >
        <SidebarHeader className={`w-full ${!isOpen ? "p-0 flex flex-col items-center" : "pb-2"}`}>
          {isOpen ? (
            <div className="w-full flex flex-row justify-between items-center">
              <div className="flex items-center justify-center">
                <Image
                  src={media.CCLogoBlue}
                  width={140}
                  height={40}
                  alt="Chap-Chat Logo"
                  className="object-contain filter drop-shadow-[0_2px_8px_rgba(255,109,31,0.2)]"
                />
              </div>
              <div className="flex items-center justify-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <SidebarTrigger className="size-9 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all cursor-pointer" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={12} className="bg-zinc-900 border border-white/10 text-white font-medium text-xs px-3 py-1.5 rounded-lg shadow-xl">
                    Collapse Sidebar
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          ) : (
            /* When collapsed: Hovering over the logo toggles to the expand sidebar button */
            <div className="flex flex-col items-center justify-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={toggleSidebar}
                    aria-label="Expand Sidebar"
                    className="relative group size-11 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-[#FF6D1F]/50 flex items-center justify-center shadow-sm transition-all duration-200 cursor-pointer overflow-hidden"
                  >
                    {/* Chap-Chat short logo visible by default, fades out on hover */}
                    <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-200 group-hover:opacity-0 pointer-events-none">
                      <Image
                        src={media.CCShortLogo}
                        width={26}
                        height={26}
                        alt="Chap-Chat Logo"
                        className="object-contain filter drop-shadow-[0_2px_8px_rgba(255,109,31,0.3)]"
                      />
                    </div>

                    {/* Expand icon toggles into view on hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/[0.08] text-[#FF6D1F] pointer-events-none">
                      <TbLayoutSidebarLeftExpand className="size-5 shrink-0 transition-transform duration-200 group-hover:scale-110" />
                    </div>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={12} className="bg-zinc-900 border border-white/10 text-white font-medium text-xs px-3 py-1.5 rounded-lg shadow-xl">
                  Expand Sidebar
                </TooltipContent>
              </Tooltip>
            </div>
          )}
          {!isOpen && (
            <div className="w-8 h-[1px] bg-white/10 my-3 rounded-full" />
          )}
        </SidebarHeader>

        <SidebarGroup className={`flex flex-col flex-1 overflow-hidden min-h-0 ${!isOpen ? "p-0 items-center w-full" : "pt-2"}`}>
          <SidebarGroupContent className="flex-1 flex flex-col items-center w-full overflow-hidden min-h-0">
            {/* New Chat Button */}
            <SidebarMenu className={`w-full flex flex-col shrink-0 ${!isOpen ? "items-center gap-3" : "gap-2"}`}>
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

            {/* Chat history: Only rendered and scrollable when sidebar is expanded */}
            {isOpen && (
              <>
                <div className="w-full border-t border-white/5 my-3 shrink-0" />

                <div className="w-full flex-1 min-h-0 overflow-y-auto overflow-x-hidden chat-sidebar-scroll flex flex-col pr-1">
                  <div className="px-2 pb-1.5 text-[10px] font-semibold tracking-wider text-zinc-500 uppercase select-none">
                    Recent Chats
                  </div>

                  {isLoading && chatList.length === 0 && (
                    <div className="flex flex-col gap-2 px-1 py-1">
                      {[1, 2, 3, 4].map((n) => (
                        <div
                          key={n}
                          className="h-9 w-full rounded-xl bg-white/[0.03] animate-pulse"
                        />
                      ))}
                    </div>
                  )}

                  {!isLoading && chatList.length === 0 && (
                    <div className="px-3 py-6 text-center text-xs text-zinc-500 select-none">
                      No previous chats
                    </div>
                  )}

                  <div className="flex flex-col gap-1 w-full pb-2">
                    {chatList.map((chat: any, index: number) => {
                      // Uses the id from the response (chat.id first) as requested
                      const chatId =
                        chat.id ??
                        chat._id ??
                        chat.chatId ??
                        chat.chat_id ??
                        (typeof chat === "string" ? chat : String(index));

                      const title =
                        chat.title ||
                        chat.name ||
                        chat.chat_name ||
                        (Array.isArray(chat.messages) && (chat.messages[0]?.user || chat.messages[0]?.content)) ||
                        "Untitled Chat";

                      const isActive =
                        pathname === `/home/chat/${chatId}` ||
                        pathname.endsWith(`/${chatId}`);

                      return (
                        <Link
                          key={chatId || index}
                          href={`/home/chat/${chatId}`}
                          onClick={() => handleSelectChat(chatId)}
                          className={`w-full group px-3 py-2.5 rounded-xl flex items-center gap-2.5 text-xs text-left transition-all duration-150 cursor-pointer ${
                            isActive
                              ? "bg-[#FF6D1F]/15 border border-[#FF6D1F]/30 text-white font-medium shadow-sm"
                              : "border border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06]"
                          }`}
                        >
                          <MessageSquare
                            className={`size-3.5 shrink-0 ${
                              isActive
                                ? "text-[#FF6D1F]"
                                : "text-zinc-500 group-hover:text-zinc-300"
                            }`}
                          />
                          <span className="truncate flex-1">{title}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
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
