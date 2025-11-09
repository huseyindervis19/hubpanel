"use client";

import React from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product?: {
    name: string;
  };
}

const DeleteProductModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, product }) => {
  const handleDelete = () => {
    // Here you can add API call to delete the product
    // Example: await deleteProduct(product.id);
    onSuccess(); // Notify parent component after deletion
    onClose();   // Close the modal
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md p-6">
      <div className="pt-4 pb-4 text-center">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Confirm Deletion
        </h4>

        <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
          Are you sure you want to delete "{product?.name}"? This action cannot be undone.
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

export default DeleteProductModal;
