import { Notifications } from "@mui/icons-material";
import { Avatar, IconButton } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import PublishButton from "@/components/ui/publishButton";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import type { RootState } from "@/lib/store";
import { useEffect } from "react";
import { fetchUserDetails } from "@/lib/features/authSlice";

interface BarProps {
  setShowIcons: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Bar({ setShowIcons }: BarProps) {
  const user = useAppSelector((state: RootState) => state.user?.user);
  const dispatch = useAppDispatch();

  const handleAddIconClick = () => {
    setShowIcons((prev) => !prev);
  };
  useEffect(() => {
    dispatch(fetchUserDetails());
  }, [dispatch]);

  return (
    <div className="flex sticky top-0 justify-between items-center px-3 sm:px-52 py-1 sm:py-4 rounded-lg z-50">
      <div className="flex items-end">
        <Link href="/u-home">
          <h1 className="text-lg sm:text-3xl font-semibold">Medium</h1>
        </Link>
        <p className="text-[8px] ml-3 text-gray-500">Draft in {user?.name}</p>
      </div>
      <div className="flex items-center sm:space-x-6">
        <PublishButton />
        <IconButton className="p-2 hover:bg-gray-200 rounded-full">
          <Notifications />
        </IconButton>
        <IconButton
          className="p-2 hover:bg-gray-200 rounded-full"
          onClick={handleAddIconClick}
        >
          <AddCircleIcon />
        </IconButton>
        <IconButton className="hover:bg-gray-200 rounded-full">
          <Avatar
            alt={user?.name}
            src={user?.imageUri}
            sx={{
              width: { xs: 24, sm: 32, md: 40 },
              height: { xs: 24, sm: 32, md: 40 },
            }}
          />
        </IconButton>
      </div>
    </div>
  );
}
