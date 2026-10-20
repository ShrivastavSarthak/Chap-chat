"use server";

import { auth_url } from "@/src/utils/constants/apiConstants/api.url";
import {
  apiFetch,
  apiMethod,
} from "@/src/utils/services/api_services/apiFetch";
import { cookies } from "next/headers";

export async function saveEmail(email: string) {
  const res = await apiFetch({
    method: apiMethod.POST,
    url: auth_url.otp,
    body: { email },
  });

  if (res.status === 200) {
    (await cookies()).set("token", res.data?.data, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 5,
    });
    (await cookies()).set("email", email, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 5,
    });
  }

  return res;
}

export async function verifyOtp(otp: string) {
  const cookieStore = await cookies();
  const email =
    cookieStore.get("email")?.value || cookieStore.get("user_email")?.value;

  if (!email) {
    return {
      status: 400,
      data: null,
      message: "Email session expired. Please sign in again.",
      error: true,
    };
  }

  const res = await apiFetch({
    method: apiMethod.POST,
    url: auth_url.verifyOtp,
    body: {
      email,
      otp,
    },
  });

  if (res.status === 200) {
    const accessToken =
      res.data?.access_token ||
      res.data?.data?.access_token ||
      res.data?.data?.token;
    const userId =
      res.data?.user_id ||
      res.data?.data?.user_id ||
      res.data?.data?.user?._id;

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "strict" as const,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    };

    if (accessToken) {
      cookieStore.set("access_token", accessToken, cookieOptions);
      cookieStore.set("auth_token", accessToken, cookieOptions);
    }
    if (userId) {
      cookieStore.set("user_id", userId, cookieOptions);
    }

    cookieStore.delete("token");
  }

  return res;
}

export async function resendOtp() {
  const cookieStore = await cookies();
  const email =
    cookieStore.get("email")?.value || cookieStore.get("user_email")?.value;

  if (!email) {
    return {
      status: 400,
      data: null,
      message: "Email session expired. Please sign in again.",
      error: true,
    };
  }

  const res = await apiFetch({
    method: apiMethod.POST,
    url: auth_url.createOtp,
    body: { email },
  });

  return res;
}

export async function getOtpEmail() {
  const cookieStore = await cookies();
  return (
    cookieStore.get("email")?.value ||
    cookieStore.get("user_email")?.value ||
    ""
  );
}

export async function createOtp(email: string) {
  return await apiFetch({
    method: apiMethod.POST,
    url: auth_url.createOtp,
    body: { email },
  });
}

export async function registerUser(email: string, name: string) {
  // 1. Trigger /auth/user
  const userRes = await apiFetch({
    method: apiMethod.POST,
    url: auth_url.user,
    body: { email, name },
  });

  if (userRes.status !== 200 || userRes.error) {
    return userRes;
  }

  // 2. When /auth/user hits successfully without error, trigger /otp/create
  const otpRes = await apiFetch({
    method: apiMethod.POST,
    url: auth_url.createOtp,
    body: { email },
  });

  if (otpRes.status !== 200 || otpRes.error) {
    return otpRes;
  }

  // 3. When /otp/create also hits successfully, store cookies
  const cookieStore = await cookies();
  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "strict" as const,
    path: "/",
    maxAge: 60 * 5, // 5 min — enough for the OTP flow
  };

  const userData = userRes.data?.data;

  // Store user data from the response
  cookieStore.set("user_id", userData?.id ?? "", cookieOptions);
  cookieStore.set("user_email", userData?.email ?? email, cookieOptions);
  cookieStore.set("email", userData?.email ?? email, cookieOptions);
  cookieStore.set("user_name", userData?.name ?? name, cookieOptions);
  cookieStore.set(
    "is_verified",
    String(userData?.isVerifiedEmail ?? false),
    cookieOptions,
  );

  return {
    status: 200,
    data: otpRes.data,
    message: otpRes.data?.message || "OTP sent successfully",
  };
}

export async function logoutUser() {
  const cookieStore = await cookies();

  const allCookies = cookieStore.getAll();
  for (const cookie of allCookies) {
    cookieStore.delete(cookie.name);
  }

  const knownCookies = [
    "access_token",
    "auth_token",
    "user_id",
    "user_email",
    "user_name",
    "email",
    "token",
    "is_verified",
    "chatId",
    "guestSessionId",
    "authjs.session-token",
    "__Secure-authjs.session-token",
    "next-auth.session-token",
    "__Secure-next-auth.session-token",
    "authjs.csrf-token",
    "authjs.callback-url",
  ];

  for (const name of knownCookies) {
    cookieStore.delete(name);
  }

  return { success: true };
}


