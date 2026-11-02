import { bot_url } from "@/src/utils/constants/apiConstants/api.url";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const cookieStore = await cookies();

    const userId =
      body.user_id ||
      cookieStore.get("user_id")?.value ||
      cookieStore.get("guestSessionId")?.value ||
      "guest";

    const userRole =
      body.user_role ||
      cookieStore.get("user_role")?.value ||
      (cookieStore.get("guestSessionId")?.value ? "guest" : "user");

    const message = body.message;

    if (!message) {
      return NextResponse.json(
        { detail: "Message is required" },
        { status: 400 },
      );
    }

    const backendBase =
      process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/+$/, "") ||
      "http://localhost:8000";
    const targetUrl = `${backendBase}${bot_url.response}`;

    const backendRes = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
      body: JSON.stringify({
        user_id: String(userId),
        user_role: String(userRole).toLowerCase(),
        message: String(message),
      }),
    });

    if (!backendRes.ok) {
      const errText = await backendRes.text();
      return new NextResponse(errText, {
        status: backendRes.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new NextResponse(backendRes.body, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { detail: error?.message || "Failed to communicate with bot service" },
      { status: 500 },
    );
  }
}
