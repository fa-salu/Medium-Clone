import Image from "next/image";
import { Button } from "@mui/material";
import { useAppDispatch } from "@/lib/hooks";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import { useEffect } from "react";
import { fetchUserDetails } from "@/lib/features/authSlice";

export default function AuthorDetails() {
  const dispatch = useAppDispatch();
  const { user, status, error } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (!user) {
      dispatch(fetchUserDetails());
    }
  }, [dispatch, user]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "failed" || error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="space-y-4 p-6">
      <div className="items-center space-y-3">
        {user ? (
          <>
            <Image
              src={user.imageUri}
              alt={user.name}
              width={100}
              height={100}
              className="rounded-full bg-gray-500"
            />
            <p>{user.name}</p>
            <Button
              sx={{
                color: "green",
                fontSize: "0.75rem",
              }}
            >
              Edit Profile
            </Button>
          </>
        ) : (
          <p>No user details available</p>
        )}
      </div>
    </div>
  );
}
