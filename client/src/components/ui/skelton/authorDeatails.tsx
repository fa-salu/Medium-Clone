import { Skeleton } from "@mui/material";

export default function AuthorDetailsSkeleton() {
  return (
    <div className="space-y-4 p-6">
      <div className="items-center space-y-3 text-center">
        <Skeleton variant="circular" width={96} height={96} />

        <Skeleton variant="text" width="60%" />

        <Skeleton variant="rectangular" width={100} height={30} />

        <Skeleton variant="text" width="80%" />
      </div>
    </div>
  );
}
