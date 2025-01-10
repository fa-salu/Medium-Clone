import React from "react";
import { Skeleton } from "@mui/material";

export default function UsersToFollowSkeleton() {
  return (
    <div className="py-12">
      <div className="flex flex-col items-center">
        <Skeleton
          variant="text"
          width={200}
          height={32}
          animation="wave"
          className="border-b py-2"
        />

        <div className="space-y-4 mt-6 w-full max-w-3xl">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border-b"
            >
              <div className="flex items-center space-x-4 w-full md:w-3/4">
                <Skeleton
                  variant="circular"
                  width={40}
                  height={40}
                  animation="wave"
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex flex-col">
                  <Skeleton
                    variant="text"
                    width={120}
                    height={24}
                    animation="wave"
                  />
                </div>
              </div>

              <div className="flex justify-end w-1/4">
                <Skeleton
                  variant="rectangular"
                  width={80}
                  height={30}
                  animation="wave"
                  className="rounded-2xl"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
