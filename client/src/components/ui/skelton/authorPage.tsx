"use client";

import { Box } from "@mui/material";
import { v4 as uuidv4 } from "uuid";

export default function AuthorPageSkelton() {
  return (
    <div className="flex space-x-6 px-36">
      <div className="flex flex-col pr-8 space-y-6 border-r">
        <div className="pt-10 space-y-8">
          <Box className="h-6 bg-gray-300 rounded w-3/4" />
          <hr className="my-4" />
        </div>

        {Array.from({ length: 3 }).map(() => (
          <div
            key={uuidv4()}
            className="p-4 border-b flex flex-col sm:flex-row items-start space-x-12 sm:space-y-0 animate-pulse"
          >
            <div className="flex flex-col flex-1 space-y-4">
              <Box className="h-6 bg-gray-300 rounded w-3/4" />
              <div className="flex justify-between items-center text-sm text-gray-600">
                <div className="flex items-center space-x-4">
                  <Box className="h-4 bg-gray-300 rounded w-20" />
                  <Box className="h-4 bg-gray-300 rounded w-12" />
                  <Box className="h-4 bg-gray-300 rounded w-10" />
                </div>
                <Box className="h-6 w-6 mx-5 bg-gray-300 rounded-full" />
              </div>
            </div>
            <Box className="w-24 h-24 bg-gray-300 rounded-md" />
          </div>
        ))}
      </div>

      <div className="w-1/3 flex flex-col p-4 space-y-4">
        <div className="flex flex-col space-y-4 items-center animate-pulse">
          <Box className="w-20 h-20 bg-gray-300 rounded-full" />
          <Box className="h-6 bg-gray-300 rounded w-1/2" />
        </div>
      </div>
    </div>
  );
}
