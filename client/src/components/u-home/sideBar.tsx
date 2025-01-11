"use client";

import RecommendedTopics from "./recommendedTopics";
import { WhoToFollow } from "./whoToFollow";

export default function Sidebar() {
  return (
    <aside className="w-full space-y-8">
      <section>
        <RecommendedTopics />
      </section>
      <section>
        <WhoToFollow />
      </section>
    </aside>
  );
}
