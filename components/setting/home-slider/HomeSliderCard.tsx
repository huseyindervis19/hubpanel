"use client";

import React from "react";
import Link from "next/link";
import { HomeSlider } from "@/types/HomeSlider";
import { Card, CardContent } from "@/components/ui/card";
import { HorizontaLDots } from "@/icons";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import { useLocale } from "@/context/LocaleContext";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

interface Props {
  slider: HomeSlider;
  openDropdownId: number | null;
  onDropdownToggle: () => void;
  onDropdownClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const HomeSliderCard: React.FC<Props> = ({ slider, openDropdownId, onDropdownToggle, onDropdownClose, onEdit, onDelete }) => {
  const imgSrc = slider.imageUrl?.startsWith("http") ? slider.imageUrl : `${baseUrl}${slider.imageUrl}`;
  const isDropdownOpen = openDropdownId === slider.id;
  const { locale, messages } = useLocale();
  const isRtl = locale === "ar";

  return (
    <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <CardContent className="p-0">
        <div className="relative overflow-hidden rounded-t-2xl">
          {slider.imageUrl && (
            <img
              src={imgSrc}
              alt={slider.translated?.title || "slider"}
              width={400}
              height={192}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          )}
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 dark:bg-black/30 dark:group-hover:bg-black/20 transition-colors duration-300 rounded-t-2xl" />
        </div>

        <div className="p-4 flex items-start justify-between">
          <div className="flex-1 min-w-0 space-y-2">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white truncate">
              {messages["slider_title"] || "Title"}: {slider.translated?.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-300 truncate">
              {messages["slider_subtitle"] || "Sub Title"}: {slider.translated?.subTitle}
            </p>

            {slider.translated?.ctaText && slider.ctaLink && (
              <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:gap-2">
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  {messages["slider_cta_link"] || "CTA Link"}:
                </p>

                <Link
                  href={slider.ctaLink}
                  className="inline-block mt-1 sm:mt-0 px-4 py-2 bg-blue-600 text-white dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg text-sm font-medium hover:bg-blue-700 transition-all duration-300 shadow-sm hover:shadow-md truncate"
                >
                  {slider.translated.ctaText}
                </Link>
              </div>
            )}
          </div>
          <div className="relative flex-shrink-0">
            <button
              className="dropdown-toggle text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
              onClick={onDropdownToggle}
            >
              <HorizontaLDots />
            </button>

            <Dropdown
              isOpen={isDropdownOpen}
              onClose={onDropdownClose}
              className={`w-28 origin-top-left ${isRtl ? "right-auto left-0" : "right-0 left-auto"} ${isRtl ? "rtl" : ""}`}
              style={{ maxWidth: "calc(100vw - 1rem)", minWidth: "max-content" }}
            >
              {onEdit && (
                <DropdownItem
                  onItemClick={onEdit}
                >
                  {messages["edit"] || "Edit"}
                </DropdownItem>
              )}
              {onDelete && (
                <DropdownItem
                  onItemClick={onDelete}
                >
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

export default HomeSliderCard;
