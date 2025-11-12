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
      setMessage(messages["delete_success"]?.replace("Deleted", "Language deleted") || "Language deleted successfully!");

      await new Promise((resolve) => setTimeout(resolve, 1000));

      onClose();
      onSuccess();
    } catch (err) {
      console.error(err);
      setMessage(messages["error"] || "Error deleting language. Please try again.");
    }
  };

  return (
    <DeleteConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleDelete}
      title={messages["confirm_delete"] || "Confirm language Deletion"}
      message={
        <>
          {messages["delete_warning"] 
            ? messages["delete_warning"].replace("{name}", language?.name || "")
            : <>Are you sure you want to delete <strong>"{language?.name}"</strong>? This action cannot be undone.</>
          }
        </>
      }
      errorMessage={messages["delete_failed"] || "Error deleting language. This language might be in use or protected."}
    />
  );
};

export default DeleteLanguageModal;