"use client";

import React, { useEffect, useState } from "react";
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

const DeleteImageModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSuccess,
  img,
}) => {
  const { messages } = useLocale();
  const deleteImage = useDeleteProductImage();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  /* =======================
     Reset state on close
  ======================= */
  useEffect(() => {
    if (!isOpen) {
      setErrorMessage(null);
      setSuccessMessage(null);
    }
  }, [isOpen]);

  /* =======================
     Delete handler
  ======================= */
  const handleDeleteImage = async () => {
    if (!img) return;
    console.log('is main', img);

    // Prevent deleting the only main image
    if (img.isMain) {
      const msg =
        messages["cannot_remove_main_from_only_image"] ||
        "Cannot remove main image when it is the only image.";

      setErrorMessage(msg);
      throw new Error(msg);
    }

    try {
      await deleteImage.mutateAsync({
        id: img.id,
        productId: img.productId,
      });

      setSuccessMessage(
        messages["delete_successfully"] || "Deleted successfully!"
      );

      onSuccess?.();
    } catch (err: any) {
      setErrorMessage(
        err?.response?.data?.message ||
        messages["deleted_error"] ||
        "An error occurred while deleting."
      );
    }
  };

  const imageLabel =
    messages["this_image"] || "this image";

  const messageContent = messages["delete_warning_f"] ? (
    <>
      {messages["delete_warning_f"]}{" "}
      <strong>{imageLabel}</strong>{" "}
      {messages["delete_warning_s"]}
    </>
  ) : (
    `Are you sure you want to delete ${imageLabel}? This action cannot be undone.`
  );

  return (
    <DeleteConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleDeleteImage}
      title={messages["confirm_delete"] || "Confirm Deletion"}
      message={messageContent}
      errorMessage={errorMessage || undefined}
      successMessage={successMessage || undefined}
    />
  );
};

export default DeleteImageModal;
