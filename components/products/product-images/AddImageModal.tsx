"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import { useLocale } from "@/context/LocaleContext";
import { useCreateProductImage } from "@/hooks/useProductImages";
import Label from "@/components/form/Label";
import Message from "@/components/ui/Message";

interface Props {
  productId: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddImageModal: React.FC<Props> = ({ productId, isOpen, onClose, onSuccess }) => {
  const { messages } = useLocale();
  const createProductImage = useCreateProductImage();

  const [file, setFile] = useState<File | null>(null);
  const [isMain, setIsMain] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handleSubmit = async () => {
    setMessage(null);

    if (!file) {
      setMessage({ text: messages["file_required"] || "Please select an image file.", type: "error" });
      return;
    }

    try {
      await createProductImage.mutateAsync({ payload: { productId, isMain }, file });
      setMessage({ text: messages["created_successfully"] || "Created successfully!", type: "success" });

      setTimeout(() => {
        onSuccess();
        onClose();
        setFile(null);
        setIsMain(false);
        setMessage(null);
      }, 1000);
    } catch (err: any) {
      setMessage({
        text: err?.response?.data?.message || messages["created_error"] || "An error occurred while creating.",
        type: "error",
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md p-6">
      <div className="pb-4 text-center border-b border-gray-200 dark:border-gray-700">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
          {messages["add_product_image"] || "Add Product Image"}
        </h4>
      </div>

      <div className="mt-4">
        <Message message={message} />
      </div>

      <div className="space-y-4 mt-4">
        <Label>{messages["product_image_label"] || "Product Image"}</Label>
        <label className="block border-2 border-dashed rounded-lg p-6 text-center cursor-pointer">
          <input type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          {file ? file.name : messages["select_image"] || "Select image"}
        </label>

        <div className="flex items-center gap-2">
          <input type="checkbox" checked={isMain} onChange={(e) => setIsMain(e.target.checked)} />
          <span>{messages["is_main_helper"] || "Set as main image"}</span>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button variant="outline" size="sm" onClick={onClose}>
          {messages["cancel"] || "Cancel"}
        </Button>
        <Button size="sm" disabled={createProductImage.isPending} onClick={handleSubmit}>
          {createProductImage.isPending ? messages["creating"] || "Creating..." : messages["create"] || "Create"}
        </Button>
      </div>
    </Modal>
  );
};

export default AddImageModal;
