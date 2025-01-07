import React from "react";
import { Skeleton } from "@mui/material";
import { v4 as uuidv4 } from "uuid"; // Import uuid to generate unique keys

export default function WhoToFollowSkelton() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Who to Follow</h3>
      {/* Render 4 skeleton loaders */}
      {Array.from({ length: 4 }).map(() => (
        <div key={uuidv4()} className="flex items-center space-x-4 p-4">
          <Skeleton
            variant="circular"
            width={50}
            height={50}
            className="object-cover"
          />
          <div className="flex-grow">
            <Skeleton variant="text" width="80%" height={24} />
            <Skeleton variant="text" width="60%" height={20} />
          </div>
          <Skeleton variant="rectangular" width={60} height={35} />
        </div>
      ))}
    </div>
  );
}
