"use client";
import { useState, useEffect } from "react";
import { Menu, MenuItem, IconButton } from "@mui/material";
import { Brightness4, Brightness7, Create } from "@mui/icons-material";
import Cookies from "js-cookie";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import AvatarComponent from "@/components/Navbar/avatar";
import Link from "next/link";
import { useAppDispatch } from "@/lib/hooks";
import { resetStory } from "@/lib/features/storySlice";
import SearchComponent from "../search/search";
import { useThemeContext } from "@/providers/theme-provider";

export default function Navbar() {
  const { toggleTheme, isDarkMode } = useThemeContext();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showNavbar, setShowNavbar] = useState(true);
  const open = Boolean(anchorEl);
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
    dispatch(resetStory());
  };

  const handleProfileClick = () => {
    router.push("/profile");
    setAnchorEl(null);
  };

  const handleWriters = () => {
    router.push("/follow-users");
    setAnchorEl(null);
  };

  const handleSettings = () => {
    router.push("/me/settings/account");
    setAnchorEl(null);
  };

  return (
    <motion.nav
      initial={{ y: 0 }}
      animate={{
        y: showNavbar ? 0 : -80,
      }}
      transition={{ type: "tween", duration: 0.3 }}
      className="sticky top-0 left-0 right-0 z-50 flex justify-between  dark:bg-black light:bg-white items-center px-4 py-2 border-b shadow-sm"
    >
      <Link href="/u-home">
        <div className="text-lg md:text-2xl font-bold">Medium</div>
      </Link>

      <SearchComponent />

      <div className="flex ">
        <IconButton onClick={handleCreateClick}>
          <Create />
        </IconButton>

        <IconButton onClick={toggleTheme}>
          {isDarkMode ? <Brightness7 /> : <Brightness4 />}
        </IconButton>

        {/* <IconButton>
          <Notifications />
        </IconButton> */}

        <IconButton onClick={handleMenuClick}>
          <AvatarComponent />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
          <MenuItem onClick={handleWriters} className="md:hidden">
            Writers
          </MenuItem>
          <MenuItem onClick={handleSettings}>Settings</MenuItem>
          <MenuItem onClick={handleLogOut}>Sign Out</MenuItem>
        </Menu>
      </div>
    </motion.nav>
  );
}
