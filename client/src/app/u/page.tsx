"use client";

import React from "react";
import { signOut } from "next-auth/react";
export default function Page() {
  return (
    <div>
      {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
}
