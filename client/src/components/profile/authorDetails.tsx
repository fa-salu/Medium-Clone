import Image from "next/image";
import { Button } from "@mui/material";
import { useAppDispatch } from "@/lib/hooks";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import { useEffect } from "react";
import { fetchUserDetails } from "@/lib/features/authSlice";
import Link from "next/link";
import AuthorDetailsSkeleton from "../ui/skelton/authorDeatails";

export default function AuthorDetails() {
  const dispatch = useAppDispatch();
  const { user, status, error } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (!user) {
      dispatch(fetchUserDetails());
    }
  }, [dispatch, user]);

  const isLoading = status === "loading";

  if (status === "failed" || error) {
    return <p>Error: {error}</p>;
  }

  return (
    <>
      {isLoading ? (
        <div>
          <AuthorDetailsSkeleton />
        </div>
      ) : (
        <div className="space-y-4 p-6">
          <div className="items-center space-y-3 text-center">
            {user ? (
              <>
                <div className="relative w-24 h-24 mx-auto">
                  <Image
                    src={user.imageUri}
                    alt={user.name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-full bg-gray-500"
                  />
                </div>
                <p className="text-lg font-semibold">{user.name}</p>
                <Link href={"/me/settings/account"}>
                  <Button
                    sx={{
                      color: "green",
                      fontSize: "0.75rem",
                    }}
                  >
                    Edit Profile
                  </Button>
                  <p>{user.bio}</p>
                </Link>
              </>
            ) : (
              <p>No user details available</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
