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

  return (
    <DeleteConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleDeleteRole} 
      title={messages["confirm_delete"] || "An error occurred while deleting."}
      message={
        <>
          {messages["delete_warning"] 
            ? messages["delete_warning"].replace("{name}", role?.name || "")
            : <>Are you sure you want to delete the role <strong>"{role?.name}"</strong>? This action cannot be undone.</>
          }
        </>
      }
      errorMessage={messages["delete_failed"] || "An error occurred while deleting."}
    />
  );
};

export default DeleteRoleModal;