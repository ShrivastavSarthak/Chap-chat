import { NewChatScreen } from "@/src/components/chat/chats_screen/newChatScreen";

export default async function NewChatPage() {
  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col min-h-0 flex-1">
      <NewChatScreen />
    </div>
  );
}
