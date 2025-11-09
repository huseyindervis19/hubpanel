"use client";

import React from "react";
import { useSidebar } from "@/context/SidebarContext";

const Backdrop: React.FC = () => {
  const { isMobileOpen, toggleMobileSidebar } = useSidebar();

  if (!isMobileOpen) return null;

  return (
    <div
      role="button"
      aria-label="Close sidebar"
      tabIndex={0}
      className="fixed inset-0 z-[40] bg-gray-900/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden"
      onClick={toggleMobileSidebar}
      onKeyDown={(e) => e.key === "Escape" && toggleMobileSidebar()}
    />
  );
};

export default Backdrop;
