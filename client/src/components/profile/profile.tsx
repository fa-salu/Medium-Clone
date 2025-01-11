"use client";

import { useState } from "react";
import ProfileBar from "./profileBar";
import AuthorDetails from "./authorDetails";
import StoryList from "./storyList";

export default function Profile() {
  const [selectedTab, setSelectedTab] = useState("Home");

  return (
    <div className="flex space-x-6 px-5 sm:px-12">
      <div className="w-full sm:w-2/3 sm:ml-20  sm:border-r">
        <ProfileBar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
        <StoryList selectedTab={selectedTab} />
      </div>

      <div className="w-0 sm:w-1/3">
        <AuthorDetails />
      </div>
    </div>
  );
}
