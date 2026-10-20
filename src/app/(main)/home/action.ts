"use server";
import {
  chats_url,
  user_url,
} from "@/src/utils/constants/apiConstants/api.url";
import { ChatInterface } from "@/src/utils/interface/chatInterface";
import {
  apiFetch,
  apiMethod,
} from "@/src/utils/services/api_services/apiFetch";
import { StringFormatService } from "@/src/utils/services/string_services/string_fromat_service";
import { cookies } from "next/headers";

export async function FetchUserDetails() {
  const authToken =
    (await cookies()).get("access_token") ||
    (await cookies()).get("auth_token");
  const id = (await cookies()).get("user_id");

  const res = id
    ? await apiFetch({
      method: apiMethod.GET,
      url: StringFormatService(user_url.userDetails, [id.value]),
      header: {
        Authorization: `Bearer ${authToken?.value}`,
      },
    })
    : null;

  return res;
}

export async function CreateChat(message: ChatInterface) {
  const res = await apiFetch({
    method: apiMethod.POST,
    url: ``,
    body: {
      model: "deepseek/deepseek-chat-v3.1",
      messages: [
        {
          role: "user",
          content: message.user,
        },
      ],
    },
    header: {
      Authorization: ``,
    },
  });

  return { id: message.id, res };
}

export async function ChatHistory() {
  const authToken =
    (await cookies()).get("access_token") ||
    (await cookies()).get("auth_token");

  const res = apiFetch({
    method: apiMethod.GET,
    url: chats_url.allChatHistory,
    header: {
      Authorization: `Bearer ${authToken?.value}`,
    },
  });
  return res;
}

export async function PerticularChatHistory(id: string) {
  const authToken =
    (await cookies()).get("access_token") ||
    (await cookies()).get("auth_token");

  const res = await apiFetch({
    method: apiMethod.GET,
    url: StringFormatService(chats_url.chatHistory, [id]),
    header: {
      Authorization: `Bearer ${authToken?.value}`,
    },
  });

  return res;
}

export async function SetExistingChat(id: string) {
  try {
    (await cookies()).set("chatId", id, {
      httpOnly: false,
      secure: true,
      sameSite: "strict",
      path: "/",
    });
    return true;
  } catch (error) {
    return false;
  }
}
