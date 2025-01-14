"use client";

import { Skeleton } from "@mui/material";
import { v4 as uuidv4 } from "uuid";

export default function MainFeedBarSkelton() {
  return (
    <div className="flex sticky top-0 items-center space-x-4 p-4 border-b justify-between">
      <div className="flex items-center space-x-4">
        <Skeleton variant="circular" width={24} height={24} />
        <Skeleton variant="rectangular" width={40} height={24} />
      </div>

      <div className="flex space-x-4 overflow-x-auto items-start justify-start flex-grow">
        {Array.from({ length: 5 }).map(() => (
          <Skeleton
            key={uuidv4()}
            variant="rectangular"
            width={100}
            height={30}
            className="rounded-md"
          />
        ))}
      </div>

      <div className="flex items-center space-x-4">
        <Skeleton variant="circular" width={24} height={24} />
      </div>
    </div>
  );
}
