"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { SocialLink } from "@/types/SocialLink";
import { HorizontaLDots } from "@/icons";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import { useLocale } from "@/context/LocaleContext";

import { useHasPermission } from "@/hooks/useAuth";
import { PERMISSIONS } from "@/types/Permissions";

import {
  SiSnapchat,
  SiTiktok,
  SiFacebook,
  SiLinkedin,
  SiInstagram,
  SiX,
  SiYoutube
} from "react-icons/si";

/* -------------------------------------------------------------------------- */
/*                               Social Icons                                 */
/* -------------------------------------------------------------------------- */

const SOCIAL_ICONS = {
  Snapchat: SiSnapchat,
  Tiktok: SiTiktok,
  Facebook: SiFacebook,
  Linkedin: SiLinkedin,
  Instagram: SiInstagram,
  X: SiX,
  Youtube: SiYoutube
} as const;

type SocialIconName = keyof typeof SOCIAL_ICONS;

/* -------------------------------------------------------------------------- */
/*                              Dynamic Icon                                  */
/* -------------------------------------------------------------------------- */

const DynamicIcon = ({ iconName }: { iconName?: string }) => {
  if (!iconName) return null;
  const IconComponent = SOCIAL_ICONS[iconName as SocialIconName];
  if (!IconComponent) return null;

  return (
    <IconComponent className="w-5 h-5 text-blue-600 dark:text-blue-400" />
  );
};

/* -------------------------------------------------------------------------- */
/*                            Social Link Card                                 */
/* -------------------------------------------------------------------------- */

interface SocialLinkCardProps {
  link: SocialLink;
  isDropdownOpen: boolean;
  onToggleDropdown: () => void;
  onCloseDropdown: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const SocialLinkCard: React.FC<SocialLinkCardProps> = ({
  link,
  isDropdownOpen,
  onToggleDropdown,
  onCloseDropdown,
  onEdit,
  onDelete
}) => {
  const { locale, messages } = useLocale();
  const isRtl = locale === "ar";

  const canEditLink = useHasPermission(PERMISSIONS.EDIT_SOCIAL_LINKS);
  const canDeleteLink = useHasPermission(PERMISSIONS.DELETE_SOCIAL_LINKS);

  return (
    <Card className="group hover:shadow-lg transition border border-gray-200 dark:border-gray-800 dark:bg-white/[0.03]">
      <CardContent className="p-4">
        <div className="flex justify-between items-start gap-4">
          {/* Content */}
          <div className="flex items-center gap-4 min-w-0">
            {/* Icon */}
            <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-400/10 shadow-sm flex-shrink-0">
              <DynamicIcon iconName={link.icon} />
            </div>

            {/* Text */}
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                {link.platform}
              </span>

              {link.url ? (
                <p className="text-sm font-medium text-gray-900 dark:text-white/95 break-words truncate">
                  {link.url}
                </p>
              ) : (
                <p className="text-gray-400 dark:text-gray-500 italic text-sm">
                  غير متوفر
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
            <div className="relative flex-shrink-0">
              <button
                className="dropdown-toggle text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
                onClick={onToggleDropdown}
                disabled={!canEditLink && !canDeleteLink}
              >
                <HorizontaLDots />
              </button>

              <Dropdown
                isOpen={isDropdownOpen}
                onClose={onCloseDropdown}
                className={`w-28 origin-top-left ${isRtl ? "right-auto left-0" : "right-0 left-auto"
                  } ${isRtl ? "rtl" : ""}`}
                style={{
                  maxWidth: "calc(100vw - 1rem)",
                  minWidth: "max-content"
                }}
              >
                {onEdit && canEditLink && (
                  <DropdownItem onItemClick={onEdit}>
                    {messages["edit"] || "Edit"}
                  </DropdownItem>
                )}
                {onDelete && canDeleteLink && (
                  <DropdownItem onItemClick={onDelete}>
                    {messages["delete"] || "Delete"}
                  </DropdownItem>
                )}
              </Dropdown>
            </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialLinkCard;
