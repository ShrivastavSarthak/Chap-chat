import ChatScreen from "@/src/components/chat/chatScreen";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col min-h-0 flex-1">
      <ChatScreen chatId={id} />
    </div>
  );
}
