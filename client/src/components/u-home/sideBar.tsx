"use client";

import RecommendedTopics from "./recommendedTopics";
import { WhoToFollow } from "./whoToFollow";

export default function Sidebar() {
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
        <RecommendedTopics />
      </section>
      <section>
        <WhoToFollow />
      </section>
    </aside>
  );
}
