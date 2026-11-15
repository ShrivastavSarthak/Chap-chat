import {
  ChatHistory,
  PerticularChatHistory,
  UserChatResponse,
} from "@/src/app/(main)/home/action";
import { useMutation, useQuery } from "@tanstack/react-query";

export function GetChatHistory(userId?: string) {
  return useQuery({
    queryKey: ["FETCH_CHAT_HISTORY", userId],
    queryFn: () => ChatHistory(userId),
    enabled: true,
  });
}

export function GetPerticularChatsData(id: string) {
  return useQuery({
    queryKey: ["FETCH_CHAT_DATA", id],
    queryFn: () => PerticularChatHistory(id),
    enabled: !!id,
  });
}

export function useSendUserChat() {
  return useMutation({
    mutationFn: (payload: { userId: string; query: string; chatId: string }) =>
      UserChatResponse(payload),
  });
}
