"use client";

import React, { useState, useEffect } from "react";
import DeleteConfirmModal from "@/components/ui/DeleteConfirmModal";
import { useLocale } from "@/context/LocaleContext";
import { ProductImage } from "@/types/ProductImage";
import { useDeleteProductImage } from "@/hooks/useProductImages";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  img?: ProductImage | null;
}

const DeleteImageModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, img }) => {
  const { messages } = useLocale();
  const deleteImage = useDeleteProductImage();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setErrorMessage(null);
      setSuccessMessage(null);
    }
  }, [isOpen]);

  const handleDeleteImage = async (): Promise<void> => {
    if (!img?.id || !img.productId) return;

    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await deleteImage.mutateAsync({ id: img.id, productId: img.productId });
      const successMsg = messages["delete_successfully"] || "Deleted successfully!";
      setSuccessMessage(successMsg);
      onSuccess?.();
    } catch (err) {
      setErrorMessage(messages["deleted_error"] || "An error occurred while deleting.");
    }
  };

  const imageName = img?.alt_text || "this image";

  const messageContent = messages["delete_warning_f"] ? (
    <>
      {messages["delete_warning_f"]} <strong>{imageName}</strong>{messages["delete_warning_s"]}
    </>
  ) : (
    `Are you sure you want to delete "${imageName}"? This action cannot be undone.`
  );

  return (
    <DeleteConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleDeleteImage}
      title={messages["confirm_delete"] || "Confirm Deletion"}
      message={messageContent}
      errorMessage={errorMessage || messages["delete_failed"] || "An error occurred while deleting."}
      successMessage={successMessage || undefined}
    />
  );
};

export default DeleteImageModal;
