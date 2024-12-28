"use client";

export default function Sidebar() {
  const staffPicks = [
    "It happened on Medium in 2024",
    "Best gifts for writers",
    "Most-highlighted sentences",
  ];

  const topics = ["Self Improvement", "Cryptocurrency", "Writing", "Python"];

  return (
    <aside className="w-1/3 space-y-8">
      <section>
        <h3 className="text-lg font-semibold mb-4">Staff Picks</h3>
        <ul className="space-y-2">
          {staffPicks.map((pick, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <li key={index} className="text-gray-700">
              {pick}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h3 className="text-lg font-semibold mb-4">Recommended Topics</h3>
        <div className="flex flex-wrap gap-2">
          {topics.map((topic) => (
            <span
              key={topic}
              className="px-3 py-1 bg-gray-100 text-sm rounded-full"
            >
              {topic}
            </span>
          ))}
        </div>
      </section>
    </aside>
  );
}
