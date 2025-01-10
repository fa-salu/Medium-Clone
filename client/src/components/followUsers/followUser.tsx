"use client";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import type { RootState } from "@/lib/store";
import { Button } from "@mui/material";
import { useEffect } from "react";
import { followUser, getFollowing } from "@/lib/features/followPeopleSlice";
import { getAllUsers } from "@/lib/features/userSlice";
import Image from "next/image";
import UsersToFollowSkeleton from "../ui/skelton/followUserPage";

export default function FollowUsers() {
  const dispatch = useAppDispatch();
  const { userDetails, status: usersStatus } = useAppSelector(
    (state: RootState) => state.userDetail
  );
  const userId = useAppSelector((state: RootState) => state.user.user?._id);
  const { following } = useAppSelector((state: RootState) => state.followUser);

  useEffect(() => {
    dispatch(getAllUsers());
    if (userId) {
      dispatch(getFollowing(userId));
    }
  }, [dispatch, userId]);

  const handleFollow = (targetUserId: string) => {
    dispatch(followUser(targetUserId)).then(() => {
      if (userId) {
        dispatch(getFollowing(userId));
      }
    });
  };

  const isUserFollowing = (targetUserId: string) => {
    return following?.some(
      (followedUser) => followedUser.following._id === targetUserId
    );
  };

  return (
    <div className="py-12">
      <div className="flex flex-col items-center">
        <h1 className="text-3xl border-b py-2">Users to Follow</h1>

        {usersStatus === "loading" ? (
          <div>
            <UsersToFollowSkeleton />
          </div>
        ) : (
          <div className="space-y-4 mt-6 w-full max-w-3xl">
            {userDetails?.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between p-4 border-b"
              >
                <div className="flex items-center space-x-4 w-full md:w-3/4">
                  {user.imageUri ? (
                    <Image
                      src={user.imageUri}
                      alt={user.name}
                      width={50}
                      height={50}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gray-900" />
                  )}
                  <div className="flex flex-col">
                    <p className="text-lg text-gray-700">{user.name}</p>
                  </div>
                </div>
                <div className="flex justify-end w-1/4">
                  <Button
                    variant="outlined"
                    className={`${
                      isUserFollowing(user._id)
                        ? "bg-white text-black border-black"
                        : "bg-black text-white border-black"
                    } w-24 py-2 px-4 rounded-2xl text-xs`}
                    onClick={() => handleFollow(user._id)}
                  >
                    {isUserFollowing(user._id) ? "Following" : "Follow"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
