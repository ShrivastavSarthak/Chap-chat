"use client";
import {
  useAppDispatch,
  useAppSelector,
} from "@/src/utils/services/store/hook";
import ChatInput from "./chat_input";
import ChatsScreen from "./chats_screen/chatScreen";
import Suggestions from "./suggestions/suggestions";
import { GetPerticularChatsData } from "@/src/utils/services/api_services/tankstack/chat";
import { useEffect } from "react";
import { setExistingChat } from "@/src/utils/services/store/slice/chat";

export default function ChatScreen({ chatId }: { chatId: string }) {
  const dispatch = useAppDispatch();
  const chat = useAppSelector((state) => state.chats);
  const { data } = GetPerticularChatsData(chatId);

  useEffect(() => {
    dispatch(setExistingChat(data?.data?.messages));
  }, [data, dispatch]);

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col flex-1 min-h-0">
      {/* Scrollable conversation or suggestions view */}
      <div className="relative w-full flex-1 min-h-0 flex flex-col overflow-hidden">
        {chat.length === 0 ? <Suggestions /> : <ChatsScreen />}
      </div>

      {/* Fixed Sticky Bottom Center Input Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-30 pointer-events-none flex flex-col items-center justify-end px-3 sm:px-6 pb-3 sm:pb-5 bg-gradient-to-t from-[#090A0F] via-[#090A0F]/95 to-transparent pt-12">
        <div className="w-full max-w-[800px] pointer-events-auto">
          <ChatInput />
        </div>
      </div>
    </div>
  );
}


