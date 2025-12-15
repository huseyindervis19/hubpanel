"use client";

import React, { useState, useEffect } from "react";
import DeleteConfirmModal from "@/components/ui/DeleteConfirmModal";
import { useLocale } from "@/context/LocaleContext";
import { Category } from "@/types/Category";
import { useDeleteCategory } from "@/hooks/useCategory";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  category?: Category | null;
}

const DeleteCategoryModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, category }) => {
  const { messages } = useLocale();
  const deleteCategory = useDeleteCategory();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setErrorMessage(null);
      setSuccessMessage(null);
    }
  }, [isOpen]);

  const handleDelete = async (): Promise<void> => {
    if (!category?.id) return;

    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await deleteCategory.mutateAsync(category.id);
      const successMsg = messages["delete_successfully"] || "Deleted successfully!";
      setSuccessMessage(successMsg);
      onSuccess?.();
    } catch (err) {
      setErrorMessage(messages["deleted_error"] || "An error occurred while deleting.");
      throw err;
    }
  };

  const categoryName = category?.translated?.name || category?.name || "this category";

  const messageContent = messages["delete_warning_f"] ? (
    <>
      {messages["delete_warning_f"]} <strong>{categoryName}</strong>{messages["delete_warning_s"]}
    </>
  ) : (
    `Are you sure you want to delete "${categoryName}"? This action cannot be undone.`
  );

  return (
    <DeleteConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleDelete}
      title={messages["confirm_delete"] || "Confirm Deletion"}
      message={messageContent}
      errorMessage={errorMessage || messages["delete_error"] || "An error occurred while deleting."}
      successMessage={successMessage || undefined}
    />
  );
};

export default DeleteCategoryModal;
