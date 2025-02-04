"use server";

import axiosInstance from "@/utils/axios";
import { cookies } from "next/headers";

export async function handleGoogleLogin(userDetails: {
  name: string;
  email: string;
  imageUri: string;
}) {
  try {
    const response = await axiosInstance.post("/api/auth/login", userDetails);

    const { token, user } = response.data.data;

    (await cookies()).set("user", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      secure: true,
      sameSite: "strict",
    });

    return user;
  } catch (error) {
    console.error("Google login failed:", error);
    throw error;
  }
}
