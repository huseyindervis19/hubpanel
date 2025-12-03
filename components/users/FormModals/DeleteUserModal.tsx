"use client";

import React, { useState, useEffect } from "react";
import DeleteConfirmModal from "@/components/ui/DeleteConfirmModal";
import { useDeleteUser } from "@/hooks/useUsers";
import { useLocale } from "@/context/LocaleContext";


interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user?: {
    id: number;
    username: string;
  } | null;
}
const DeleteUserModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, user }) => {
  const { messages } = useLocale();
  const deleteUser = useDeleteUser();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setErrorMessage(null);
      setSuccessMessage(null);
    }
  }, [isOpen]);

  const handleDelete = async () => {
    if (!user?.id) return;

    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await deleteUser.mutateAsync(user.id);
      const successMsg = messages["delete_successfully"] || "Deleted successfully!";
      setSuccessMessage(successMsg);
      onSuccess?.();

    } catch (err) {
      setErrorMessage(messages["delete_error"] || "An error occurred while deleting.");
      throw err;
    }
  };

  const messageContent = messages["delete_warning_f"] ? (
    <>
      {messages["delete_warning_f"]} <strong>{user?.username}</strong>{messages["delete_warning_s"]}
    </>
  ) : (
    `Are you sure you want to delete "${user?.username}"? This action cannot be undone.`
  );

  return (
    <DeleteConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleDelete}
      title={messages["confirm_delete"] || "An error occurred while deleting."}
      message={messageContent}
      errorMessage={errorMessage || messages["delete_error"] || "An error occurred while deleting."}
      successMessage={successMessage || undefined}
    />
  );
};

export default DeleteUserModal;