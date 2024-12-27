"use client";

import { useEffect, useRef, useState } from "react";
import MediumEditor from "medium-editor";
import "medium-editor/dist/css/medium-editor.css";
import "medium-editor/dist/css/themes/default.css";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  setTitle,
  setContent,
  saveOrUpdateStory,
  loadStoryIdFromCookies,
} from "@/lib/features/storySlice";
import debounce from "@/utils/debounce";
import Bar from "./bar";
import IconSet from "./addButton";

export default function NewStory() {
  const dispatch = useAppDispatch();
  const { title, content, id } = useAppSelector((state) => state.story);

  const titleRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const [showIcons, setShowIcons] = useState(false);

  useEffect(() => {
    dispatch(loadStoryIdFromCookies());
  }, [dispatch]);

  useEffect(() => {
    const autoSave = debounce(() => {
      if (title || content || id) {
        dispatch(saveOrUpdateStory({ title, content, category: "", id }));
      }
    }, 2000);

    autoSave();
  }, [title, content, id, dispatch]);

  useEffect(() => {
    if (titleRef.current) {
      const editor = new MediumEditor(titleRef.current, {
        placeholder: { text: "Title", hideOnClick: true },
        toolbar: false,
        disableReturn: true,
      });
      titleRef.current.addEventListener("input", (e) => {
        dispatch(setTitle((e.target as HTMLDivElement).innerHTML));
      });
    }

    if (storyRef.current) {
      const editor = new MediumEditor(storyRef.current, {
        placeholder: { text: "Tell your story...", hideOnClick: true },
        toolbar: {
          buttons: ["bold", "italic", "underline", "anchor", "h2", "h3"],
        },
      });
      storyRef.current.addEventListener("input", (e) => {
        dispatch(setContent((e.target as HTMLDivElement).innerHTML));
      });
    }
  }, [dispatch]);

  return (
    <div>
      <Bar showIcons={showIcons} setShowIcons={setShowIcons} />
      <IconSet storyRef={storyRef as React.RefObject<HTMLDivElement>} />
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
