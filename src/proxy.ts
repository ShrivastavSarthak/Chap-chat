// middleware.ts
import NextAuth from "next-auth";
import { authConfig } from "./app/auth.config"; // Edge-safe (no DB adapter)
import { NextResponse } from "next/server";

export const { auth: middlewareAuth } = NextAuth(authConfig);

export default middlewareAuth((req) => {
  const isLoggedIn = !!req.auth;
  const guestLogin = !!req.cookies.get("guestSessionId")?.value;

  const { pathname, origin } = req.nextUrl;

  const isLoginPage = pathname === "/";
  const isOtpPage = pathname === "/otp";
  const hasEmailCookie = !!req.cookies.get("user_email")?.value;

  // Guest users can only access guest routes
  if (guestLogin && !pathname.startsWith("/home/chat/guest")) {
    return NextResponse.redirect(new URL("/home/chat/guest", origin));
  }

  // Logged in users shouldn't see login page
  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL("/home/chat", origin));
  }

  // Allow OTP page if user has registered (email cookie exists)
  if (isOtpPage && hasEmailCookie) {
    return NextResponse.next();
  }

  // Anonymous users
  if (!isLoggedIn && !guestLogin && !isLoginPage) {
    return NextResponse.redirect(new URL("/", origin));
  }

  return NextResponse.next();
});
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api|.*\\..*).*)"],
};
