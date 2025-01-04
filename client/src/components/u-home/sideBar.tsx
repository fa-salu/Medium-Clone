"use client";

import { fetchTopics } from "@/lib/features/topicSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import type { RootState } from "@/lib/store";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { topics, loading, error } = useAppSelector(
    (state: RootState) => state.topic
  );

  useEffect(() => {
    dispatch(fetchTopics());
  }, [dispatch]);

  const staffPicks = [
    "It happened on Medium in 2024",
    "Best gifts for writers",
    "Most-highlighted sentences",
  ];

  return (
    <aside className="w-1/3 space-y-8">
      <section>
        <h3 className="text-lg font-semibold mb-4">Staff Picks</h3>
        <ul className="space-y-2">
          {staffPicks.map((pick, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: Using index for demo data
            <li key={index} className="text-gray-700">
              {pick}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-4">Recommended Topics</h3>
        <div className="flex flex-wrap gap-2">
          {topics && topics.length > 0 ? (
            topics.slice(0, 4).map((topic) => (
              <span
                key={topic}
                className="px-3 py-1 bg-gray-100 text-sm rounded-full"
              >
                {topic}
              </span>
            ))
          ) : (
            <p>Loading topics...</p>
          )}
        </div>
        {topics && topics.length > 4 && (
          <button
            type="button"
            onClick={() => router.push("/explore-topics")}
            className="mt-4 text-blue-500 hover:underline"
          >
            Show More Topics
          </button>
        )}
      </section>
    </aside>
  );
}
