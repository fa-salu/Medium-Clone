"use client";

import {
  ThumbUpAltOutlined,
  ChatBubbleOutline,
  MoreHoriz,
} from "@mui/icons-material";
import CategoryBar from "./categoryBar";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  addClaps,
  fetchAllStories,
  fetchSavedCollections,
  saveStoryToCollection,
} from "@/lib/features/storySlice";
import type { RootState } from "@/lib/store";
import { useAppDispatch } from "@/lib/hooks";
import Image from "next/image";
import BookmarkPopover from "../ui/savedStoryPopover";
import FollowPopover from "../ui/followPopover";

export default function MainFeed() {
  const dispatch = useAppDispatch();
  const articles = useSelector((state: RootState) => state.story.articles);
  const collections = useSelector(
    (state: RootState) => state.story.savedCollections
  );

  const noArticles = !articles || articles.length === 0;

  useEffect(() => {
    dispatch(fetchAllStories("For You")); // Example category
    dispatch(fetchSavedCollections()); // Fetch collections on component mount
  }, [dispatch]);

  const handleClap = (storyId: string) => {
    dispatch(addClaps({ storyId }));
  };

  const handleAddToCollection = (collectionName: string, storyId: string) => {
    dispatch(saveStoryToCollection({ storyId, collectionName }));
  };

  const handleFollow = (authorName: string) => {
    console.log(`Followed ${authorName}`);
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
    <div className="space-y-6">
      <CategoryBar />

      {noArticles ? (
        <p className="text-center text-gray-500">
          No articles available in this category.
        </p>
      ) : (
        articles.map((article) => (
          <div
            key={article._id}
            className="p-4 border-b space-y-2 flex flex-col"
          >
            <div className="flex items-center space-x-2">
              {article.authorDetails?.imageUri ? (
                <Image
                  src={article.authorDetails.imageUri}
                  alt={article.authorDetails.name || "Author Name"}
                  width={50}
                  height={50}
                  className="w-6 h-6 rounded-full"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gray-900" />
              )}
              <p>{article.authorDetails?.name}</p>
            </div>
            <div className="flex justify-between">
              <h2 className="text-lg font-semibold flex-grow pr-4">
                {article.title}
              </h2>
              <img
                src={article.imageUri}
                alt={article.title || "Article Image"}
                className="w-24 h-24 object-cover rounded-lg"
              />
            </div>

            <div className="flex justify-between items-center text-sm text-gray-600">
              <div className="flex items-center space-x-4">
                <span>{new Date(article.createdAt).toLocaleDateString()}</span>
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
                <BookmarkPopover
                  storyId={article._id} // Pass the storyId as a prop
                  collections={collections.map((c) => c.collectionName)}
                  onAddToCollection={(collectionName) =>
                    handleAddToCollection(collectionName, article._id)
                  }
                  onCreateNewCollection={(newCollectionName) =>
                    handleCreateNewCollection(newCollectionName, article._id)
                  }
                />

                <FollowPopover
                  authorName={article.authorDetails?.name || "Unknown"}
                  onFollow={() =>
                    handleFollow(article.authorDetails?.name || "")
                  }
                />
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
