"use client";
import { useState } from "react";
import { Avatar, Menu, MenuItem, IconButton } from "@mui/material";
import { Notifications, Create } from "@mui/icons-material";
import Cookies from "js-cookie";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const router = useRouter();

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogOut = () => {
    setAnchorEl(null);
    Cookies.remove("user");
    signOut();
  };

  const handleCreateClick = () => {
    router.push("/new-story");
  };

  return (
    <nav className="flex justify-between items-center px-4 py-2 border-b shadow-sm">
      <div className="text-2xl font-bold">Medium</div>

      <input
        type="text"
        placeholder="Search"
        className="border rounded-lg px-4 py-1 focus:outline-none"
      />

      <div className="flex space-x-4">
        <IconButton onClick={handleCreateClick}>
          <Create />
        </IconButton>

        <IconButton>
          <Notifications />
        </IconButton>

        <IconButton onClick={handleMenuClick}>
          <Avatar
            alt="Remy Sharp"
            src="https://img.freepik.com/premium-vector/avatar-icon0002_750950-43.jpg?ga=GA1.1.478860807.1733286450&semt=ais_hybrid"
          />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem onClick={handleClose}>Profile</MenuItem>
          <MenuItem onClick={handleClose}>Settings</MenuItem>
          <MenuItem onClick={handleLogOut}>Sign Out</MenuItem>
        </Menu>
      </div>
    </nav>
  );
}
