"use client";

import { useState } from "react";
import ProfileBar from "./profileBar";
import UserDetails from "./authorDetails";
import StoryList from "./storyList";

export default function Profile() {
  const [selectedTab, setSelectedTab] = useState("Home");

  return (
    <div className="flex space-x-6 p-12 ">
      <div className="w-2/3 ml-20">
        <ProfileBar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
        <StoryList selectedTab={selectedTab} />
      </div>

      <div className="w-1/3">
        <UserDetails />
      </div>
    </div>
  );
}
