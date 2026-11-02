import { bot_url } from "@/src/utils/constants/apiConstants/api.url";
import { BotRequestInterface } from "@/src/utils/interface/chatInterface";

/**
 * Service to stream bot responses from the backend /bot/response endpoint.
 * Directly streams chunk by chunk using fetch + ReadableStream.
 */
export async function StreamBotResponse(
  body: BotRequestInterface,
  onChunk: (chunk: string) => void,
  signal?: AbortSignal,
): Promise<string> {
  const backendBase =
    process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/+$/, "") ||
    "http://localhost:8000";
  const directUrl = `${backendBase}${bot_url.response}`;

  let response: Response;

  try {
    response = await fetch(directUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
      body: JSON.stringify(body),
      signal,
    });
  } catch (directErr) {
    // If direct fetch fails (e.g. CORS or network error), try via Next.js proxy route
    try {
      response = await fetch("/api/bot/response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
        body: JSON.stringify(body),
        signal,
      });
    } catch {
      throw directErr;
    }
  }

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
        // use default message
      }
    }
    throw new Error(errMessage);
  }

  if (!response.body) {
    throw new Error("Response body is not readable");
  }

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
        onChunk(chunk);
      }
    }

    const finalChunk = decoder.decode();
    if (finalChunk) {
      accumulatedText += finalChunk;
      onChunk(finalChunk);
    }
  } finally {
    reader.releaseLock();
  }

  return accumulatedText;
}
