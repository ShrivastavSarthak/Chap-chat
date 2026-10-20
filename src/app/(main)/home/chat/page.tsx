import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NewChatScreen } from "@/src/components/chat/chats_screen/newChatScreen";
import ChatWatcher from "@/src/components/chat/chats_screen/chatWatcher";

export default async function NewChatPage() {
  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col min-h-0 flex-1">
      <NewChatScreen />
      <ChatWatcher />
    </div>
  );
}
