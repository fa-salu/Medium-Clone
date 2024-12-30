"use client";

import { Add, ChevronLeft, ChevronRight } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { fetchAllStories } from "@/lib/features/storySlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchTopics } from "@/lib/features/topicSlice";

export default function TopicBar() {
  const [selectedCategory, setSelectedCategory] = useState("For You");
  const dispatch = useAppDispatch();
  const { topics, loading, error } = useAppSelector((state) => state.topic);

  const fixedTopics = ["For You", "Following"];
  const displayedTopics = fixedTopics.concat(topics || []);

  useEffect(() => {
    dispatch(fetchTopics());
  }, [dispatch]);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    dispatch(fetchAllStories(category));
  };

  const scrollContainer = (direction: "left" | "right") => {
    const container = document.getElementById("category-container");
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
    <div className="flex sticky top-0 space-x-4 overflow-x-auto  p-4 border-b bg-white">
      <ChevronLeft
        className="cursor-pointer text-gray-800"
        onClick={() => scrollContainer("left")}
      />

      <Add className="text-gray-800" />

      <div id="category-container" className="flex space-x-4 overflow-x-auto">
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

      <ChevronRight
        className="cursor-pointer text-gray-800"
        onClick={() => scrollContainer("right")}
      />
    </div>
  );
}
