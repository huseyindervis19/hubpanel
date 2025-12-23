"use client";

import React, { useState } from "react";
import Button from "@/components/ui/button/Button";
import { useRouter } from "next/navigation";
import CategoryCard from "./CategoryCard";
import Link from "next/link";
import EditCategoryModal from "./FormModals/EditCategoryModal";
import DeleteCategoryModal from "./FormModals/DeleteCategoryModal";
import { useHasPermission } from "@/hooks/useAuth";
import { PERMISSIONS } from "@/types/Permissions";
import TitleComponent from "@/components/ui/TitleComponent";
import { useLocale } from "@/context/LocaleContext";
import { useCategories } from "@/hooks/useCategory";
import { Category } from "@/types/Category";

const CategoriesComponent: React.FC = () => {
  const { messages, locale } = useLocale();
  const router = useRouter();

  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const canAddCategory = useHasPermission(PERMISSIONS.ADD_CATEGORY);
  const canEditCategory = useHasPermission(PERMISSIONS.EDIT_CATEGORY);
  const canDeleteCategory = useHasPermission(PERMISSIONS.DELETE_CATEGORY);

  const { data: categories = [], isLoading, refetch } = useCategories(locale);

  const handleDropdownToggle = (id: number) => {
    setOpenDropdownId(prev => (prev === id ? null : id));
  };

  const handleOpenEditModal = (category: Category) => {
    setSelectedCategory(category);
    setEditModalOpen(true);
    setOpenDropdownId(null);
  };

  const handleOpenDeleteModal = (category: Category) => {
    setSelectedCategory(category);
    setDeleteModalOpen(true);
    setOpenDropdownId(null);
  };

  if (isLoading) {
    return <p className="text-center py-10">{messages["loading"] || "Loading..."}</p>;
  }

  return (
    <>
      {/* Header */}
      <div className="mb-5 flex items-center justify-between lg:mb-7">
        <TitleComponent title={messages["products_categories"] || "Products Categories"} />
        {canAddCategory && (
          <Link href="/categories/add-category">
            <Button className="h-9 px-4 text-sm">
              {messages["create"] || "Create"}
            </Button>
          </Link>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(category => (
          <CategoryCard
            key={category.id}
            category={category}
            isDropdownOpen={openDropdownId === category.id}
            onToggleDropdown={() => handleDropdownToggle(category.id)}
            onCloseDropdown={() => setOpenDropdownId(null)}
            onViewProducts={() =>
              router.push(
                `/categories/${category.id}/products?name=${encodeURIComponent(
                  category.translated?.name ?? category.name
                )}`
              )
            }
            onEdit={canEditCategory ? () => handleOpenEditModal(category) : undefined}
            onDelete={canDeleteCategory ? () => handleOpenDeleteModal(category) : undefined}
          />
        ))}
      </div>

      {/* Modals */}
      {selectedCategory && (
        <>
          {canEditCategory && (
            <EditCategoryModal
              category={selectedCategory}
              isOpen={editModalOpen}
              onClose={() => setEditModalOpen(false)}
              onSuccess={refetch}
            />
          )}
          {canDeleteCategory && (
            <DeleteCategoryModal
              category={selectedCategory}
              isOpen={deleteModalOpen}
              onClose={() => setDeleteModalOpen(false)}
              onSuccess={refetch}
            />
          )}
        </>
      )}
    </>
  );
};

export default CategoriesComponent;
