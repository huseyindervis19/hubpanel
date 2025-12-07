"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { useLocale } from "@/context/LocaleContext";
import { useCurrentUser } from "@/hooks/useAuth";
import { useContactInfo } from "@/hooks/useContactInformations";

import {
  ChevronDownIcon,
  UserCircleIcon,
  LogoutIcon,
  SupportIcon
} from "@/icons";

const UserDropdown = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { messages, locale } = useLocale();
  const isRtl = locale === "ar";

  const { data: currentUser, isLoading } = useCurrentUser();
  const { data: contactInformation } = useContactInfo(locale)  

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function toggleDropdown() {
    setIsOpen((prev) => !prev);
  }
  const handleSignOut = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("token_exp");

    router.replace("/signin");
  };

  function closeDropdown() {
    setIsOpen(false);
  }

  if (isLoading) {
    return <div className="h-11 w-11 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>;
  }

  const username = currentUser?.username || messages["user"] || "User";
  const email = currentUser?.email || "-";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dark:text-gray-400"
      >
        <span className="mr-2 overflow-hidden rounded-full h-10 w-10">
          <Image
            width={44}
            height={44}
            src="/images/user/user-1.png"
            alt={`${username} Avatar`}
          />
        </span>
        <span className="block mr-2 font-medium text-theme-sm">{username}</span>

        <ChevronDownIcon />
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className={`flex flex-col rounded-2xl border border-gray-200 bg-white p-2 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark`}
        style={{
          maxWidth: "calc(100vw - 1rem)",
          minWidth: "180px",
          [isRtl ? "right" : "left"]: 0,
        }}
      >
        <div>
          <span className="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
            {username}
          </span>
          <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
            {email}
          </span>
        </div>
        <ul className="flex flex-col gap-1 pt-3 pb-3 border-b border-gray-200 dark:border-gray-800">
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              href="/profile"
              className="flex items-center gap-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              <UserCircleIcon />
              {messages["edit_profile"] || "Edit Profile"}
            </DropdownItem>
          </li>
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              // href={`https://wa.me/${contactInformation?.phone}`}
              href="https://wa.me/90504615016"
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              <SupportIcon />
              {messages["support"] || "Support"}

            </DropdownItem>

          </li>
        </ul>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
        >
          <LogoutIcon />
          {messages["sign_out"] || "Sign Out"}
        </button>
      </Dropdown>
    </div>
  );
}
export default UserDropdown;