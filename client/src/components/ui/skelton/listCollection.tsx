"use client";

import { Skeleton } from "@mui/material";
import { v4 as uuidv4 } from "uuid";

export default function CollectionSkeleton() {
  return (
    <div className="flex space-x-6 p-12">
      <div className="w-2/3 ml-20 border-r space-y-6">
        <Skeleton variant="text" width={200} height={40} className="mb-4" />
        {[...Array(3)].map(() => (
          <div key={uuidv4()} className="p-4 border-b space-y-4">
            <div className="flex items-center space-x-2">
              <Skeleton variant="circular" width={40} height={40} />
              <Skeleton variant="text" width={120} />
            </div>
            <Skeleton variant="text" width="80%" height={30} />
            <div className="flex justify-between items-center text-sm text-gray-600">
              <div className="flex items-center space-x-4">
                <Skeleton variant="text" width={80} />
                <Skeleton variant="text" width={40} />
                <Skeleton variant="circular" width={24} height={24} />
              </div>
              <Skeleton variant="rectangular" width={24} height={24} />
            </div>
          </div>
        ))}
      </div>

      <div className="w-1/3">
        <Skeleton variant="rectangular" width="100%" height={200} />
      </div>
    </div>
  );
}
