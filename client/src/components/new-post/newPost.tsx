"use client";
import { useState } from "react";
import Bar from "./bar";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";

export default function NewStory() {
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [activeLine, setActiveLine] = useState<number | null>(null);
  console.log(activeLine);

  const handleKeyDownTitle = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      document.getElementById("storyInput")?.focus();
      setActiveLine(2);
    }
  };

  const handleKeyDownStory = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Backspace" && story.length === 0) {
      e.preventDefault();
      document.getElementById("titleInput")?.focus();
      setActiveLine(1);
    }
  };

  const handleClickLine = (line: number) => {
    if ((line === 1 && !title) || (line === 2 && !story)) {
      setActiveLine(line);
    }
  };

  return (
    <div>
      <Bar />
      <div className="flex flex-col px-32 mt-10 space-y-4">
        <button
          type="button"
          onClick={() => handleClickLine(1)}
          onKeyDown={(e) => handleClickLine(1)}
          className="w-full relative"
        >
          {activeLine === 1 && !title && (
            <AddCircleOutlineOutlinedIcon className="absolute top-1" />
          )}
          <textarea
            id="titleInput"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDownTitle}
            rows={1}
            className="w-full h-full text-4xl font-bold focus:outline-none placeholder-gray-400 bg-transparent pl-8" // Adding padding-left to leave space for icon
          />
        </button>

        <button
          type="button"
          onClick={() => handleClickLine(2)}
          onKeyDown={(e) => handleClickLine(2)}
          className="w-full relative"
        >
          {activeLine === 2 && !story && (
            <AddCircleOutlineOutlinedIcon className="absolute top-1" />
          )}
          <textarea
            id="storyInput"
            placeholder="Tell your story..."
            value={story}
            onChange={(e) => setStory(e.target.value)}
            onKeyDown={handleKeyDownStory}
            rows={10}
            className="w-full text-xl focus:outline-none resize-none placeholder-gray-500 bg-transparent pl-8" // Adding padding-left to leave space for icon
          />
        </button>
      </div>
    </div>
  );
}
