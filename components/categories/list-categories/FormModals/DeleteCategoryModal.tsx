"use client";

import React from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import { Category } from "@/types/Category";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  category: Partial<Category>;
}

const DeleteCategoryModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, category }) => {
  const handleDelete = () => {
    // Call API or perform deletion logic here
    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md p-6">
      <div className="pt-4 pb-4 text-center">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Confirm Deletion
        </h4>

        <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
          Are you sure you want to delete <strong>"{category.name}"</strong>? This action cannot be undone.
        </p>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button size="sm" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          size="sm"
          className="bg-red-600 hover:bg-red-700 text-white"
          onClick={handleDelete}
        >
          Delete
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteCategoryModal;
