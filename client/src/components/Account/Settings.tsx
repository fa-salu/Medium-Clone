"use client";

import React, { useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import BlockIcon from "@mui/icons-material/Block";
import Image from "next/image";
import EditProfileDialog from "../ui/profileupdateDialoge";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import type { RootState } from "@/lib/store";
import { fetchUserDetails } from "@/lib/features/authSlice";
import { updateUserDetails } from "@/lib/features/profileUpdateSlice";

interface ProfileDetails {
  name: string;
  email: string;
  bio: string;
  imageUri: string;
}

export default function Settings() {
  const dispatch = useAppDispatch();
  const { user, status, error } = useAppSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchUserDetails());
    }
  }, [dispatch, status]);

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleFieldClick = () => {
    setDialogOpen(true);
  };

  const handleSave = (updatedProfile: ProfileDetails) => {
    dispatch(updateUserDetails(updatedProfile)).then(() => {
      dispatch(fetchUserDetails());
    });

    setDialogOpen(false);
  };

  return (
    <div className="flex flex-col items-center justify-center py-8 w-full max-w-xl mx-auto">
      <div className="relative">
        {user && (
          <Image
            src={user.imageUri}
            alt="Profile"
            width={150}
            height={150}
            className="w-32 h-32 rounded-full object-cover border-2 border-gray-300 cursor-pointer"
            onClick={handleFieldClick}
          />
        )}
      </div>

      <div className="mt-6 w-full px-4">
        <button
          type="button"
          className="flex justify-between items-center py-4 border-b w-full cursor-pointer"
          onClick={handleFieldClick}
        >
          <div className="flex flex-col items-start">
            <p className="text-sm text-gray-500">Name</p>
            <p className="text-lg font-medium">{user?.name || "Loading..."}</p>
          </div>
        </button>

        <div className="flex justify-between items-center py-4 border-b">
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-lg font-medium">{user?.email || "Loading..."}</p>
          </div>
          <IconButton disabled>
            <BlockIcon />
          </IconButton>
        </div>

        <button
          type="button"
          className="flex justify-between items-center py-4 border-b w-full cursor-pointer"
          onClick={handleFieldClick}
        >
          <div className="flex flex-col items-start">
            <p className="text-sm text-gray-500">Bio</p>
            <p className="text-lg font-medium">{user?.bio || "Loading..."}</p>
          </div>
        </button>
      </div>

      {user && (
        <EditProfileDialog
          open={dialogOpen}
          profile={user}
          onClose={() => setDialogOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
