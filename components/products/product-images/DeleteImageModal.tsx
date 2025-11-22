import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import { useLocale } from "@/context/LocaleContext";
import { useDeleteProductImage } from "@/hooks/useProductImages";
import { ProductImage } from "@/types/ProductImage";

interface Props {
  img: ProductImage;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const DeleteImageModal: React.FC<Props> = ({ img, isOpen, onClose, onSuccess }) => {
  const { messages } = useLocale();
  const deleteProductImage = useDeleteProductImage();

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  const handleDelete = async () => {
    setError(null);
    setSuccessMessage("");
    try {
      await deleteProductImage.mutateAsync({
        id: img.id,
        productId: img.productId,
      });
      setSuccessMessage(messages["delete_success"] || "Deleted successfully");
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1000);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || messages["delete_failed"] || "Delete failed";
      setError(errorMessage);
      console.error(err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md p-6">
      <div className='pt-4 pb-4 text-center'>
        <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          {messages["confirm_delete"] || "Confirm Deletion"}
        </h4>
        {successMessage && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 shadow-sm dark:border-green-700 dark:bg-green-900/30 dark:text-green-300 animate-in slide-in-from-top-2 duration-300">
            <svg
              className="h-5 w-5 flex-shrink-0 text-green-500 dark:text-green-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 
          1 0 00-1.414-1.414L9 10.586 7.707 
          9.293a1 1 0 00-1.414 1.414l2 
          2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <p className="font-medium">{successMessage}</p>
          </div>
        )}

        <p className="text-sm text-gray-500 dark:text-gray-400">
          {(messages["delete_warning"] ||
            `Are you sure you want to delete "${img?.alt_text ?? ""}"? This action cannot be undone.`)
            .replace("{name}", img?.alt_text ?? "")}
        </p>
      </div>
      {error && <p className="text-red-500 mt-3">{error}</p>}

      <div className="mt-6 flex justify-end gap-3">
        <Button size="sm" variant="outline" onClick={onClose}>
          {messages["cancel"] || "Cancel"}
        </Button>
        <Button
          size="sm"
          className="bg-red-600 hover:bg-red-700 text-white"
          disabled={deleteProductImage.isPending}
          onClick={handleDelete}
        >
          {deleteProductImage.isPending
            ? messages["deleting"] || "Deleting..."
            : messages["delete"] || "Delete"}
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteImageModal;
