"use client";

import {
  addClaps,
  fetchSavedCollections,
  fetchStory,
  saveStoryToCollection,
} from "@/lib/features/storySlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import type { RootState } from "@/lib/store";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import parse from "html-react-parser";
import { ChatBubbleOutline, ThumbUpAltOutlined } from "@mui/icons-material";
import BookmarkPopover from "@/components/ui/savedStoryPopover";
import { Button } from "@mui/material";

export default function Page() {
  const params = useParams();
  const storyId = params.storyId as string;
  const dispatch = useAppDispatch();
  const article = useAppSelector((state: RootState) => state.story.article);
  const collections = useAppSelector(
    (state: RootState) => state.story.savedCollections
  );
  const author = useAppSelector((state: RootState) => state.user.user?._id);

  const FollowBtnShow = author === article?.authorDetails?._id;

  useEffect(() => {
    dispatch(fetchStory(storyId));
    dispatch(fetchSavedCollections());
  }, [dispatch, storyId]);

  const handleClap = (storyId: string) => {
    dispatch(addClaps({ storyId }));
    dispatch(fetchStory(storyId));
  };

  const handleAddToCollection = (collectionName: string, storyId: string) => {
    dispatch(saveStoryToCollection({ storyId, collectionName }));
  };

  const handleCreateNewCollection = (
    newCollectionName: string,
    storyId: string
  ) => {
    dispatch(
      saveStoryToCollection({
        storyId,
        collectionName: newCollectionName,
      })
    );
  };

  return (
    <div className="flex justify-center">
      <div className="flex flex-col px-6 py-8 space-y-6 w-full max-w-3xl ">
        {article ? (
          <div>
            <h1 className="text-4xl font-bold mb-4 ">{article.title}</h1>

            <div className="flex items-center space-x-4 mb-6">
              {article.authorDetails?.imageUri ? (
                <Image
                  src={article.authorDetails.imageUri}
                  alt={article.authorDetails.name || "Author Name"}
                  width={80}
                  height={80}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-300" />
              )}
              <div className="text-sm font-medium">
                {article.authorDetails?.name}{" "}
                {!FollowBtnShow && (
                  <Button className="text-green-600">Follow</Button>
                )}
                <div className="text-sm text-gray-500">
                  {new Date(article.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            {article.imageUri && (
              <div className="w-full mb-6">
                <Image
                  src={article.imageUri}
                  alt="Story Image"
                  width={800}
                  height={400}
                  className="w-full rounded-lg object-cover"
                />
              </div>
            )}

            <div className="border-y py-5 px-2">
              <div className="flex justify-between items-center text-sm text-gray-600">
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    className="flex items-center"
                    onClick={() => handleClap(article._id)}
                  >
                    <ThumbUpAltOutlined className="mr-1 text-gray-600" />
                    {article.claps || 0}
                  </button>
                  <span className="flex items-center">
                    <ChatBubbleOutline className="mr-1 text-gray-600" />
                    {10}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  {collections && collections.length > 0 ? (
                    <BookmarkPopover
                      storyId={article._id}
                      collections={collections.map((c) => c.collectionName)}
                      onAddToCollection={(collectionName) =>
                        handleAddToCollection(collectionName, article._id)
                      }
                      onCreateNewCollection={(newCollectionName) =>
                        handleCreateNewCollection(
                          newCollectionName,
                          article._id
                        )
                      }
                    />
                  ) : (
                    <p>No collections available</p>
                  )}
                </div>
              </div>
            </div>

            <div className="text-lg leading-relaxed mt-6">
              {article.content && parse(article.content)}
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}
