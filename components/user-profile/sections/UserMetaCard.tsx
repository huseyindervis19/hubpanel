"use client";

import Image from "next/image";
import { PencilIcon } from "@/icons";
import { useLocale } from "@/context/LocaleContext";

type Props = {
  user: {
    username: string;
    userRoles?: { role: { id: number; name: string; description?: string } }[];
  };
  onEdit: () => void;
};

const UserMetaCard = ({ user, onEdit }: Props) => {
  const { messages } = useLocale();
  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
          {/* User Image/Avatar */}
          <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
            <Image
              src="/images/user/user-1.png"
              alt="user"
              width={80}
              height={80}
            />
          </div>
          
          <div className="order-3 xl:order-2">
            {/* Username */}
            <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
              {user.username}
            </h4>
            
            {/* Roles */}
            <div className="flex flex-wrap justify-center gap-2 text-sm xl:justify-start">
              {user.userRoles && user.userRoles.length > 0 ? (
                user.userRoles.map((ur) => (
                  <span
                    key={ur.role.id}
                    className="inline-flex items-center rounded-full bg-blue-100 px-3 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                  >
                    {ur.role.name}
                  </span>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">-</p>
              )}
            </div>

          </div>
        </div>
        
        {/* Edit Button */}
        <button
          className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:w-auto"
          onClick={onEdit}
        >
          <PencilIcon />
          {messages["edit"] || "Edit"}
        </button>
      </div>
    </div>
  );
}

export default UserMetaCard;