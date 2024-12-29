"use client";

import {
  ThumbUpAltOutlined,
  ChatBubbleOutline,
  BookmarkBorder,
  MoreHoriz,
} from "@mui/icons-material";
import CategoryBar from "./categoryBar";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchAllStories } from "@/lib/features/storySlice";
import type { RootState } from "@/lib/store";
import { useAppDispatch } from "@/lib/hooks";
import Image from "next/image";

export default function MainFeed() {
  const dispatch = useAppDispatch();
  const [selectedCategory] = useState("For You");
  const articles = useSelector((state: RootState) => state.story.articles);

  console.log("articalles:", articles.length);

  useEffect(() => {
    dispatch(fetchAllStories(selectedCategory));
  }, [dispatch, selectedCategory]);

  const noArticles = !articles || articles.length === 0;

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
              <Image
                src={article.authorDetails.imageUri}
                alt={article.authorDetails.name}
                width={50}
                height={50}
                className="w-6 h-6 rounded-full"
              />
              <p>{article.authorDetails.name}</p>
            </div>
            <div className="flex justify-between">
              <h2 className="text-lg font-semibold flex-grow pr-4">
                {article.title}
              </h2>
              <img
                src={article.imageUri}
                alt={article.title}
                className="w-24 h-24 object-cover rounded-lg"
              />
            </div>

            <div className="flex justify-between items-center text-sm text-gray-600">
              <div className="flex items-center space-x-4">
                <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                <span className="flex items-center">
                  <ThumbUpAltOutlined className="mr-1 text-gray-600" />
                  {article.claps || 0}
                </span>
                <span className="flex items-center">
                  <ChatBubbleOutline className="mr-1 text-gray-600" />
                  {10}
                </span>
              </div>

              <div className="flex items-center space-x-4">
                <BookmarkBorder className="cursor-pointer" />
                <MoreHoriz className="cursor-pointer" />
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
