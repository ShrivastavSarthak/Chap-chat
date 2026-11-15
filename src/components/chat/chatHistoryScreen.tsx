"use client";
import {
  useAppDispatch,
  useAppSelector,
} from "@/src/utils/services/store/hook";
import ChatInput from "./chat_input";
import ChatsScreen from "./chats_screen/chatScreen";
import Suggestions from "./suggestions/suggestions";
import { useEffect, useRef, useState } from "react";
import {
  resetChats,
  setExistingChat,
} from "@/src/utils/services/store/slice/chat";
import { ChatInterface } from "@/src/utils/interface/chatInterface";
import { GetChatHistoryById } from "@/src/utils/services/api_services/chatService";
import { SetExistingChat } from "@/src/app/(main)/home/action";

export default function ChatHistoryScreen({ chatId }: { chatId: string }) {
  const dispatch = useAppDispatch();
  const chat = useAppSelector((state) => state.chats);
  const [isLoading, setIsLoading] = useState(chat.length === 0);
  const activeChatIdRef = useRef<string>(chatId);

  useEffect(() => {
    if (!chatId) return;

    let isMounted = true;

    const fetchChatHistory = async () => {
      // If switching to a different chat ID, reset chats and show loading
      if (activeChatIdRef.current !== chatId) {
        activeChatIdRef.current = chatId;
        setIsLoading(true);
        dispatch(resetChats());
      } else if (chat.length === 0) {
        setIsLoading(true);
      }

      try {
        // Run action without blocking history fetch if it fails
        await SetExistingChat(chatId).catch(() => { });

        const res = await GetChatHistoryById(chatId);
        if (!isMounted) return;

        // Backend response format: { message: "Success", status: 200, data: [ ... ] }
        const raw: any[] =
          (Array.isArray(res?.data) && res.data) ||
          (Array.isArray(res?.data?.data) && res.data.data) ||
          (Array.isArray(res) && res) ||
          (Array.isArray(res?.messages) && res.messages) ||
          (Array.isArray(res?.chats) && res.chats) ||
          (res?.data && typeof res.data === "object" ? [res.data] : []);

        if (raw.length > 0) {
          const matchedChat = raw.find(
            (item: any) =>
              String(item.id) === String(chatId) ||
              String(item._id) === String(chatId) ||
              String(item.chatId) === String(chatId) ||
              String(item.chat_id) === String(chatId),
          );

          let messagesToFormat: any[] = [];

          if (
            matchedChat &&
            Array.isArray(matchedChat.messages) &&
            matchedChat.messages.length > 0
          ) {
            messagesToFormat = matchedChat.messages;
          } else if (
            matchedChat &&
            raw.length > 1 &&
            raw.some(
              (item: any) =>
                String(item.id) !== String(chatId) &&
                !item.title &&
                !item.message &&
                !item.user &&
                !item.userResponse,
            )
          ) {
            messagesToFormat = [matchedChat];
          } else {
            messagesToFormat = raw;
          }

          const formatted: ChatInterface[] = messagesToFormat.map(
            (item: any, i: number) => {
              if (item.user !== undefined || item.assistant !== undefined) {
                return {
                  id: item.id || item._id || String(i),
                  user: item.user || item.title || "",
                  assistant: item.assistant || item.response || [],
                };
              }
              if (item.role) {
                return {
                  id: item.id || item._id || String(i),
                  user:
                    item.role === "user"
                      ? item.content || item.message || ""
                      : "",
                  assistant:
                    item.role === "assistant"
                      ? item.content || item.message || ""
                      : [],
                };
              }
              return {
                id: item.id || item._id || String(i),
                user:
                  item.userResponse ||
                  item.title ||
                  item.query ||
                  item.prompt ||
                  item.message ||
                  "",
                assistant:
                  item.agentResponse ||
                  item.assistant ||
                  item.response ||
                  item.answer ||
                  [],
              };
            },
          );

          dispatch(setExistingChat(formatted));
        }
      } catch (err) {
        console.error("Failed to fetch chat history:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchChatHistory();

    return () => {
      isMounted = false;
    };
  }, [chatId, dispatch]);

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col flex-1 min-h-0">
      {/* Wait for GetChatHistoryById() to finish before rendering content */}
      <div className="relative w-full flex-1 min-h-0 flex flex-col overflow-hidden">
        {isLoading ? (
          <div className="flex flex-1 items-center justify-center text-sm text-gray-400">
            Loading conversation...
          </div>
        ) : chat.length === 0 ? (
          <Suggestions />
        ) : (
          <ChatsScreen />
        )}
      </div>

      {/* Fixed Sticky Bottom Center Input Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-30 pointer-events-none flex flex-col items-center justify-end px-3 sm:px-6 pb-3 sm:pb-5 bg-gradient-to-t from-[#090A0F] via-[#090A0F]/95 to-transparent pt-12">
        <div className="w-full max-w-[800px] pointer-events-auto">
          <ChatInput chatId={chatId} />
        </div>
      </div>
    </div>
  );
}