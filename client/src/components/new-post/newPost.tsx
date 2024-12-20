"use client";

import { useState, useEffect, useRef } from "react";
import MediumEditor from "medium-editor";
// import { marked } from "marked";
import "medium-editor/dist/css/medium-editor.css";
import "medium-editor/dist/css/themes/default.css";
import "medium-editor-insert-plugin/dist/css/medium-editor-insert-plugin.min.css";
import Bar from "./bar";
import IconSet from "./addButton";

export default function NewStory() {
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const titleRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const [showIcons, setShowIcons] = useState(false);

  console.log(story);

  useEffect(() => {
    if (titleRef.current) {
      new MediumEditor(titleRef.current, {
        placeholder: { text: "Title", hideOnClick: true },
        toolbar: false,
        disableReturn: true,
      });
      titleRef.current.addEventListener("input", (e) => {
        setTitle((e.target as HTMLDivElement).innerHTML);
      });
    }

    if (storyRef.current) {
      new MediumEditor(storyRef.current, {
        placeholder: { text: "Tell your story...", hideOnClick: true },
        toolbar: {
          buttons: [
            "bold",
            "italic",
            "underline",
            "anchor",
            "h2",
            "h3",
            "quote",
          ],
        },
      });
      storyRef.current.addEventListener("input", (e) => {
        setStory((e.target as HTMLDivElement).innerHTML);
      });
    }
  }, []);

  return (
    <div>
      <Bar showIcons={showIcons} setShowIcons={setShowIcons} />
      {showIcons && <IconSet />}
      <div className="flex flex-col px-32 mt-10 space-y-6">
        <div
          ref={titleRef}
          className="text-4xl font-bold placeholder-gray-400 bg-transparent focus:outline-none pl-2"
        />
        <div
          ref={storyRef}
          className="text-xl placeholder-gray-500 bg-transparent focus:outline-none pl-2"
        />
      </div>
    </div>
  );
}
