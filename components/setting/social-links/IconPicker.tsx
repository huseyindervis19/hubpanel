"use client";

import { useState } from "react";
import {
  SiSnapchat,
  SiTiktok,
  SiFacebook,
  SiLinkedin,
  SiInstagram,
  SiX
} from "react-icons/si";
import * as SiIcons from "react-icons/si";

/* -------------------------------------------------------------------------- */
/*                                Icon Config                                 */
/* -------------------------------------------------------------------------- */

const SOCIAL_ICONS = {
  Snapchat: SiSnapchat,
  Tiktok: SiTiktok,
  Facebook: SiFacebook,
  Linkedin: SiLinkedin,
  Instagram: SiInstagram,
  X: SiX
} as const;

export type IconName = keyof typeof SOCIAL_ICONS;

const AVAILABLE_ICONS: IconName[] = [
  "Snapchat",
  "Tiktok",
  "Facebook",
  "Linkedin",
  "Instagram",
  "X"
];

/* -------------------------------------------------------------------------- */
/*                                   Props                                    */
/* -------------------------------------------------------------------------- */

interface IconPickerProps {
  value: IconName | "";
  onChange: (iconName: IconName) => void;
}

/* -------------------------------------------------------------------------- */
/*                                Component                                   */
/* -------------------------------------------------------------------------- */

export const IconPicker: React.FC<IconPickerProps> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
console.log("all icons",Object.keys(SiIcons));

  const SelectedIcon = value ? SOCIAL_ICONS[value] : null;

  return (
    <div className="relative">
      {/* Trigger */}
      <button
        type="button"
        className="flex w-full items-center gap-2 rounded-lg border border-gray-300 bg-white p-2 dark:border-gray-700 dark:bg-gray-800"
        onClick={() => setOpen(prev => !prev)}
      >
        {SelectedIcon && (
          <SelectedIcon size={22} className="text-gray-700 dark:text-gray-300" />
        )}
        <span className="text-sm font-medium text-gray-700 dark:text-gray-400">
          {value || "Select Social Icon"}
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-full max-h-64 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
          <div className="grid grid-cols-6 gap-1 p-1">
            {AVAILABLE_ICONS.map(iconName => {
              const IconComponent = SOCIAL_ICONS[iconName];

              return (
                <button
                  key={iconName}
                  type="button"
                  className={`flex h-9 w-9 items-center justify-center rounded-md border
                    ${
                      value === iconName
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/40"
                        : "border-gray-200 dark:border-gray-700"
                    }
                    hover:bg-gray-100 dark:hover:bg-white/5`}
                  onClick={() => {
                    onChange(iconName);
                    setOpen(false);
                  }}
                  title={iconName}
                >
                  <IconComponent size={20} />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
