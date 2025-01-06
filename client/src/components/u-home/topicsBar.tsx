"use client";

import { Add, ChevronLeft, ChevronRight } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import { fetchAllStories } from "@/lib/features/storySlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import type { RootState } from "@/lib/store";
import Link from "next/link";
import { fetchFollowedTopics } from "@/lib/features/topicFollowSlice";

export default function TopicBar() {
  const [selectedCategory, setSelectedCategory] = useState("For You");
  const [isScrollable, setIsScrollable] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const { followTopics, status, error } = useAppSelector(
    (state: RootState) => state.topicFollow
  );

  const fixedTopics = ["For You", "Following"];
  const displayedTopics = fixedTopics.concat(followTopics?.topics || []);

  useEffect(() => {
    dispatch(fetchFollowedTopics());
  }, [dispatch]);

  useEffect(() => {
    const checkScrollable = () => {
      const container = containerRef.current;
      if (container) {
        setIsScrollable(container.scrollWidth > container.clientWidth);
      }
    };

    checkScrollable();

    window.addEventListener("resize", checkScrollable);
    return () => window.removeEventListener("resize", checkScrollable);
  }, []);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    dispatch(fetchAllStories(category));
  };

  const scrollContainer = (direction: "left" | "right") => {
    const container = containerRef.current;
    if (container) {
      const scrollAmount = 150;
      if (direction === "right") {
        container.scrollBy({ left: scrollAmount, behavior: "smooth" });
      } else {
        container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      }
    }
  };

  return (
    <div className="flex sticky top-0 items-center space-x-4 p-4 border-b bg-white">
      {isScrollable && (
        <ChevronLeft
          className="cursor-pointer text-gray-800"
          onClick={() => scrollContainer("left")}
        />
      )}

      <Link href={"/explore-topics"}>
        <Add className="text-gray-800" />
      </Link>

      <div
        ref={containerRef}
        id="category-container"
        className="flex space-x-4 overflow-x-auto"
      >
        {displayedTopics && displayedTopics.length > 0 ? (
          displayedTopics.map((category) => (
            <button
              type="button"
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`whitespace-nowrap px-4 py-2 text-gray-800 border-b-2 border-transparent hover:border-black ${
                category === selectedCategory ? "border-black" : ""
              }`}
            >
              {category}
            </button>
          ))
        ) : (
          <div>No topics available</div>
        )}
      </div>

      {isScrollable && (
        <ChevronRight
          className="cursor-pointer text-gray-800"
          onClick={() => scrollContainer("right")}
        />
      )}
    </div>
  );
}
