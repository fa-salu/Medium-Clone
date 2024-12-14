"use client";

import React from "react";
import { signOut } from "next-auth/react";
import Cookies from "js-cookie";
export default function Page() {
  const handleLogOut = () => {
    Cookies.remove("user");
    signOut();
  };
  return (
    <div>
      {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
      <button onClick={handleLogOut}>Sign out</button>
    </div>
  );
}
