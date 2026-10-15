import { headers, cookies } from "next/headers";
import { randomUUID } from "crypto";

export async function GET() {
  const headerList = await headers();
  const cookieStore = await cookies();

  const ip = headerList.get("x-forwarded-for")?.split(",")[0] || "unknown";

  const userAgent = headerList.get("user-agent") || "unknown";

  const guestSessionId = randomUUID();

  const session = {
    guestSessionId,
    ipAddress: ip,
    userAgent,
    loginAt: new Date(),
    lastActiveAt: new Date(),
  };

  // await GuestSession.create(session);

  cookieStore.set("guestSessionId", guestSessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  return Response.json({
    success: true,
  });
}
