"use client";

import { ThumbUpAltOutlined, ChatBubbleOutline } from "@mui/icons-material";
import TopicBar from "./topicsBar";
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
import Link from "next/link";
import MainFeedSkeleton from "../ui/skelton/mainFeed";
import parse from "html-react-parser";
import FormattedDate from "../ui/timeFormat";

export default function MainFeed() {
  const dispatch = useAppDispatch();
  const { articles, savedCollections, isLoading } = useSelector(
    (state: RootState) => state.story
  );

  const collections = savedCollections || [];

  const noArticles = !articles || articles.length === 0;

  useEffect(() => {
    dispatch(fetchAllStories("For You"));
    dispatch(fetchSavedCollections());
  }, [dispatch]);

  const handleClap = (storyId: string) => {
    dispatch(addClaps({ storyId }));
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

  const removeImageAndAnchorTags = (html: string): string => {
    const regex =
      /<img[^>]*>|<a[^>]*>.*?<\/a>|<h2[^>]*>.*?<\/h2>|<h3[^>]*>.*?<\/h3>|<br\s*\/?>|<video[^>]*>.*?<\/video>|<div[^>]*>.*?<\/div>/gi;
    return html.replace(regex, "");
  };

  return (
    <>
      <TopicBar />
      {isLoading ? (
        <MainFeedSkeleton />
      ) : (
        <div className="space-y-6">
          {noArticles ? (
            <p className="text-center text-gray-500">
              No articles available in this category.
            </p>
          ) : (
            articles.map((article) => (
              <div
                key={article._id}
                className="p-4 border-b space-y-2 flex flex-col overflow-y-auto"
              >
                <div className="flex items-center space-x-2 pb-3">
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
                  <Link
                    href={{
                      pathname: `/u/@${article.authorDetails?.name}`,
                      query: { userId: article.authorDetails?._id },
                    }}
                  >
                    <p>{article.authorDetails?.name}</p>
                  </Link>
                </div>
                <Link href={`/${article._id}`}>
                  <div className="flex justify-between over">
                    <div className="flex-grow pr-4">
                      <h2 className="text-xl font-semibold pb-2">
                        {article.title}
                      </h2>
                      <div className="text-sm text-gray-600 mt-1 line-clamp-3">
                        {parse(removeImageAndAnchorTags(article.content))}
                      </div>
                    </div>
                    {article.coverImage && (
                      <Image
                        src={article.coverImage}
                        alt={article.title || "Article Image"}
                        width={100}
                        height={100}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    )}
                  </div>
                </Link>

                <div className="flex justify-between items-center text-sm text-gray-600">
                  <div className="flex items-center space-x-4 py-2">
                    <span>
                      <FormattedDate date={article.createdAt} />
                    </span>
                    <button
                      type="button"
                      className="flex items-center"
                      onClick={() => handleClap(article._id)}
                    >
                      <ThumbUpAltOutlined className="mr-1 text-gray-600" />
                      {article.claps > 0 ? article.claps : ""}
                    </button>
                    <Link href={`/${article._id}`}>
                      <ChatBubbleOutline className="mr-1 text-gray-600" />
                    </Link>
                  </div>

                  <div className="flex items-center space-x-4">
                    <BookmarkPopover
                      storyId={article._id}
                      collections={collections?.map?.((c) => c.collectionName)}
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
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
}
