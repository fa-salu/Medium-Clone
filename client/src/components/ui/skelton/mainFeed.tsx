import { Skeleton } from "@mui/material";

export default function MainFeedSkeleton() {
  const skeletonKeys = ["key1", "key2", "key3", "key4", "key5"];

  return (
    <div className="space-y-6">
      <Skeleton variant="rectangular" width="75%" height={40} />

      {skeletonKeys.map((key) => (
        <div key={key} className="p-4 border-b space-y-2 flex flex-col">
          <div className="flex items-center space-x-2">
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="text" width={120} />
          </div>
          <div className="flex justify-between">
            <Skeleton variant="text" width="60%" height={24} />
            <Skeleton variant="rectangular" width={96} height={96} />
          </div>
          <div className="flex justify-between items-center text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <Skeleton variant="text" width={80} />
              <Skeleton variant="text" width={40} height={20} />
              <Skeleton variant="text" width={40} height={20} />
            </div>
            <div className="flex items-center space-x-4">
              <Skeleton variant="text" width={100} height={20} />
              <Skeleton variant="text" width={100} height={20} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
