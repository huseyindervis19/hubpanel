"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { HorizontaLDots } from "@/icons";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import { useLocale } from "@/context/LocaleContext";
import { Category } from "@/types/Category";
import { useHasPermission } from "@/hooks/useAuth";
import { PERMISSIONS } from "@/types/Permissions";

interface CategoryCardProps {
  category: Category;
  isDropdownOpen: boolean;
  onToggleDropdown: () => void;
  onCloseDropdown: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onViewProducts?: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  isDropdownOpen,
  onToggleDropdown,
  onCloseDropdown,
  onEdit,
  onDelete,
  onViewProducts,
}) => {
  const { locale, messages } = useLocale();
  const isRtl = locale === "ar";

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const imageUrl = category.imageUrl;
  const name = category.translated?.name ?? category.name;
  const description = category.translated?.description ?? category.description;
  const canViewCategoryProducts = useHasPermission(PERMISSIONS.VIEW_CATEGORY_PRODUCTS);
  const canEditCategory = useHasPermission(PERMISSIONS.EDIT_CATEGORY);
  const canDeleteCategory = useHasPermission(PERMISSIONS.DELETE_CATEGORY);

  return (
    <Card className="group hover:shadow-lg transition border border-gray-200 dark:border-gray-800 dark:bg-white/[0.03]">
      <CardContent className="p-0">
        {/* Image */}
        {imageUrl && (
          <div className="relative overflow-hidden rounded-t-2xl">
            <img
              src={imageUrl.startsWith("http") ? imageUrl : `${baseUrl}${imageUrl}`}
              alt={name}
              className="w-full h-48 object-cover group-hover:scale-105 transition"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-4">
          <div className="flex justify-between items-start">
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white truncate">
                {messages["category_name"] || "Category"}: {name}
              </h3>
              {description && (
                <p className="text-sm text-gray-500 dark:text-gray-300 truncate">
                  {description}
                </p>
              )}
              <p className="text-sm font-medium text-purple-600 mt-2">
                {messages["categoy_priority"] || "Priority"}: {category.priority}
              </p>
            </div>
              <div className="relative flex-shrink-0">
                <button
                  className="dropdown-toggle text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
                  disabled={!canViewCategoryProducts && !canEditCategory && !canDeleteCategory} 
                  onClick={onToggleDropdown}>
                  <HorizontaLDots />
                </button>

                <Dropdown
                  isOpen={isDropdownOpen}
                  onClose={onCloseDropdown}
                  className={`w-28 origin-top-left ${isRtl ? "right-auto left-0" : "right-0 left-auto"} ${isRtl ? "rtl" : ""} `}
                  style={{ maxWidth: "calc(100vw - 1rem)", minWidth: "max-content" }}
                >
                  {onViewProducts && canViewCategoryProducts && (
                    <DropdownItem onItemClick={onViewProducts}>
                      {messages["categoy_view_products"] || "View Products"}
                    </DropdownItem>
                  )}
                  {onEdit && canEditCategory && (
                    <DropdownItem onItemClick={onEdit}>
                      {messages["edit"] || "Edit"}
                    </DropdownItem>
                  )}
                  {onDelete && canDeleteCategory && (
                    <DropdownItem onItemClick={onDelete}>
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
