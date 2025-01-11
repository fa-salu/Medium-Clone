"use client";

import * as React from "react";
import Button from "@mui/material/Button";
import Link from "next/link";
import LoginDialog from "@/components/Auth/login";
import RegisterDialog from "@/components/Auth/register";

export default function HeroNavbar() {
  const [isLoginDialogOpen, setLoginDialogOpen] = React.useState(false);
  const [isRegisterDialogOpen, setRegisterDialogOpen] = React.useState(false);

  const handleLoginDialogOpen = () => {
    setLoginDialogOpen(true);
  };

  const handleRegisterDialogOpen = () => {
    setRegisterDialogOpen(true);
  };

  const handleLoginDialogClose = () => {
    setLoginDialogOpen(false);
  };

  const handleRegisterDialogClose = () => {
    setRegisterDialogOpen(false);
  };

  return (
    <header className="flex justify-between items-center px-4 sm:px-36 py-4 border-b border-gray-500">
      <div className="flex items-center">
        <h1 className="text-3xl font-serif font-bold">Medium</h1>
      </div>
      <nav className="flex space-x-6 ml-auto items-center">
        <Link
          href="/home"
          className="text-gray-800 text-[14px] hover:text-black hidden md:flex"
        >
          Our story
        </Link>
        <Link
          href="/home"
          className="text-gray-800 text-[14px] hover:text-black hidden md:flex"
        >
          Membership
        </Link>
        <Link
          href="/home"
          className="text-gray-800 text-[14px] hover:text-black hidden md:flex"
        >
          Write
        </Link>
        <Link
          href={""}
          onClick={handleLoginDialogOpen}
          className="text-gray-800 text-[14px] hover:text-black hidden md:flex"
        >
          Sign in
        </Link>
        <Button
          onClick={handleRegisterDialogOpen}
          sx={{ textTransform: "none" }}
          className="!bg-black !text-white px-4 py-2 !rounded-full text-[12px] shadow-md"
        >
          Get started
        </Button>
      </nav>
      <LoginDialog open={isLoginDialogOpen} onClose={handleLoginDialogClose} />
      <RegisterDialog
        open={isRegisterDialogOpen}
        onClose={handleRegisterDialogClose}
      />
    </header>
  );
}
