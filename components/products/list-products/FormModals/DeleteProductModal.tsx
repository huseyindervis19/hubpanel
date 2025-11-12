"use client";

import React from "react";
import DeleteConfirmModal from "@/components/ui/DeleteConfirmModal";
import { useLocale } from "@/context/LocaleContext"; 

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product?: {
    name: string;
    id?: number; 
  };
}

const DeleteProductModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, product }) => {
  const { messages } = useLocale();

  const handleDeleteProduct = async (): Promise<void> => {
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {   
        if (product?.name?.includes("Smartphone")) { 
            reject(new Error("Product deletion restricted for Smartphones."));
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
      onConfirm={handleDeleteProduct}
      title={messages["confirm_delete"] || "Confirm Product Deletion"}
      message={
        <>
          {messages["delete_warning"] 
            ? messages["delete_warning"].replace("{name}", product?.name || "")
            : <>Are you sure you want to delete <strong>"{product?.name}"</strong>? This action cannot be undone.</>
          }
        </>
      }
      errorMessage={messages["delete_failed"] || "Error deleting product. The product may be linked to active orders."}
    />
  );
};

export default DeleteProductModal;