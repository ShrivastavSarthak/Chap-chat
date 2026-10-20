"use client";
import ChatInput from "@/src/components/chat/chat_input";
import ChatsScreen from "@/src/components/chat/chats_screen/chatScreen";
import Suggestions from "@/src/components/chat/suggestions/suggestions";
import { useAppSelector } from "@/src/utils/services/store/hook";

export function NewChatScreen() {
  const chat = useAppSelector((state) => state.chats);
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


