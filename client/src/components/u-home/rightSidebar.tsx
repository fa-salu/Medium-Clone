"use client";
import React from "react";

export default function RightSidebar() {
  return (
    <aside className="w-1/3 p-4">
      <div className="font-bold text-lg mb-2">Staff Picks</div>
      <ul>
        <li className="py-2 border-b">
          <h3 className="font-semibold">The Spoilerphobic Era</h3>
          <p className="text-sm text-gray-500">6d ago</p>
        </li>
        <li className="py-2 border-b">
          <h3 className="font-semibold">Goodbye, immortal design</h3>
          <p className="text-sm text-gray-500">6d ago</p>
        </li>
        <li className="py-2">
          <h3 className="font-semibold">
            A Review: Publishing an Absolute Flop
          </h3>
          <p className="text-sm text-gray-500">Nov 22</p>
        </li>
      </ul>
      <div className="mt-4">
        <h3 className="font-bold text-lg mb-2">Recommended Topics</h3>
        <div className="flex flex-wrap gap-2">
          {["Self Improvement", "Writing", "Python", "Business"].map(
            (topic) => (
              <span
                key={topic}
                className="bg-gray-200 px-2 py-1 rounded-full text-sm"
              >
                {topic}
              </span>
            )
          )}
        </div>
      </div>
    </aside>
  );
}
