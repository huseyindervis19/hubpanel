"use client";

import React, { useMemo } from "react";
import { PencilIcon } from "@/icons";
import TitleComponent from "@/components/ui/TitleComponent";
import { useLocale } from "@/context/LocaleContext";

type Props = {
  user: {
    username: string;
    email: string;
    userRoles?: { role: { id: number; name: string; description?: string } }[];
    language?: { id: number; code: string; name: string };
  };
  onEdit: () => void;
};

const UserInfoCard = ({ user, onEdit }: Props) => {
  const { messages } = useLocale();
  const RolesDisplay = useMemo(() => {
    if (!user.userRoles || user.userRoles.length === 0) {
      return <p className="text-sm font-medium text-gray-800 dark:text-white/90">-</p>;
    }

    return (
      <div className="flex flex-wrap gap-2">
        {user.userRoles.map((ur) => (
          <span
            key={ur.role.id}
            className="inline-flex items-center rounded-full bg-blue-100 px-3 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
          >
            {ur.role.name}
          </span>
        ))}
      </div>
    );
  }, [user.userRoles]);

  const infoFields = [
    { label: messages["username"] || "Username", value: user.username },
    { label: messages["email"] || "Email", value: user.email },
    { label: messages["nav_roles"] || "Roles", element: RolesDisplay },
    { label: "Language", value: user.language?.name || "-" },
  ];

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <TitleComponent
            title={messages["personal_info"] || "Personal Info"}
            className="lg:mb-6"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-7 2xl:gap-x-32">
            {infoFields.map((field) => (
              <div key={field.label}>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">{field.label}</p>

                {/* Render the element if it exists, otherwise render the plain value */}
                {field.element ? (
                  field.element
                ) : (
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {field.value}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

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
};

export default UserInfoCard;