import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import { useLocale } from "@/context/LocaleContext";
import { useCreateProductImage } from "@/hooks/useProductImages";
import Label from "@/components/form/Label";
import InputField from "@/components/form/input/InputField";

interface Props {
  productId: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddImageModal: React.FC<Props> = ({
  productId,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { messages } = useLocale();
  const createProductImage = useCreateProductImage();

  const [file, setFile] = useState<File | null>(null);
  const [altText, setAltText] = useState("");
  const [isMain, setIsMain] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async () => {
    setError(null);

    if (!file) {
      return setError(messages["file_required"] || "Please select an image file.");
    }

    try {
      await createProductImage.mutateAsync({
        data: {
          productId,
          isMain,
        },
        file,
      });
      setSuccessMessage(
        messages["created_successfully"] || "Created successfully!"
      );
      setTimeout(() => {
        onSuccess();
        onClose();
        setFile(null);
        setAltText("");
        setIsMain(false);
        setSuccessMessage("");
      }, 1000);
    } catch (err: any) {
      setError(err?.response?.data?.message || messages["created_error"] || "An error occurred while creating.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md p-6">
      {/* Header */}
      <div className="pb-4 text-center border-b border-gray-200 dark:border-gray-700">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
          {messages["add_product_image"] || "Add Product Image"}
        </h4>
      </div>

      {/* Messages */}
      {successMessage && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 shadow-sm dark:border-green-700 dark:bg-green-900/30 dark:text-green-300">
          ✅ <p className="font-medium">{successMessage}</p>
        </div>
      )}
      {error && (
        <p className="mt-3 text-sm text-red-500">
          {error}
        </p>
      )}

      {/* Form */}
      <div className="space-y-4 mt-4">
        {/* Image Upload & Alt Text */}
        <div className="space-y-4 mt-4">
          {/* Image Upload */}
          <Label htmlFor="file" className="text-md font-semibold text-gray-800 dark:text-white/90 flex items-center">
            {messages["product_image_label"] || "Product Image"}
          </Label>
          <label className="block w-full border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center cursor-pointer hover:border-brand-500 transition">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="hidden"
            />
            <span className="text-gray-400 dark:text-gray-300">
              {file ? "" : messages["select_image"] || "Click to select an image"}
            </span>
            {file && (
              <div className="mt-2 text-gray-800 dark:text-white">{file.name}</div>
            )}
          </label>
          <div>

            <Label htmlFor="alt_text" className="text-md text-gray-800 dark:text-white/90">{messages["alt_text_label"] || "Alt Text"}</Label>
            <InputField
              type="text"
              placeholder={messages["alt_text_input"] || "enter alt text"}
              className="placeholder:text-gray-800 dark:placeholder:text-white/90" value={altText}
              onChange={(e) => setAltText(e.target.value)}
            />
          </div>
        </div>

        {/* Main Image Checkbox */}
        <div className="flex items-center gap-3">
          <input
            id="is_main"
            type="checkbox"
            checked={isMain}
            onChange={(e) => setIsMain(e.target.checked)}
            className="w-5 h-5 text-brand-500 border-gray-300 rounded focus:ring-brand-500 dark:bg-gray-800 dark:border-gray-600"
          />
          <label
            htmlFor="is_main"
            className="text-sm text-gray-700 dark:text-white cursor-pointer"
          >
            {messages["is_main_helper"] || "Mark this image as the main image"}
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
          className="bg-blue-600 hover:bg-blue-700 text-white"
          disabled={createProductImage.isPending}
          onClick={handleSubmit}
        >
          {createProductImage.isPending
            ? messages["creating"] || "Creating..."
            : messages["create"] || "Create"}
        </Button>
      </div>
    </Modal>
  );
};

export default AddImageModal;
