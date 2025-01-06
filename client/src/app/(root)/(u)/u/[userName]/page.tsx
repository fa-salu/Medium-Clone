"use client";

import { ThumbUpAltOutlined } from "@mui/icons-material";
import { fetchStoryByAuthor } from "@/lib/features/storySlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import type { RootState } from "@/lib/store";
import { useEffect } from "react";
import Image from "next/image";
import { fetchUserById } from "@/lib/features/authSlice";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const dispatch = useAppDispatch();
  const author = useAppSelector((state: RootState) => state.user.user);
  const { articles, isLoading, error } = useAppSelector(
    (state: RootState) => state.story
  );

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserById(userId));
      dispatch(fetchStoryByAuthor({ authorId: userId }));
    }
  }, [dispatch, userId]);

  if (!userId) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-6 flex space-x-6">
      <div className="flex-1 space-y-6">
        {author ? (
          <div>
            <h1 className="text-2xl font-semibold">{author?.name}</h1>
            <hr className="my-4" />
          </div>
        ) : (
          <p className="text-gray-500">Author not found</p>
        )}

        {articles && articles.length > 0 ? (
          articles.map((story) => (
            <div
              key={story._id}
              className="p-4 border-b space-y-4 flex flex-col sm:flex-row items-start"
            >
              <div className="flex space-x-4 sm:w-2/3">
                {story.coverImage ? (
                  <Image
                    src={story.coverImage}
                    alt={story.title || "Story Image"}
                    width={100}
                    height={100}
                    className="object-cover rounded-md"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-200 rounded-md" />
                )}

                <div className="flex flex-col justify-between w-full">
                  <h2 className="text-xl font-semibold">{story.title}</h2>
                  <div className="text-sm text-gray-500">
                    <span>
                      {new Date(story.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-gray-600">
                <ThumbUpAltOutlined className="text-gray-600" />
                <span>{story.claps || 0}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No stories available.</p>
        )}
      </div>

      <div className="w-1/3 flex flex-col items-center p-4 border rounded-lg space-y-4">
        <div className="flex flex-col items-center space-y-4">
          {author?.imageUri ? (
            <Image
              src={author.imageUri}
              alt={author?.name}
              width={80}
              height={80}
              className="object-cover rounded-full"
            />
          ) : (
            <div className="w-20 h-20 bg-gray-300 rounded-full" />
          )}
          <span className="text-xl font-semibold">{author?.name}</span>
        </div>

        <button
          type="button"
          className="bg-green-500 text-white py-2 px-4 rounded-full mt-2 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          Follow
        </button>
      </div>
    </div>
  );
}
