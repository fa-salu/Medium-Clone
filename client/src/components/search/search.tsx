"use client";
import { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchAllStories } from "@/lib/features/storySlice";
import type { RootState } from "@/lib/store";
import Link from "next/link";

export default function SearchComponent() {
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useAppDispatch();
  const stories = useAppSelector((state: RootState) => state.story.articles);

  useEffect(() => {
    dispatch(fetchAllStories("For You"));
  }, [dispatch]);

  const filteredStories = Array.isArray(stories)
    ? stories.filter((story) =>
        story.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];
  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="relative">
      <div className="flex w-32 md:w-full items-center border rounded-lg dark:border-gray-700 light:border-gray-300">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search"
          className="px-4 py-1 focus:outline-none w-full dark:bg-gray-800 dark:text-white light:bg-white light:text-black"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-4 hover:text-gray-700 dark:hover:text-gray-300 light:hover:text-gray-500"
            aria-label="Clear Search"
          >
            <CloseIcon />
          </button>
        )}
      </div>

      {searchQuery && filteredStories.length > 0 && (
        <div className="absolute top-full mt-1 border rounded-lg shadow-lg w-full max-h-60 overflow-y-auto dark:border-gray-700 dark:bg-gray-800 light:border-gray-300 light:bg-white">
          {filteredStories.map((result) => (
            <div
              key={result._id}
              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 light:hover:bg-gray-200"
            >
              <Link href={`/${result._id}`} onClick={clearSearch}>
                <strong className="dark:text-white light:text-black">
                  {result.title}
                </strong>
                <p className="text-sm dark:text-gray-400 light:text-gray-600">
                  {new Date(result.createdAt).toLocaleDateString()}
                </p>
              </Link>
            </div>
          ))}
        </div>
      )}

      {searchQuery && filteredStories.length === 0 && (
        <div className="absolute top-full mt-1 border rounded-lg shadow-lg w-full dark:border-gray-700 dark:bg-gray-800 light:border-gray-300 light:bg-white">
          <p className="px-4 py-2 text-sm dark:text-gray-400 light:text-gray-600">
            No results found
          </p>
        </div>
      )}
    </div>
  );
}
