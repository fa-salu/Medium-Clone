"use client";
import React from "react";

interface PostProps {
  title: string;
  description: string;
  date: string;
  views: number;
  comments: number;
}

export default function Post({
  title,
  description,
  date,
  views,
  comments,
}: PostProps) {
  return (
    <div className="border-b py-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-gray-600">{description}</p>
      <div className="text-sm text-gray-500 mt-2 flex space-x-4">
        <span>{date}</span>
        <span>{views} views</span>
        <span>{comments} comments</span>
      </div>
    </div>
  );
}
