"use client";

import { PencilIcon } from "@/icons";

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
  const rolesText = user.userRoles?.map((ur) => ur.role.name).join(", ") || "-";

  const infoFields = [
    { label: "Username", value: user.username },
    { label: "Email", value: user.email },
    { label: "Roles", value: rolesText },
    { label: "Language", value: user.language?.name || "-" },
  ];

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Personal Info
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-7 2xl:gap-x-32">
            {infoFields.map(({ label, value }) => (
              <div key={label}>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">{label}</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <button
          className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:w-auto"
          onClick={onEdit}
        >
          <PencilIcon />
          Edit
        </button>
      </div>
    </div>
  );
};

export default UserInfoCard;
