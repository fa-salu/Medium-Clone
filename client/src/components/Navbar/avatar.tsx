"use client";
import { useEffect } from "react";
import { Avatar, CircularProgress } from "@mui/material";
import { useSelector } from "react-redux";
import { fetchUserDetails } from "@/lib/features/authSlice";
import type { RootState } from "@/lib/store";
import { useAppDispatch } from "@/lib/hooks";
import Cookies from "js-cookie";
import Image from "next/image";

export default function AvatarComponent() {
  const dispatch = useAppDispatch();
  const { user, status } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const token = Cookies.get("user");
    if (token && status === "idle") {
      dispatch(fetchUserDetails());
    }
  }, [dispatch, status]);

  if (status === "loading") {
    return <CircularProgress size={30} />;
  }

  return (
    <Image
      alt={user?.name || "User Avatar"}
      src={user?.imageUri || "/default-avatar.jpg"}
      width={30}
      height={30}
      className="rounded-full"
    />
  );
}
