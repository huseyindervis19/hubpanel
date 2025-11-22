"use client";

import React from "react";
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

  // Get product name and id - support both new Product type and legacy format
  const productName = product && 'translated' in product 
    ? product.translated?.name 
    : (product as { name?: string })?.name || "";

  const productId = product && 'id' in product ? product.id : undefined;

  const handleDeleteProduct = async (): Promise<void> => {
    if (!productId) {
      throw new Error("Product ID is required");
    }

    try {
      await deleteProductMutation.mutateAsync(productId);
      if (onSuccess) onSuccess();
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Failed to delete product");
    }
  };

  return (
    <DeleteConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleDeleteProduct}
      title={messages["confirm_delete"] || "Confirm Product Deletion"}
      message={
        <>
          {messages["delete_warning"] 
            ? messages["delete_warning"].replace("{name}", productName || "")
            : <>Are you sure you want to delete <strong>"{productName}"</strong>? This action cannot be undone.</>
          }
        </>
      }
      errorMessage={messages["delete_failed"] || "Error deleting product. The product may be linked to active orders."}
    />
  );
};

export default DeleteProductModal;