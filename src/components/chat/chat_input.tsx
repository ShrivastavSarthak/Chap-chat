"use client";
import { GetUserCredentials, SetExistingChat } from "@/src/app/(main)/home/action";
import { Button } from "@/src/lib/components/ui/button";
import { Textarea } from "@/src/lib/components/ui/textarea";
import { ChatInterface } from "@/src/utils/interface/chatInterface";
import { StreamBotResponse } from "@/src/utils/services/api_services/botService";
import { SendUserChatResponse } from "@/src/utils/services/api_services/chatService";
import { generateUUIDv4 } from "@/src/utils/services/uuid_services/uuid_service";
import {
  useAppDispatch,
  useAppSelector,
} from "@/src/utils/services/store/hook";
import {
  addChat,
  updateStreamingChunk,
} from "@/src/utils/services/store/slice/chat";
import { setChatLoading } from "@/src/utils/services/store/slice/loading";
import { setUserData } from "@/src/utils/services/store/slice/user";
import { useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { Loader2, Sparkles } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { FaArrowUp } from "react-icons/fa";
import { toast } from "sonner";

interface ChatInputProps {
  chatId?: string;
}

export default function ChatInput({ chatId: propChatId }: ChatInputProps = {}) {
  const [isInput, setIsInput] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.loading.chatLoading);
  const user = useAppSelector((state) => state.user);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const params = useParams();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const routeChatId =
    typeof params?.id === "string"
      ? params.id
      : Array.isArray(params?.id)
      ? params.id[0]
      : "";

  const activeChatIdRef = useRef<string>(propChatId || routeChatId || "");

  useEffect(() => {
    if (propChatId) {
      activeChatIdRef.current = propChatId;
    } else if (routeChatId) {
      activeChatIdRef.current = routeChatId;
    } else if (pathname === "/home/chat" && !Cookies.get("chatId")) {
      activeChatIdRef.current = "";
    }
  }, [propChatId, routeChatId, pathname]);

  // Listen to suggestions clicks
  useEffect(() => {
    const handleCustomPrompt = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        setIsInput(customEvent.detail);
        textareaRef.current?.focus();
      }
    };
    window.addEventListener("chapchat:set-prompt", handleCustomPrompt);
    return () => {
      window.removeEventListener("chapchat:set-prompt", handleCustomPrompt);
    };
  }, []);

  const handleChat = async () => {
    if (!isInput.trim() || isLoading || isStreaming) return;

    const messageText = isInput.trim();
    const messageId = generateUUIDv4();

    // 1. Resolve user_id and user_role
    let userId = user?.id || Cookies.get("user_id") || "";
    let userRole = (
      user?.role ||
      (user?.userType === "GUEST" ? "guest" : user?.userType === "USER" ? "user" : "") ||
      Cookies.get("user_role") ||
      ""
    ).toLowerCase();

    if (!userId || !userRole) {
      try {
        const creds = await GetUserCredentials();
        if (creds?.userId) {
          userId = creds.userId;
        }
        if (creds?.userRole) {
          userRole = creds.userRole.toLowerCase();
        }
        if (creds?.userId) {
          dispatch(
            setUserData({
              ...user,
              id: creds.userId,
              role: creds.userRole || userRole,
              userType:
                creds.userRole === "guest" || userRole === "guest"
                  ? "GUEST"
                  : "USER",
              name: creds.userName || user.name || "Guest",
              email: creds.userEmail || user.email || "",
            }),
          );
        }
      } catch (e) {
        console.error("Failed to retrieve user session:", e);
      }
    }

    if (!userId) {
      userId = generateUUIDv4();
    }
    if (!userRole) {
      userRole = Cookies.get("guestSessionId") ? "guest" : "user";
    }

    const isGuest =
      userRole === "guest" ||
      user?.userType === "GUEST" ||
      (!user?.id && !!Cookies.get("guestSessionId"));
    const isUserRole = !isGuest;

    // Resolve chatId for user role
    let isNewChat = false;
    let currentChatId =
      activeChatIdRef.current ||
      propChatId ||
      routeChatId ||
      Cookies.get("chatId") ||
      "";

    if (isUserRole && !currentChatId) {
      // Create UUID 4 from frontend service for the new chat session
      currentChatId = generateUUIDv4();
      activeChatIdRef.current = currentChatId;
      isNewChat = true;
    }

    try {
      // 2. Add user message to Redux chat list
      const input: ChatInterface = {
        id: messageId,
        user: messageText,
        assistant: [],
      };

      dispatch(addChat(input));
      setIsInput("");
      dispatch(setChatLoading(true));
      setIsStreaming(true);

      // 3. Call API based on role
      let hasReceivedFirstChunk = false;

      if (isUserRole) {
        // User role endpoint: /chat/user/resp
        await SendUserChatResponse(
          {
            userId,
            query: messageText,
            chatId: currentChatId,
          },
          (chunk: string) => {
            if (!hasReceivedFirstChunk) {
              hasReceivedFirstChunk = true;
              dispatch(setChatLoading(false));
            }
            dispatch(
              updateStreamingChunk({
                id: messageId,
                chunk,
              }),
            );
          },
        );

        // After one successful chat, append chatId in the URL without noticing to the user
        if (isNewChat && currentChatId) {
          Cookies.set("chatId", currentChatId);
          SetExistingChat(currentChatId).catch(() => {});
          if (typeof window !== "undefined") {
            window.history.replaceState(null, "", `/home/chat/${currentChatId}`);
          }
        }

        // Refresh recent chat history in sidebar
        try {
          queryClient.invalidateQueries({ queryKey: ["FETCH_CHAT_HISTORY"] });
        } catch {
          // ignore cache invalidation errors
        }
      } else {
        // Guest role endpoint: /chat/guest/response
        await StreamBotResponse(
          {
            user_id: userId,
            user_role: userRole,
            message: messageText,
          },
          (chunk: string) => {
            if (!hasReceivedFirstChunk) {
              hasReceivedFirstChunk = true;
              dispatch(setChatLoading(false));
            }
            dispatch(
              updateStreamingChunk({
                id: messageId,
                chunk,
              }),
            );
          },
        );
      }
    } catch (err: any) {
      console.error("Chat streaming error:", err);
      toast.error(err?.message || "Something went wrong, please try again");
    } finally {
      dispatch(setChatLoading(false));
      setIsStreaming(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter (without Shift) OR Ctrl+Enter / Meta+Enter
    if (
      (e.key === "Enter" && !e.shiftKey) ||
      (e.key === "Enter" && (e.ctrlKey || e.metaKey))
    ) {
      e.preventDefault();
      handleChat();
    }
  };

  const isBusy = isLoading || isStreaming;

  return (
    <div className="w-full max-w-[780px] flex flex-col items-center px-1">
      {/* Floating Glassmorphic Input Container */}
      <div className="relative w-full rounded-2xl sm:rounded-3xl bg-zinc-900/80 backdrop-blur-2xl border border-white/10 focus-within:border-[#FF6D1F]/60 focus-within:ring-2 focus-within:ring-[#FF6D1F]/20 p-3 sm:p-4 shadow-[0_10px_40px_rgba(0,0,0,0.5)] transition-all duration-300">
        {/* Subtle Ambient Top Hairline Accent */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-[#FF6D1F]/40 to-transparent pointer-events-none"
        />

        <Textarea
          ref={textareaRef}
          placeholder="Ask Chap-Chat anything or prompt an idea..."
          className="w-full bg-transparent border-0 resize-none text-sm sm:text-base text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-0 leading-relaxed font-normal p-1 max-h-[140px] min-h-[50px] shadow-none overflow-y-auto"
          rows={1}
          value={isInput}
          onChange={(e) => setIsInput(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={isStreaming}
        />

        {/* Input Bottom Toolbar */}
        <div className="w-full flex justify-between items-center mt-2 pt-2 border-t border-white/5">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-[11px] font-medium text-zinc-300">
              <Sparkles className="w-3 h-3 text-[#FF6D1F]" />
              <span>Chap-Chat AI</span>
            </div>
            <span className="text-[11px] text-zinc-400 hidden sm:inline">
              Enter to send, Shift + Enter for new line
            </span>
          </div>

          <Button
            disabled={isBusy || !isInput.trim()}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-r from-[#FF6D1F] to-[#FF853E] hover:from-[#ff7930] hover:to-[#ff5c00] text-white shadow-[0_2px_12px_rgba(255,109,31,0.35)] hover:shadow-[0_4px_18px_rgba(255,109,31,0.5)] disabled:opacity-25 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center p-0 cursor-pointer active:scale-95"
            variant="default"
            type="button"
            onClick={handleChat}
          >
            {isBusy ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <FaArrowUp className="w-3.5 h-3.5 text-white" />
            )}
          </Button>
        </div>
      </div>

      {/* Trust & Safety Disclaimer */}
      <p className="text-[11px] text-zinc-400 text-center select-none mt-2 pb-1">
        Chap-Chat can make mistakes. Please verify critical responses.
      </p>
    </div>
  );
}

