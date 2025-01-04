import { Skeleton } from "@mui/material";

export default function StoryPageSkelton() {
  return (
    <div>
      <Skeleton variant="text" width="60%" height={40} />
      <div className="flex items-center space-x-4 mb-6">
        <Skeleton variant="circular" width={80} height={80} />
        <div className="text-sm font-medium">
          <Skeleton variant="text" width="50%" />
          <div className="text-sm text-gray-500">
            <Skeleton variant="text" width="30%" />
          </div>
        </div>
      </div>
      <Skeleton variant="rectangular" width="100%" height={400} />
      <div className="border-y py-5 px-2">
        <Skeleton variant="text" width="40%" />
        <div className="flex justify-between items-center text-sm text-gray-600">
          <Skeleton variant="text" width="40%" />
          <Skeleton variant="text" width="40%" />
        </div>
      </div>
      <Skeleton variant="text" width="100%" height={200} />
    </div>
  );
}
