"use client";

import React, { useState, useEffect } from "react";
import DeleteConfirmModal from "@/components/ui/DeleteConfirmModal";
import { useLocale } from "@/context/LocaleContext";
import { HomeSlider } from "@/types/HomeSlider";
import { useHomeSlider } from "@/hooks/useHomeSlider";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  slider?: HomeSlider | null;
}

const DeleteSliderModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, slider }) => {
  const { messages, locale } = useLocale();
  const { remove } = useHomeSlider(locale);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) setMessage(null);
  }, [isOpen]);

  const handleDelete = async (): Promise<void> => {
    if (!slider?.id) return;
    setMessage(null);
    try {
      await remove(slider.id);
      const successMsg = messages["delete_successfully"] || "Deleted successfully!";
      setMessage(successMsg);
      onSuccess?.();
    } catch (err) {
      console.error(err);
      setMessage(messages["delete_failed"] || "An error occurred while deleting.");
      throw err;
    }
  };

  const name = slider?.translated?.title || "this slider";

  return (
    <DeleteConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleDelete}
      title={messages["confirm_delete"] || "Confirm Deletion"}
      message={
        messages["delete_warning"]
          ? messages["delete_warning"].replace("{name}", name)
          : <>{`Are you sure you want to delete "${name}"? This action cannot be undone.`}</>
      }
      errorMessage={messages["delete_failed"] || "An error occurred while deleting."}
    />
  );
};

export default DeleteSliderModal;
