"use client";

import Image from "next/image";
import { getAllUsers } from "@/lib/features/userSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import type { RootState } from "@/lib/store";
import React, { useEffect } from "react";
import { followUser, getFollowing } from "@/lib/features/followPeopleSlice";
import WhoToFollowSkelton from "../ui/skelton/whoToFollow";
import { useRouter } from "next/navigation";

export const WhoToFollow = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { userDetails, status: userStatus } = useAppSelector(
    (state: RootState) => state.userDetail
  );
  const owner = useAppSelector((state: RootState) => state.user.user?._id);
  const { following } = useAppSelector((state: RootState) => state.followUser);

  const users = Array.isArray(userDetails)
    ? userDetails.filter((user) => {
        return !following?.some(
          (followedUser) => followedUser.following._id === user._id
        );
      })
    : [];

  useEffect(() => {
    dispatch(getAllUsers());
    if (owner) {
      dispatch(getFollowing(owner));
    }
  }, [dispatch, owner]);

  const truncateBio = (bio: string, maxLength: number) => {
    if (!bio) return "No bio available";
    return bio.length > maxLength ? `${bio.slice(0, maxLength)}...` : bio;
  };

  const handleFollow = (userId: string) => {
    dispatch(followUser(userId)).then(() => {
      if (owner) {
        dispatch(getFollowing(owner));
      }
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Who to Follow</h3>
      {userStatus === "loading" ? (
        <>
          <WhoToFollowSkelton />
          <button
            type="button"
            onClick={() => router.push("/follow-users")}
            className="mt-4 text-sm text-black hover:underline"
          >
            Show More Topics
          </button>
        </>
      ) : (
        <>
          {users?.slice(0, 4).map((user) => (
            <div key={user._id} className="flex items-center space-x-4 p-4">
              {user.imageUri ? (
                <Image
                  src={user.imageUri}
                  alt={user.name}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                  style={{ width: "40px", height: "40px" }}
                />
              ) : (
                <div
                  className="w-12 h-12 bg-gray-300 rounded-full"
                  style={{ width: "40px", height: "40px" }}
                />
              )}

              <div className="flex-grow">
                <p className="text-sm">{user.name}</p>
                {user.bio && (
                  <p className="text-sm text-gray-500">
                    {truncateBio(user.bio, 35)}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleFollow(user._id)}
                className="border text-sm  px-2 py-1 rounded-lg hover:bg-black hover:text-white transition duration-300"
              >
                Follow
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => router.push("/follow-users")}
            className="mt-4 text-sm hover:underline"
          >
            All Users
          </button>
        </>
      )}
    </div>
  );
};
