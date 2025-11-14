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

  const handleDelete = async () => {
    if (!user?.id) return;

    try {
      await deleteUser.mutateAsync(user.id);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onClose();
      onSuccess();

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DeleteConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleDelete}
      title={messages["confirm_delete"] || "An error occurred while deleting."}
      message={
        <>
          {messages["delete_warning"] 
            ? messages["delete_warning"].replace("{name}", user?.username || "")
            : <>Are you sure you want to delete <strong>"{user?.username}"</strong>? This action cannot be undone.</>
          }
        </>
      }
      errorMessage={messages["delete_failed"] || "An error occurred while deleting."}
    />
  );
};

export default DeleteUserModal;