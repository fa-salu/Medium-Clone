"use client";
import React from "react";
import Post from "./post";

export default function MainContent() {
  const posts = [
    {
      id: "post-1",
      title: "This is BAD! MongoDB is Shutting Down their Services? 😭",
      description: "About",
      date: "Sep 12",
      views: 1000,
      comments: 45,
    },
    {
      id: "post-2",
      title: "Embracing Life Over 60",
      description: "The golden age of opportunity",
      date: "Nov 21",
      views: 107,
      comments: 2,
    },
  ];

  return (
    <main className="w-2/3 p-4">
      {posts.map((post) => (
        <Post key={post.id} {...post} />
      ))}
    </main>
  );
}
