import type React from "react";
import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";

interface DropdownItemProps {
  tag?: "a" | "button";
  href?: string;
  onClick?: () => void;
  onItemClick?: () => void;
  baseClassName?: string;
  className?: string;
  children: React.ReactNode;
}

export const DropdownItem: React.FC<DropdownItemProps> = ({
  tag = "button",
  href,
  onClick,
  onItemClick,
  baseClassName = `
    block w-full px-4 py-2 text-sm
    text-gray-700 dark:text-gray-400
    hover:bg-gray-100 dark:hover:bg-gray-700
    hover:text-gray-900 dark:hover:text-gray-200
    transition
  `,
  className = "",
  children,
}) => {
  const { locale } = useLocale();
  const isRtl = locale === "ar";

  const combinedClasses = `
    ${baseClassName}
    ${className}
    ${isRtl ? "text-right" : "text-left"}
  `.trim();

  const handleClick = (event: React.MouseEvent) => {
    if (tag === "button") {
      event.preventDefault();
    }
    onClick?.();
    onItemClick?.();
  };

  if (tag === "a" && href) {
    return (
      <Link href={href} className={combinedClasses} onClick={handleClick}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={handleClick} className={combinedClasses}>
      {children}
    </button>
  );
};
