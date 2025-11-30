"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import { useDeleteLanguage } from "@/hooks/useLanguages";
import DeleteConfirmModal from "@/components/ui/DeleteConfirmModal";
import { useLocale } from "@/context/LocaleContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  language?: {
    id: number;
    name: string;
  } | null;
}

const DeleteLanguageModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, language }) => {
  const { messages } = useLocale();
  const [message, setMessage] = useState<string | null>(null);
  const deleteLanguage = useDeleteLanguage();
  const isPending = deleteLanguage.isPending;

  useEffect(() => {
    if (!isOpen) {
      setMessage(null);
    }
  }, [isOpen]);

  const handleDelete = async () => {
    if (!language?.id) return;

    setMessage(null);

    try {
      await deleteLanguage.mutateAsync(language.id);
      setMessage(messages["delete_successfully"] || "Deleted successfully!");

      await new Promise((resolve) => setTimeout(resolve, 1000));

      onClose();
      onSuccess();
    } catch (err) {
      console.error(err);
      setMessage(messages["deleted_error"] || "An error occurred while deleting.");
    }
  };
  const messageContent = messages["delete_warning_f"] ? (
    <>
      {messages["delete_warning_f"]} <strong>{language?.name}</strong>{messages["delete_warning_s"]}
    </>
  ) : (
    `Are you sure you want to delete "${language?.name}"? This action cannot be undone.`
  );
  return (
    <DeleteConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleDelete}
      title={messages["confirm_delete"] || "Confirm Deletion"}
      message={messageContent}
      errorMessage={messages["deleted_error"] || "An error occurred while deleting."}
    />
  );
};

export default DeleteLanguageModal;