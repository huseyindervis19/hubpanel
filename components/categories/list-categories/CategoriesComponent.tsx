"use client";

import React, { useState } from "react";
import Button from "@/components/ui/button/Button";
import CategoryCard from "./CategoryCard";
import Link from "next/link";
import EditCategoryModal from "./FormModals/EditCategoryModal";
import DeleteCategoryModal from "./FormModals/DeleteCategoryModal";
import { useHasPermission } from "@/hooks/useAuth";
import { PERMISSIONS } from "@/types/Permissions";
import TitleComponent from "@/components/ui/TitleComponent";
import { useLocale } from "@/context/LocaleContext";
import { useAllCategories } from "@/hooks/useCategory"; // استخدم hook الجديد
import { Category } from "@/types/Category";

const CategoriesComponent: React.FC = () => {
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const { messages, locale } = useLocale();
  const canAddCategory = useHasPermission(PERMISSIONS.ADD_CATEGORY);
  const canEditCategory = useHasPermission(PERMISSIONS.EDIT_CATEGORY);
  const canDeleteCategory = useHasPermission(PERMISSIONS.DELETE_CATEGORY);

  const { data: categoriesResponse, isLoading, refetch } = useAllCategories(locale);
  const categories = categoriesResponse?.data || [];

  // ---------------- Handlers ----------------
  const handleDropdownToggle = (categoryId: number) => {
    setOpenDropdownId(prev => (prev === categoryId ? null : categoryId));
  };

  const handleDropdownClose = () => setOpenDropdownId(null);

  const handleOpenEditModal = (category: Category) => {
    setSelectedCategory(category);
    setEditModalOpen(true);
    handleDropdownClose();
  };

  const handleOpenDeleteModal = (category: Category) => {
    setSelectedCategory(category);
    setDeleteModalOpen(true);
    handleDropdownClose();
  };

  const closeEditModal = () => setEditModalOpen(false);
  const closeDeleteModal = () => setDeleteModalOpen(false);

  return (
    <>
      {/* Header */}
      <div className="mb-5 flex items-center justify-between lg:mb-7">
        <TitleComponent title={messages["products_categories"] || "Products Categories"} />
        {canAddCategory && (
          <Link href="/categories/add-category">
            <Button className="h-9 px-4 text-sm">{messages["create"] || "Create"}</Button>
          </Link>
        )}
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map(category => (
          <CategoryCard
            key={category.id}
            category={category}
            openDropdownId={openDropdownId}
            onDropdownToggle={() => handleDropdownToggle(category.id)}
            onDropdownClose={handleDropdownClose}
            onViewProducts={() => { }}
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
              onClose={closeEditModal}
              onSuccess={() => refetch()}
            />
          )}
          {canDeleteCategory && (
            <DeleteCategoryModal
              category={selectedCategory}
              isOpen={deleteModalOpen}
              onClose={closeDeleteModal}
              onSuccess={() => refetch()}
            />
          )}
        </>
      )}
    </>
  );
};

export default CategoriesComponent;