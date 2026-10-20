// middleware.ts
import NextAuth from "next-auth";
import { authConfig } from "./app/auth.config"; // Edge-safe (no DB adapter)
import { NextResponse } from "next/server";

export const { auth: middlewareAuth } = NextAuth(authConfig);

export default middlewareAuth((req) => {
  const { pathname, origin } = req.nextUrl;

  const hasToken =
    !!req.cookies.get("access_token")?.value ||
    !!req.cookies.get("auth_token")?.value ||
    !!req.auth?.user ||
    !!(req.auth as { email?: string } | null)?.email;
  const guestLogin = !!req.cookies.get("guestSessionId")?.value;
  const hasEmailCookie =
    !!(req.cookies.get("user_email")?.value || req.cookies.get("email")?.value);

  const isLoginPage = pathname === "/";
  const isOtpPage = pathname === "/otp";

  // 1. Authenticated users (regular token or guest session)
  if (hasToken || guestLogin) {
    if (isLoginPage || isOtpPage || pathname === "/home") {
      return NextResponse.redirect(new URL("/home/chat", origin));
    }
    return NextResponse.next();
  }

  // 3. User is not logged in:
  // Allow OTP page only if email was entered; otherwise redirect to login page
  if (isOtpPage) {
    if (hasEmailCookie) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/", origin));
  }

  // Allow login page for unauthenticated users
  if (isLoginPage) {
    return NextResponse.next();
  }

  // Any other protected route (e.g. /home, /home/chat): redirect to login page
  return NextResponse.redirect(new URL("/", origin));
});
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api|.*\\..*).*)"],
};

