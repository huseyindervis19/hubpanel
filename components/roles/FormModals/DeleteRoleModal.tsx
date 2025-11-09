"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import { useDeleteRole } from "@/hooks/useRoles";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  role?: {
    id: number;
    name: string;
  } | null;
}

const DeleteRoleModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, role }) => {
  const [message, setMessage] = useState<string | null>(null);
  const deleteRole = useDeleteRole();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setMessage(null);
    }
  }, [isOpen]);

  const handleDelete = async () => {
    if (!role) return;

    setLoading(true);

    try {
      await deleteRole.mutateAsync(role.id);
      setMessage("Role deleted successfully!");

      await new Promise((resolve) => setTimeout(resolve, 1000));

      onClose();
      onSuccess();
    } catch (err) {
      console.error(err);
      setMessage("Error deleting role. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md p-6">
      <div className="pt-4 pb-4 text-center">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Delete Role
        </h4>

        {message && (
          <p
            className={`mb-4 font-medium ${
              message.includes("Error") ? "text-red-600" : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}

        <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
          Are you sure you want to delete the role "{role?.name}"? This action cannot be undone.
        </p>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button size="sm" variant="outline" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          size="sm"
          className="bg-red-600 hover:bg-red-700 text-white"
          onClick={handleDelete}
          disabled={loading}
        >
          {loading ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteRoleModal;
