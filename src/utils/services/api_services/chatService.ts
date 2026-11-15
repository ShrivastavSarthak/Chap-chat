import { chats_url } from "@/src/utils/constants/apiConstants/api.url";
import { UserChatRequestInterface } from "@/src/utils/interface/chatInterface";
import { StringFormatService } from "@/src/utils/services/string_services/string_fromat_service";

/**
 * API function to fetch chat history by chatId.
 * Endpoint: GET http://localhost:8000/chat/history/{chatId}
 * Header: accept: application/json or * / *
 */
export async function GetChatHistoryById(chatId: string) {
  const backendBase =
    process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/+$/, "") ||
    "http://localhost:8000";

  const endpoint = StringFormatService(chats_url.chatHistory, [chatId]);
  const directUrl = `${backendBase}${endpoint}`;

  let authToken = "";
  if (typeof document !== "undefined") {
    const match = document.cookie.match(
      /(?:^|;\s*)(?:access_token|auth_token)=([^;]+)/,
    );
    if (match) authToken = decodeURIComponent(match[1]);
  }

  const headers: Record<string, string> = {
    accept: "*/*",
  };
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const response = await fetch(directUrl, {
    method: "GET",
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    let errMessage = `Error ${response.status}: ${response.statusText}`;
    try {
      const errJson = await response.json();
      if (errJson?.message) {
        errMessage = errJson.message;
      } else if (errJson?.detail) {
        errMessage =
          typeof errJson.detail === "string"
            ? errJson.detail
            : JSON.stringify(errJson.detail);
      }
    } catch {
      try {
        const text = await response.text();
        if (text) errMessage = text;
      } catch {
        // default message
      }
    }
    throw new Error(errMessage);
  }

  return await response.json();
}

/**
 * API function to send user chat message and receive assistant response.
 * Endpoint: POST http://localhost:8000/chat/user/resp
 * Header:
 *   accept: * /*
 *   Content-Type: application/json
 *   Authorization: Bearer <authToken> (if available)
 * Body:
 *   { userId: string, query: string, chatId: string }
 */
export async function SendUserChatResponse(
  body: UserChatRequestInterface,
  onChunk?: (chunk: string) => void,
  signal?: AbortSignal,
): Promise<string> {
  const backendBase =
    process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/+$/, "") ||
    "http://localhost:8000";

  const directUrl = `${backendBase}${chats_url.userResponse}`;

  let authToken = "";
  if (typeof document !== "undefined") {
    const match = document.cookie.match(
      /(?:^|;\s*)(?:access_token|auth_token)=([^;]+)/,
    );
    if (match) authToken = decodeURIComponent(match[1]);
  }

  const headers: Record<string, string> = {
    accept: "*/*",
    "Content-Type": "application/json",
  };
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const response = await fetch(directUrl, {
    method: "POST",
    headers,
    credentials: "include",
    body: JSON.stringify(body),
    signal,
  });

  if (!response.ok) {
    let errMessage = `Error ${response.status}: ${response.statusText}`;
    try {
      const errJson = await response.json();
      if (errJson?.detail) {
        errMessage =
          typeof errJson.detail === "string"
            ? errJson.detail
            : JSON.stringify(errJson.detail);
      } else if (errJson?.message) {
        errMessage = errJson.message;
      }
    } catch {
      try {
        const text = await response.text();
        if (text) errMessage = text;
      } catch {
        // default message
      }
    }
    throw new Error(errMessage);
  }

  if (!response.body) {
    return "";
  }

  const contentType = response.headers.get("content-type") || "";

  // If response is application/json, parse and handle JSON content
  if (contentType.includes("application/json")) {
    const text = await response.text();
    let answer = text;
    try {
      const json = JSON.parse(text);
      if (json && typeof json === "object") {
        answer =
          json.response ||
          json.data?.response ||
          json.content ||
          json.message ||
          json.data?.message ||
          (typeof json.data === "string" ? json.data : "") ||
          text;
      }
    } catch {
      // ignore JSON parse error
    }

    if (onChunk && answer) {
      onChunk(answer);
    }
    return answer;
  }

  // If streaming text / ReadableStream
  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let accumulatedText = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      if (chunk) {
        accumulatedText += chunk;
        if (onChunk) {
          onChunk(chunk);
        }
      }
    }

    const finalChunk = decoder.decode();
    if (finalChunk) {
      accumulatedText += finalChunk;
      if (onChunk) {
        onChunk(finalChunk);
      }
    }
  } finally {
    reader.releaseLock();
  }

  return accumulatedText;
}

/**
 * Aliases for GetChatHistoryById
 */
export const FetchChatHistory = GetChatHistoryById;
export const fetchChatHistoryById = GetChatHistoryById;

/**
 * Aliases for SendUserChatResponse
 */
export const PostUserChatResponse = SendUserChatResponse;
export const StreamUserChatResponse = SendUserChatResponse;
export const UserChatResp = SendUserChatResponse;
