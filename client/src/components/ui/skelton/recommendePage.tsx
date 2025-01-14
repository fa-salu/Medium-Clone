import { v4 as uuidv4 } from "uuid";

export default function RecommendedSkelton() {
  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: 4 }).map(() => (
        <div
          key={uuidv4()}
          className="px-3 py-1 border animate-pulse text-sm rounded-full"
        />
      ))}
    </div>
  );
}
