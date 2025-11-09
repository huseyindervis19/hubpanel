"use client";

import React, { useState } from "react";
import Button from "@/components/ui/button/Button";
import CategoryCard from "./CategoryCard";
import Link from "next/link";
import EditCategoryModal from "./FormModals/EditCategoryModal";
import DeleteCategoryModal from "./FormModals/DeleteCategoryModal";
import { useHasPermission } from "@/hooks/useAuth";
import { PERMISSIONS } from "@/types/Permissions";

const mockCategories = [
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
  const [selectedCategory, setSelectedCategory] = useState<typeof mockCategories[0] | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const canAddCategory = useHasPermission(PERMISSIONS.ADD_CATEGORY);
  const canEditCategory = useHasPermission(PERMISSIONS.EDIT_CATEGORY);
  const canDeleteCategory = useHasPermission(PERMISSIONS.DELETE_CATEGORY);

  const handleDropdownToggle = (categoryId: number) => {
    setOpenDropdownId(prev => (prev === categoryId ? null : categoryId));
  };

  const handleDropdownClose = () => setOpenDropdownId(null);

  const handleEdit = (category: typeof mockCategories[0]) => {
    setSelectedCategory(category);
    setEditModalOpen(true);
  };

  const handleDelete = (category: typeof mockCategories[0]) => {
    setSelectedCategory(category);
    setDeleteModalOpen(true);
  };

  const closeEditModal = () => setEditModalOpen(false);
  const closeDeleteModal = () => setDeleteModalOpen(false);

  return (
    <>
      {/* Header */}
      <div className="mb-5 flex items-center justify-between lg:mb-7">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Categories
        </h3>
        {canAddCategory && (
        <Link href="/categories/add-category">
          <Button className="h-9 px-4 text-sm">Add</Button>
        </Link>
        )}
      </div>

      {/* Modals */}
      {selectedCategory && (
        <>
        {canEditCategory && (
          <EditCategoryModal
            category={selectedCategory}
            isOpen={editModalOpen}
            onClose={closeEditModal}
            onSuccess={() => {}}
          />
          )}
          {canDeleteCategory && (
          <DeleteCategoryModal
            category={selectedCategory}
            isOpen={deleteModalOpen}
            onClose={closeDeleteModal}
            onSuccess={() => {}}
          />
          )}
        </>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockCategories.map(category => (
          <CategoryCard
            key={category.id}
            category={category}
            openDropdownId={openDropdownId}
            onDropdownToggle={() => handleDropdownToggle(category.id)}
            onDropdownClose={handleDropdownClose}
            onViewProducts={() => handleEdit(category)}
            onEdit={() => handleEdit(category)}
            onDelete={() => handleDelete(category)}
          />
        ))}
      </div>
    </>
  );
};

export default CategoriesComponent;
