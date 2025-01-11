"use client";

import Image from "next/image";
import { Button, Drawer, IconButton } from "@mui/material";
import { useAppDispatch } from "@/lib/hooks";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import { useEffect, useState } from "react";
import { fetchUserDetails } from "@/lib/features/authSlice";
import Link from "next/link";
import AuthorDetailsSkeleton from "../ui/skelton/authorDeatails";
import MenuIcon from "@mui/icons-material/Menu";

export default function AuthorDetails() {
  const dispatch = useAppDispatch();
  const { user, status, error } = useSelector((state: RootState) => state.user);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      dispatch(fetchUserDetails());
    }
  }, [dispatch, user]);

  const isLoading = status === "loading";

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  if (status === "failed" || error) {
    return <p>Error: {error}</p>;
  }

  const authorDetailsContent = (
    <div className="space-y-4 p-6">
      <div className="items-center space-y-3 text-center">
        {user ? (
          <>
            <div className="relative w-24 h-24 mx-auto">
              <Image
                src={user.imageUri}
                alt={user.name}
                layout="fill"
                objectFit="cover"
                className="rounded-full bg-gray-500"
              />
            </div>
            <p className="text-lg font-semibold">{user.name}</p>
            <Link href={"/me/settings/account"}>
              <Button
                sx={{
                  color: "green",
                  fontSize: "0.75rem",
                }}
              >
                Edit Profile
              </Button>
            </Link>
            <p>{user.bio}</p>
          </>
        ) : (
          <p>No user details available</p>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className="sm:hidden fixed top-18 right-4 z-50">
        <IconButton
          aria-label="open drawer"
          onClick={toggleDrawer(true)}
          className="text-black"
        >
          <MenuIcon />
        </IconButton>
      </div>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        className="sm:hidden"
      >
        {isLoading ? (
          <AuthorDetailsSkeleton />
        ) : (
          <div className="w-80">{authorDetailsContent}</div>
        )}
      </Drawer>

      <div className="hidden sm:block">
        {isLoading ? <AuthorDetailsSkeleton /> : authorDetailsContent}
      </div>
    </>
  );
}
