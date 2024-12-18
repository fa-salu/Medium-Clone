"use client";

import React from "react";
import Navbar from "@/components/Navbar/Navbar";
import MainContent from "@/components/u-home/mainContent";
import RightSidebar from "@/components/u-home/rightSidebar";
export default function Page() {
  return (
    <div>
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex max-w-6xl mx-auto mt-8">
          <MainContent />
          <RightSidebar />
        </div>
      </div>
    </div>
  );
}
