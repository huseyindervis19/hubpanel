"use client";

import React, { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import { useLocale } from "@/context/LocaleContext";
import { useUpdateProductImage } from "@/hooks/useProductImages";
import Message from "@/components/ui/Message";
import { ProductImage } from "@/types/ProductImage";

interface Props {
  img: ProductImage;
  images: ProductImage[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const EditImageModal: React.FC<Props> = ({
  img,
  images,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { messages } = useLocale();
  const updateProductImage = useUpdateProductImage();

  const [isMain, setIsMain] = useState<boolean>(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  /* =======================
     Sync state with image
  ======================= */
  useEffect(() => {
    if (!img) return;

    setIsMain(img.isMain);
    setMessage(null);
  }, [img]);

  /* =======================
     Submit
  ======================= */
  const handleEdit = async () => {
    setMessage(null);

    if (img.isMain && images.length === 1 && !isMain) {
      setMessage({
        text:
          messages["cannot_remove_main_from_only_image"] ||
          "Cannot remove main image when it is the only image.",
        type: "error",
      });
      return;
    }

    try {
      await updateProductImage.mutateAsync({
        id: img.id,
        productId: img.productId,
        payload: { isMain },
      });

      setMessage({
        text: messages["updated_successfully"] || "Updated successfully!",
        type: "success",
      });

      setTimeout(() => {
        onClose();
        onSuccess();
      }, 1200);
    } catch (err: any) {
      setMessage({
        text:
          err?.response?.data?.message ||
          messages["updated_error"] ||
          "An error occurred while updating.",
        type: "error",
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md p-6">
      {/* Header */}
      <div className="pb-4 text-center border-b border-gray-200 dark:border-gray-700">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
          {messages["edit_product_image"] || "Edit Product Image"}
        </h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {messages["edit_product_image_helper"] ||
            "Update image settings"}
        </p>
      </div>

      {/* Message */}
      <div className="mt-4">
        <Message message={message} />
      </div>

      {/* Form */}
      <div className="space-y-4 mt-4">
        {/* Main Image */}
        <div className="flex items-center gap-3">
          <input
            id="is_main"
            type="checkbox"
            checked={isMain}
            onChange={(e) => setIsMain(e.target.checked)}
            className="w-5 h-5"
          />
          <label htmlFor="is_main" className="text-sm cursor-pointer">
            {messages["is_main_helper"] || "Mark as main image"}
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex justify-end gap-3">
        <Button size="sm" variant="outline" onClick={onClose}>
          {messages["cancel"] || "Cancel"}
        </Button>
        <Button
          size="sm"
          disabled={updateProductImage.isPending}
          onClick={handleEdit}
        >
          {updateProductImage.isPending
            ? messages["updating"] || "Updating..."
            : messages["update"] || "Update"}
        </Button>
      </div>
    </Modal>
  );
};

export default EditImageModal;
