"use client";

import React, { useState, useEffect } from "react";
import DeleteConfirmModal from "@/components/ui/DeleteConfirmModal";
import { useLocale } from "@/context/LocaleContext";
import { Product } from "@/types/Product";
import { useDeleteProduct } from "@/hooks/useProduct";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product?: Product | { name: string; id?: number };
}

const DeleteProductModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, product }) => {
  const { messages } = useLocale();
  const deleteProductMutation = useDeleteProduct();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const productName = product && 'translated' in product
    ? product.translated?.name
    : (product as { name?: string })?.name || "";

  useEffect(() => {
    if (!isOpen) {
      setErrorMessage(null);
      setSuccessMessage(null);
    }
  }, [isOpen]);

  const handleDeleteProduct = async (): Promise<void> => {
    if (!product?.id) return;

    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await deleteProductMutation.mutateAsync(product.id);
      const successMsg = messages["delete_successfully"] || "Deleted successfully!";
      setSuccessMessage(successMsg);
      onSuccess?.();
    } catch (err) {
      setErrorMessage(messages["delete_error"] || "An error occurred while deleting.");
      throw err;
    }
  };

  const messageContent = messages["delete_warning_f"] ? (
    <>
      {messages["delete_warning_f"]} <strong>{productName}</strong>{messages["delete_warning_s"]}
    </>
  ) : (
    `Are you sure you want to delete "${productName}"? This action cannot be undone.`
  );

  return (
    <DeleteConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleDeleteProduct}
      title={messages["confirm_delete"] || "Confirm Product Deletion"}
      message={messageContent}
      errorMessage={errorMessage || messages["delete_error"] || "An error occurred while deleting."}
      successMessage={successMessage || undefined}
    />
  );
};

export default DeleteProductModal;
