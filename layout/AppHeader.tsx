"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggleButton } from "@/components/common/ThemeToggleButton";
import UserDropdown from "@/components/header/UserDropdown";
import { useSidebar } from "@/context/SidebarContext";
import LanguageSwitcher from "@/components/header/LanguageSwitcher";

const AppHeader: React.FC = () => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleToggle = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  const toggleApplicationMenu = () => {
    setApplicationMenuOpen(!isApplicationMenuOpen);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        (event.metaKey || event.ctrlKey) &&
        event.key === "k" &&
        document.activeElement?.tagName !== "INPUT"
      ) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-[110] flex w-full bg-white border-gray-200 dark:border-gray-800 dark:bg-gray-900 lg:border-b">
      <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
        {/* Left Section */}
        <div className="flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-gray-200 dark:border-gray-800 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">
          {/* Sidebar Toggle Button */}
          <button
            className="flex items-center justify-center w-10 h-10 text-gray-600 border border-gray-200 rounded-lg dark:border-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 lg:h-11 lg:w-11"
            onClick={handleToggle}
            aria-label="Toggle Sidebar"
          >
            {isMobileOpen ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="transition-colors duration-200"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.22 7.28c-.29-.29-.29-.76 0-1.06s.77-.29 1.06 0L12 10.94l4.72-4.72c.29-.29.76-.29 1.06 0s.29.77 0 1.06L13.06 12l4.72 4.72c.29.29.29.77 0 1.06s-.77.29-1.06 0L12 13.06l-4.72 4.72c-.29.29-.76.29-1.06 0s-.29-.77 0-1.06L10.94 12 6.22 7.28Z"
                  fill="currentColor"
                />
              </svg>
            ) : (
              <svg
                width="16"
                height="12"
                viewBox="0 0 16 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="transition-colors duration-200"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0.58 1c0-.41.34-.75.75-.75h13.33c.41 0 .75.34.75.75s-.34.75-.75.75H1.33A.75.75 0 0 1 .58 1Zm0 10c0-.41.34-.75.75-.75h13.33c.41 0 .75.34.75.75s-.34.75-.75.75H1.33a.75.75 0 0 1-.75-.75ZM1.33 5.25c-.41 0-.75.34-.75.75s.34.75.75.75H8c.41 0 .75-.34.75-.75s-.34-.75-.75-.75H1.33Z"
                  fill="currentColor"
                />
              </svg>
            )}
          </button>

          {/* Logo for Mobile */}
          <Link href="/" className="lg:hidden">
            <div className="flex items-center gap-3">
              <Image
                priority
                className="dark:hidden"
                src="/images/logo/light-theme-logo.png"
                alt="Logo"
                width={200}
                height={40}
              />
              <Image
                priority
                className="hidden dark:block"
                src="/images/logo/dark-theme-logo.png"
                alt="Logo"
                width={200}
                height={40}
              />
            </div>
          </Link>

          {/* Application Menu (three dots) */}
          <button
            onClick={toggleApplicationMenu}
            className="flex items-center justify-center w-10 h-10 text-gray-600 rounded-lg hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 lg:hidden"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="transition-colors duration-200"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6 10.5c.83 0 1.5.67 1.5 1.5S6.83 13.5 6 13.5 4.5 12.83 4.5 12 5.17 10.5 6 10.5Zm12 0c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5S16.5 13.33 16.5 12 17.17 10.5 18 10.5ZM12 10.5c.83 0 1.5.67 1.5 1.5S12.83 13.5 12 13.5 10.5 12.83 10.5 12 11.17 10.5 12 10.5Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>

        {/* Right Section */}
        <div
          className={`${isApplicationMenuOpen ? "flex" : "hidden"} items-center justify-between w-full gap-4 px-5 py-4 lg:flex shadow-theme-md lg:justify-end lg:px-12 lg:shadow-none`}
        >
          <div className="flex items-center gap-2 2xsm:gap-3">
            <LanguageSwitcher />
            <ThemeToggleButton />
          </div>

          <UserDropdown />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
