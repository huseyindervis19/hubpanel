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

interface Category {
  id: number;
  name: string;
  description: string;
  image_url: string;
  productsCount: number;
}

const mockCategories: Category[] = [
  {
    id: 1,
    name: "Electronics",
    description: "Latest gadgets and devices",
    image_url:
      "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=400&q=80",
    productsCount: 12,
  },
  {
    id: 2,
    name: "Clothing",
    description: "Fashionable apparel",
    image_url:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80",
    productsCount: 8,
  },
  {
    id: 3,
    name: "Books",
    description: "All kinds of books",
    image_url:
      "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=400&q=80",
    productsCount: 25,
  },
  {
    id: 4,
    name: "Home & Kitchen",
    description: "Essentials for home",
    image_url:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80",
    productsCount: 15,
  },
];

const CategoriesComponent: React.FC = () => {
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const canAddCategory = useHasPermission(PERMISSIONS.ADD_CATEGORY);
  const canEditCategory = useHasPermission(PERMISSIONS.EDIT_CATEGORY);
  const canDeleteCategory = useHasPermission(PERMISSIONS.DELETE_CATEGORY);
  const { messages } = useLocale();

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
        <TitleComponent title={messages["nav_products_categories"] || "Categories"} />
        {canAddCategory && (
          <Link href="/categories/add-category">
            <Button className="h-9 px-4 text-sm">{messages["add"] || "Create"}</Button>
          </Link>
        )}
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockCategories.map(category => (
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
              onSuccess={() => { }}
            />
          )}
          {canDeleteCategory && (
            <DeleteCategoryModal
              category={selectedCategory}
              isOpen={deleteModalOpen}
              onClose={closeDeleteModal}
              onSuccess={() => { }}
            />
          )}
        </>
      )}
    </>
  );
};

export default CategoriesComponent;