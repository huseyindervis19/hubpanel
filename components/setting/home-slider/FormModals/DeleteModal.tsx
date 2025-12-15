"use client";

import React, { useState, useEffect } from "react";
import DeleteConfirmModal from "@/components/ui/DeleteConfirmModal";
import { useLocale } from "@/context/LocaleContext";
import { HomeSlider } from "@/types/HomeSlider";
import { useDeleteHomeSlider } from "@/hooks/useHomeSlider";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  slider?: HomeSlider | null;
}

const DeleteModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, slider }) => {
  const { messages } = useLocale();
  const deleteHomeSlider = useDeleteHomeSlider();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);


  useEffect(() => {
    if (!isOpen) {
      setErrorMessage(null);
      setSuccessMessage(null);
    }
  }, [isOpen]);

  const handleDelete = async (): Promise<void> => {
    if (!slider?.id) return;
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await deleteHomeSlider.mutateAsync(slider.id);
      const successMsg = messages["delete_successfully"] || "Deleted successfully!";
      setSuccessMessage(successMsg);
      onSuccess?.();
    } catch (err) {
      console.error(err);
      setErrorMessage(messages["deleted_error"] || "An error occurred while deleting.");
      throw err;
    }
  };

  const name = slider?.translated?.title || "this slider";

  const messageContent = messages["delete_warning_f"] ? (
    <>
      {messages["delete_warning_f"]} <strong>{name}</strong>{messages["delete_warning_s"]}
    </>
  ) : (
    `Are you sure you want to delete "${name}"? This action cannot be undone.`
  );

  return (
    <DeleteConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleDelete}
      title={messages["confirm_delete"] || "Confirm Deletion"}
      message={messageContent}
      errorMessage={errorMessage || messages["delete_error"] || "An error occurred while deleting."}
      successMessage={successMessage || undefined}
    />
  );
};

export default DeleteModal;
