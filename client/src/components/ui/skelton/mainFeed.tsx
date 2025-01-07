import React from "react";
import { Skeleton } from "@mui/material";
import { v4 as uuidv4 } from "uuid"; // Import uuid to generate unique keys

export default function MainFeedSkeleton() {
  return (
    <div className="space-y-6">
      <div className="p-4">
        <Skeleton variant="text" width={100} height={20} />
      </div>

      {Array.from({ length: 3 }).map(() => (
        <div key={uuidv4()} className="p-4 border-b space-y-2 flex flex-col">
          <div className="flex items-center space-x-2">
            <Skeleton variant="circular" width={50} height={50} />
            <Skeleton variant="text" width={100} height={20} />
          </div>
          <div className="flex justify-between">
            <Skeleton variant="text" width={200} height={20} />
            <Skeleton variant="rectangular" width={100} height={100} />
          </div>

          <div className="flex justify-between items-center text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <Skeleton variant="text" width={60} height={20} />
              <Skeleton variant="rectangular" width={20} height={20} />
              <Skeleton variant="rectangular" width={20} height={20} />
            </div>

            <div className="flex items-center space-x-4">
              <Skeleton variant="rectangular" width={60} height={35} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
