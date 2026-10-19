"use server";

import {
  apiFetch,
  apiMethod,
} from "@/src/utils/services/api_services/apiFetch";
import { cookies } from "next/headers";

export async function saveEmail(email: string) {
  const res = await apiFetch({
    method: apiMethod.POST,
    url: "/auth/otp",
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

export async function verifyOtp(Otp: string) {
  const token = (await cookies()).get("token");
  const email = (await cookies()).get("email");

  const res = await apiFetch({
    method: apiMethod.POST,
    url: "/auth/validate",
    body: {
      token: token?.value,
      email: email?.value,
      otp: Otp,
    },
  });

  if (res.status === 200) {
    (await cookies()).set("auth_token", res.data?.data?.token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    (await cookies()).set("user_id", res.data?.data?.user?._id, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    (await cookies()).delete("token");
    (await cookies()).delete("email");
  }

  return res;
}

export async function registerUser(email: string, name: string) {
  try {
    const res = await fetch("http://localhost:8000/auth/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name }),
    });

    const json = await res.json();

    if (res.ok && json?.status_code === 200) {
      const cookieStore = await cookies();
      const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: "strict" as const,
        path: "/",
        maxAge: 60 * 5, // 5 min — enough for the OTP flow
      };

      // Store user data from the response
      cookieStore.set("user_id", json.data?.id ?? "", cookieOptions);
      cookieStore.set("user_email", json.data?.email ?? "", cookieOptions);
      cookieStore.set("user_name", json.data?.name ?? "", cookieOptions);
      cookieStore.set(
        "is_verified",
        String(json.data?.isVerifiedEmail ?? false),
        cookieOptions,
      );

      return { status: 200, data: json };
    }

    return {
      status: res.status,
      data: json,
      message: json?.message || "Failed to register user",
      error: true,
    };
  } catch (err) {
    return {
      status: 500,
      data: null,
      message: err instanceof Error ? err.message : "Network error",
      error: true,
    };
  }
}
