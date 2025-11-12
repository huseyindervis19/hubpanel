"use client";

import React from "react";
import DeleteConfirmModal from "@/components/ui/DeleteConfirmModal";
import { useLocale } from "@/context/LocaleContext"; 

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  category?: {
    name: string;
    id?: number; 
  };
}

const DeleteCategoryModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, category }) => {
  const { messages } = useLocale();

  const handleDeleteCategory = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (category?.name === "Electronics") {
          reject(new Error("Cannot delete essential category: Electronics"));
          return;
        }

        if (onSuccess) onSuccess();
        resolve();

      }, 1200);
    });
  };

  return (
    <DeleteConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleDeleteCategory}
      title={messages["confirm_delete"] || "Confirm Category Deletion"}
      message={
        <>
          {messages["delete_warning"] 
            ? messages["delete_warning"].replace("{name}", category?.name || "")
            : <>Are you sure you want to delete <strong>"{category?.name}"</strong>? This action cannot be undone.</>
          }
        </>
      }
      errorMessage={messages["delete_failed"] || "Error deleting category. This category might be in use or protected."}
    />
  );
};

export default DeleteCategoryModal;