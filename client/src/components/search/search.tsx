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
      <div className="flex w-32 md:w-full items-center border rounded-lg">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search"
          className="px-4 py-1 focus:outline-none w-full"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-4 text-gray-500 hover:text-gray-700"
            aria-label="Clear Search"
          >
            <CloseIcon />
          </button>
        )}
      </div>

      {searchQuery && filteredStories.length > 0 && (
        <div className="absolute top-full mt-1 bg-white border rounded-lg shadow-lg w-full max-h-60 overflow-y-auto">
          {filteredStories.map((result) => (
            <div key={result._id} className="px-4 py-2 hover:bg-gray-100">
              <Link href={`/${result._id}`} onClick={clearSearch}>
                <strong>{result.title}</strong>
                <p className="text-sm text-gray-500">
                  {new Date(result.createdAt).toLocaleDateString()}
                </p>
              </Link>
            </div>
          ))}
        </div>
      )}

      {searchQuery && filteredStories.length === 0 && (
        <div className="absolute top-full mt-1 bg-white border rounded-lg shadow-lg w-full">
          <p className="px-4 py-2 text-sm text-gray-500">No results found</p>
        </div>
      )}
    </div>
  );
}
