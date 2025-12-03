"use client";

import React, { useState, useEffect } from "react";
import DeleteConfirmModal from "@/components/ui/DeleteConfirmModal";
import { useDeleteRole } from "@/hooks/useRoles";
import { Role } from "@/types/Role";
import { useLocale } from "@/context/LocaleContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  role: Role | null;
}

const DeleteRoleModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, role }) => {
  const { messages } = useLocale();
  const deleteRole = useDeleteRole();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setErrorMessage(null);
      setSuccessMessage(null);
    }
  }, [isOpen]);

  const handleDeleteRole = async (): Promise<void> => {
    if (!role?.id) return;

    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await deleteRole.mutateAsync(role.id);
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
      {messages["delete_warning_f"]} <strong>{role?.name}</strong>{messages["delete_warning_s"]}
    </>
  ) : (
    `Are you sure you want to delete "${role?.name}"? This action cannot be undone.`
  );

  return (
    <DeleteConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleDeleteRole}
      title={messages["confirm_delete"] || "An error occurred while deleting."}
      message={messageContent}
      errorMessage={errorMessage || messages["delete_error"] || "An error occurred while deleting."}
      successMessage={successMessage || undefined}
    />
  );
};

export default DeleteRoleModal;