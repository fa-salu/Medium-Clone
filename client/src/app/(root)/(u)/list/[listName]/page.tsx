"use client";

import AuthorDetails from "@/components/profile/authorDetails";
import { addClaps, fetchStoryByListName } from "@/lib/features/storySlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import type { RootState } from "@/lib/store";
import {
  ChatBubbleOutline,
  MoreHoriz,
  ThumbUpAltOutlined,
} from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const params = useParams();
  const listName = params.listName as string;
  const dispatch = useAppDispatch();
  const collections = useAppSelector(
    (state: RootState) => state.story.savedCollections
  );

  console.log("collection:", collections);

  useEffect(() => {
    dispatch(fetchStoryByListName(listName));
  }, [dispatch, listName]);

  const handleClap = (storyId: string) => {
    dispatch(addClaps({ storyId }));
  };

  return (
    <div className="flex space-x-6 p-12">
      <div className="w-2/3 ml-20">
        {collections ? (
          <div key={collections?.collectionName} className="space-y-4">
            <h2 className="text-xl font-bold">
              Collection: {collections.collectionName}
            </h2>

            {collections.stories?.length > 0 ? (
              collections.stories.map((story) => (
                <div
                  key={story._id}
                  className="p-4 border-b space-y-2 flex flex-col"
                >
                  <div className="flex items-center space-x-2">
                    {story.authorDetails?.imageUri ? (
                      <Image
                        src={story.authorDetails.imageUri}
                        alt={story.authorDetails?.name || "Author Name"}
                        width={50}
                        height={50}
                        className="w-6 h-6 rounded-full"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gray-900" />
                    )}
                    <p>{story.authorDetails?.name}</p>
                  </div>
                  <Link href={`/${story._id}`}>
                    <div className="flex justify-between">
                      <h2 className="text-lg font-semibold flex-grow pr-4">
                        {story.title}
                      </h2>
                    </div>
                  </Link>
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <div className="flex items-center space-x-4">
                      <span>
                        {new Date(story.createdAt).toLocaleDateString()}
                      </span>
                      <button
                        type="button"
                        className="flex items-center"
                        onClick={() => handleClap(story._id)}
                      >
                        <ThumbUpAltOutlined className="mr-1 text-gray-600" />
                        {story.claps || 0}
                      </button>
                      <span className="flex items-center">
                        <ChatBubbleOutline className="mr-1 text-gray-600" />
                        {0}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <MoreHoriz />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No stories available in this collection.</p>
            )}
          </div>
        ) : (
          <p>No collections available.</p>
        )}
      </div>

      <div className="w-1/3">
        <AuthorDetails />
      </div>
    </div>
  );
}
