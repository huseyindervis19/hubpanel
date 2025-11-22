import React, { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import { useLocale } from "@/context/LocaleContext";
import { useUpdateProductImage } from "@/hooks/useProductImages";
import { ProductImage } from "@/types/ProductImage";

interface Props {
  img: ProductImage;
  isOpen: boolean;
  images: ProductImage[];
  onClose: () => void;
  onSuccess: () => void;
}

const EditImageModal: React.FC<Props> = ({ img, images, isOpen, onClose, onSuccess }) => {
  const { messages } = useLocale();
  const updateProductImage = useUpdateProductImage();

  const [altText, setAltText] = useState(img?.alt_text || "");
  const [isMain, setIsMain] = useState(img?.isMain || false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Reset state whenever a new image is passed in
  useEffect(() => {
    if (img) {
      setAltText(img.alt_text || "");
      setIsMain(img.isMain || false);
      if (img.isMain && images.length === 1) {
        setIsMain(true);
      }

      setError(null);
      // setSuccessMessage("");
    }
  }, [img, images]);

  const handleEdit = async () => {
    if (img.isMain && images.length === 1 && isMain === false) {
      setError(
        messages["cannot_remove_main_from_only_image"] ||
        "Cannot remove main from the product's only image."
      );
      return;
    }

    try {
      await updateProductImage.mutateAsync({
        id: img.id,
        data: {
          isMain,
        },
        productId: img.productId,
      });
      setSuccessMessage(messages["image_updated_successfully"] || "Image updated successfully");

      setTimeout(() => {
        onClose();
        onSuccess();
      }, 2000);
    } catch (err: any) {
      setError(err?.response?.data?.message || messages["failed_to_update_image"] || "Failed to update image.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md p-6">
      {/* Header */}
      <div className="pb-4 text-center border-b border-gray-200 dark:border-gray-700">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
          {messages["edit_product_image"] || "Edit Product Image"}
        </h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {messages["edit_product_image_helper"] || "Update the details of this product image"}
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 shadow-sm dark:border-green-700 dark:bg-green-900/30 dark:text-green-300 animate-in slide-in-from-top-2 duration-300">
          ✅ <p className="font-medium">{successMessage}</p>
        </div>
      )}

      {/* Form */}
      <div className="space-y-4 mt-4">
        {/* Alt Text */}
        <input
          type="text"
          placeholder={messages["alt_text"] || "Alt text"}
          value={altText}
          onChange={(e) => setAltText(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all duration-200 ease-in-out"
        />

        {/* Main Image Checkbox */}
        <div className="flex items-center space-x-3">
          <input
            id="is_main"
            name="is_main"
            type="checkbox"
            checked={isMain}
            onChange={(e) => setIsMain(e.target.checked)}
            className="w-5 h-5 text-brand-500 border-gray-300 rounded focus:ring-brand-500 dark:bg-gray-800 dark:border-gray-600"
          />
          <label htmlFor="is_main" className="text-sm text-gray-700 dark:text-white cursor-pointer">
            {messages["is_main_helper"] || "Mark this image as the main image"}
          </label>
        </div>
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}

      {/* Action Buttons */}
      <div className="mt-6 flex justify-end gap-3">
        <Button size="sm" variant="outline" onClick={onClose}>
          {messages["cancel"] || "Cancel"}
        </Button>
        <Button
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-white"
          disabled={updateProductImage.isPending}
          onClick={handleEdit}
        >
          {updateProductImage.isPending
            ? messages["saving"] || "Saving..."
            : messages["save_changes"] || "Save Changes"}
        </Button>
      </div>
    </Modal>
  );
};

export default EditImageModal;
