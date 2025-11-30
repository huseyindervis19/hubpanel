"use client";

import React from "react";
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

  const handleDeleteRole = async (): Promise<void> => {
    if (!role?.id) {
      return Promise.reject(new Error("Role ID is missing."));
    }

    try {
      await deleteRole.mutateAsync(role.id);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      onSuccess();

      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
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

      errorMessage={messages["deleted_error"] || "An error occurred while deleting."}
    />
  );
};

export default DeleteRoleModal;