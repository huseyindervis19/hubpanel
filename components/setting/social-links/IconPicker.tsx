"use client";

import { useState } from "react";
import * as Icons from "lucide-react";
import { useLocale } from "@/context/LocaleContext";

export type IconName = keyof typeof Icons;

const AVAILABLE_ICONS: IconName[] = [
    "Facebook",
    "Instagram",
    "Twitter",
    "Linkedin",
    "Youtube",
    "Mail",
    "Phone",
    "Globe",
    "User",
    "Users",
    "Star",
    "Heart",
    "Check",
    "X"
];

interface IconPickerProps {
    value: IconName | "";
    onChange: (iconName: IconName) => void;
}

export const IconPicker: React.FC<IconPickerProps> = ({ value, onChange }) => {
      const { messages } = useLocale();
    const [open, setOpen] = useState(false);
    const SelectedIcon = value ? (Icons as any)[value] : null;

    return (
        <div className="relative">
            <button
                type="button"
                className="flex items-center gap-2 w-full rounded-lg border border-gray-300 bg-white p-2 dark:border-gray-700 dark:bg-gray-800"
                onClick={() => setOpen(prev => !prev)}
            >
                {SelectedIcon && <SelectedIcon size={24} className="text-gray-700 dark:text-gray-300" />}
                <span>{value || "Select Icon"}</span>
            </button>

            {open && (
                <div className="absolute top-full left-0 z-50 mt-1 w-full max-h-64 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
                    <div className="grid grid-cols-5 gap-1 p-1">
                        {AVAILABLE_ICONS.map(iconName => {
                            const IconComponent = (Icons as any)[iconName];
                            if (!IconComponent) return null;
                            return (
                                <button
                                    key={iconName}
                                    type="button"
                                    className={`flex h-10 w-10 items-center justify-center rounded-lg border ${value === iconName
                                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/50"
                                        : "border-gray-200 dark:border-gray-700"
                                        } hover:bg-gray-100 dark:hover:bg-white/5`}
                                    onClick={() => {
                                        onChange(iconName as IconName);
                                        setOpen(false);
                                    }}
                                >
                                    <IconComponent size={24} className="text-gray-700 dark:text-gray-300" />
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};
