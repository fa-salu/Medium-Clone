"use client";

import { Add } from "@mui/icons-material";

const categories = [
  "For You",
  "Following",
  "Relationships",
  "Machine Learning",
  "Psychology",
  "Science",
  "Software Engineering",
  "Marketing",
  "UX",
];

export default function CategoryBar() {
  return (
    <div className="flex space-x-4 overflow-x-auto scrollbar-hide p-4 border-b bg-white">
      <Add className="text-gray-800" />

      {categories.map((category) => (
        <button
          type="button"
          key={category}
          className="whitespace-nowrap px-4 py-2 text-gray-800 border-b-2 border-transparent hover:border-black"
        >
          {category}
        </button>
      ))}
    </div>
  );
}
