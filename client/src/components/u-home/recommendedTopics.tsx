import { fetchTopics } from "@/lib/features/topicSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import type { RootState } from "@/lib/store";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import RecommendedSkelton from "../ui/skelton/recommendePage";

export default function RecommendedTopics() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { topics, loading } = useAppSelector((state: RootState) => state.topic);

  useEffect(() => {
    dispatch(fetchTopics());
  }, [dispatch]);

  return (
    <div>
      <section>
        <h3 className="text-lg font-semibold mt-3 mb-4">Recommended Topics</h3>
        {loading ? (
          <RecommendedSkelton />
        ) : (
          <div className="flex flex-wrap gap-2">
            {topics && topics.length > 0 ? (
              topics.slice(0, 4).map((topic) => (
                <span
                  key={topic}
                  className="px-3 py-1 border dark:border-white light:border-black text-sm rounded-full"
                >
                  {topic}
                </span>
              ))
            ) : (
              <p>No topics available.</p>
            )}
          </div>
        )}
        {topics && topics.length > 4 && (
          <button
            type="button"
            onClick={() => router.push("/explore-topics")}
            className="mt-4 text-sm hover:underline"
          >
            Show More Topics
          </button>
        )}
      </section>
    </div>
  );
}
