"use client";

import {
  fetchFollowedTopics,
  followTopic,
} from "@/lib/features/topicFollowSlice";
import { fetchTopics } from "@/lib/features/topicSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import type { RootState } from "@/lib/store";
import TopicIcon from "@mui/icons-material/Topic";
import { Button } from "@mui/material";
import { useEffect } from "react";

export default function Topics() {
  const dispatch = useAppDispatch();
  const { topics, loading } = useAppSelector((state: RootState) => state.topic);
  const { followTopics, status, error } = useAppSelector(
    (state: RootState) => state.topicFollow
  );

  useEffect(() => {
    dispatch(fetchTopics());
    dispatch(fetchFollowedTopics());
  }, [dispatch]);

  const handleFollow = (topic: string) => {
    dispatch(followTopic(topic));
  };

  const followedTopics = followTopics?.topics || [];

  return (
    <div className="py-12">
      <div className="flex flex-col items-center">
        <h1 className="text-3xl border-b py-2">Topics to Follow</h1>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="space-y-4 mt-6 w-full max-w-3xl">
            {topics?.map((topic) => (
              <div
                key={topic}
                className="flex items-center justify-between p-4 border-b"
              >
                <div className="flex items-center space-x-2 w-full md:w-3/4">
                  <TopicIcon className="text-2xl" />
                  <p className="text-lg text-gray-700">{topic}</p>
                </div>
                <div className="flex justify-end w-1/4">
                  <Button
                    variant="outlined"
                    className={`${
                      followedTopics.includes(topic)
                        ? "bg-white text-black border-black"
                        : "bg-black text-white border-black"
                    } w-24 py-2 px-4 rounded-2xl text-xs`}
                    onClick={() => handleFollow(topic)}
                  >
                    {followedTopics.includes(topic) ? "Following" : "Follow"}
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
