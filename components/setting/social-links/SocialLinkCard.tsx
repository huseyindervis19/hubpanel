"use client";

import { SocialLink } from "@/types/SocialLink";
import { HorizontaLDots } from "@/icons";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import { useLocale } from "@/context/LocaleContext";

import {
  SiSnapchat,
  SiTiktok,
  SiFacebook,
  SiLinkedin,
  SiInstagram,
  SiX
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
  X: SiX
} as const;

type SocialIconName = keyof typeof SOCIAL_ICONS;

/* -------------------------------------------------------------------------- */
/*                              Dynamic Icon                                  */
/* -------------------------------------------------------------------------- */

const DynamicIcon = ({ iconName }: { iconName?: string }) => {
  if (!iconName) return null;
  const IconComponent = SOCIAL_ICONS[iconName as SocialIconName];
  if (!IconComponent) return null;
  return <IconComponent className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
};

/* -------------------------------------------------------------------------- */
/*                                Info Field                                  */
/* -------------------------------------------------------------------------- */

const InfoField = ({
  label,
  value,
  iconName
}: {
  label: string;
  value?: string;
  iconName?: string;
}) => (
  <div className="flex items-center gap-4">
    <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-400/10 shadow-sm">
      <DynamicIcon iconName={iconName} />
    </div>
    <div className="flex flex-col">
      <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {label}
      </span>
      {value ? (
        <p className="text-lg font-medium text-gray-900 dark:text-white/95 break-words">
          {value}
        </p>
      ) : (
        <p className="text-gray-400 dark:text-gray-500 italic">غير متوفر</p>
      )}
    </div>
  </div>
);

/* -------------------------------------------------------------------------- */
/*                            Social Link Card                                 */
/* -------------------------------------------------------------------------- */

interface SocialLinkCardProps {
  link: SocialLink;
  openDropdownId: number | null;
  onDropdownToggle: () => void;
  onDropdownClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const SocialLinkCard: React.FC<SocialLinkCardProps> = ({
  link,
  openDropdownId,
  onDropdownToggle,
  onDropdownClose,
  onEdit,
  onDelete
}) => {
  const isDropdownOpen = openDropdownId === link.id;
  const { locale, messages } = useLocale();
  const isRtl = locale === "ar";

  return (
    <div className="relative rounded-2xl border bg-white p-6 shadow-lg border-gray-200 dark:border-gray-800 dark:bg-white/[0.03] space-y-4">
      <div className="flex justify-between items-center">
        <InfoField label={link.platform} value={link.url} iconName={link.icon} />

        <button
          className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white ml-4"
          onClick={onDropdownToggle}
        >
          <HorizontaLDots />
        </button>
      </div>

      <Dropdown
        isOpen={isDropdownOpen}
        onClose={onDropdownClose}
        className={`w-28 origin-top-left ${isRtl ? "right-auto left-0" : "right-0 left-auto"
          } ${isRtl ? "rtl" : ""}`}
        style={{ maxWidth: "calc(100vw - 1rem)", minWidth: "max-content" }}
      >
        {onEdit && (
          <DropdownItem onItemClick={onEdit}>
            {messages["edit"] || "Edit"}
          </DropdownItem>
        )}
        {onDelete && (
          <DropdownItem onItemClick={onDelete}>
            {messages["delete"] || "Delete"}
          </DropdownItem>
        )}
      </Dropdown>
    </div>

  );
};

export default SocialLinkCard;
