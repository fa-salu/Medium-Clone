"use client";

import Image from "next/image";
import { Button } from "@mui/material";
import { getAllUsers } from "@/lib/features/userSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import type { RootState } from "@/lib/store";
import React, { useEffect } from "react";
import { followUser, getFollowing } from "@/lib/features/followPeopleSlice";
import WhoToFollowSkelton from "../ui/skelton/whoToFollow";

export const WhoToFollow = () => {
  const dispatch = useAppDispatch();
  const { userDetails, status, error } = useAppSelector(
    (state: RootState) => state.userDetail
  );
  const owner = useAppSelector((state: RootState) => state.user.user?._id);
  const { following, loading } = useAppSelector(
    (state: RootState) => state.followUser
  );

  const users = userDetails.filter((user) => {
    return !following.some(
      (followedUser) => followedUser.following._id === user._id
    );
  });

  useEffect(() => {
    if (owner) {
      dispatch(getAllUsers());
      dispatch(getFollowing(owner));
    }
  }, [dispatch, owner]);

  const truncateBio = (bio: string, maxLength: number) => {
    if (!bio) return "No bio available";
    return bio.length > maxLength ? `${bio.slice(0, maxLength)}...` : bio;
  };

  const handleFollow = (userId: string) => {
    dispatch(followUser(userId));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Who to Follow</h3>
      {loading ? (
        <WhoToFollowSkelton />
      ) : (
        users?.slice(0, 4).map((user) => (
          <div key={user._id} className="flex items-center space-x-4 p-4">
            {user.imageUri ? (
              <Image
                src={user.imageUri}
                alt={user.name}
                width={50}
                height={50}
                className="rounded-full object-cover"
                style={{ width: "50px", height: "50px" }}
              />
            ) : (
              <div
                className="w-12 h-12 bg-gray-300 rounded-full"
                style={{ width: "50px", height: "50px" }}
              />
            )}

            <div className="flex-grow">
              <h3 className="text-sm">{user.name}</h3>
              {user.bio && (
                <p className="text-sm text-gray-600">
                  {truncateBio(user.bio, 50)}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => handleFollow(user._id)}
              className="border border-black text-black px-2 py-2 rounded-lg hover:bg-black hover:text-white transition duration-300"
            >
              Follow
            </button>
          </div>
        ))
      )}
    </div>
  );
};
