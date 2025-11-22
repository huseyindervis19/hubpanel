"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { HorizontaLDots } from "@/icons";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import { useLocale } from "@/context/LocaleContext";
import { Category } from "@/types/Category";

interface CategoryCardProps {
  category: Category;
  openDropdownId: number | null;
  onDropdownToggle: () => void;
  onDropdownClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onViewProducts?: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  openDropdownId,
  onDropdownToggle,
  onDropdownClose,
  onEdit,
  onDelete,
  onViewProducts,
}) => {
  const isDropdownOpen = openDropdownId === category.id;
  const { locale, messages } = useLocale();
  const isRtl = locale === "ar";

  const t = category.translated;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const imageUrl = category.imageUrl ;

  return (
    <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <CardContent className="p-0">
        <div className="relative overflow-hidden rounded-t-2xl">
          {imageUrl && (
            <img
              src={imageUrl.startsWith("http") ? imageUrl : `${baseUrl}${imageUrl}`}
              alt={t?.name || category.name}
              width={400}
              height={192}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          )}
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 dark:bg-black/30 dark:group-hover:bg-black/20 transition-colors duration-300 rounded-t-2xl" />
        </div>

        <div className="p-4 flex flex-col justify-between h-full">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-1 truncate">
                {t?.name || category.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 truncate">
                {t?.description || category.description}
              </p>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400 truncate">
                {messages["product_count"] || "Product Count"}: 0
              </p>
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
                {onViewProducts && (
                  <DropdownItem
                    onItemClick={onViewProducts}
                    className="text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {messages["view_products"] || "View Products"}
                  </DropdownItem>
                )}
                {onEdit && (
                  <DropdownItem
                    onItemClick={onEdit}
                    className="text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {messages["edit"] || "Edit"}
                  </DropdownItem>
                )}
                {onDelete && (
                  <DropdownItem
                    onItemClick={onDelete}
                    className="text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {messages["delete"] || "Delete"}
                  </DropdownItem>
                )}
              </Dropdown>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;
