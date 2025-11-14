"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import { usePermissions } from "@/hooks/usePermissions";
import { useRolePermissions, useUpdateRolePermissions } from "@/hooks/useRolePermissions";
import Label from "@/components/form/Label";
import Checkbox from "@/components/form/input/Checkbox";
import { LoadingIcon } from "@/icons";
import { useLocale } from "@/context/LocaleContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  role: { id: number; name: string } | null;
}

const ManageRolePermissionsModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, role }) => {
  const { messages } = useLocale();
  const { permissions = [], isLoading: isPermissionsLoading } = usePermissions();

  const { permissionIds = [], isLoading: isRolePermissionsLoading } = useRolePermissions(role?.id ?? 0);
  const updateRolePermissions = useUpdateRolePermissions();

  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const isPending = updateRolePermissions.isPending;

  const isModified = useMemo(() => {
    const original = [...permissionIds].sort((a, b) => a - b);
    const current = [...selectedPermissions].sort((a, b) => a - b);

    return JSON.stringify(original) !== JSON.stringify(current);
  }, [permissionIds, selectedPermissions]);


  useEffect(() => {
    if (isOpen) {
      setSelectedPermissions(permissionIds);
      setMessage(null);
    }
  }, [permissionIds, isOpen]);


  const togglePermission = (permissionId: number) => {
    setSelectedPermissions(prev =>
      prev.includes(permissionId) ? prev.filter(id => id !== permissionId) : [...prev, permissionId]
    );
  };

  const handleSave = async () => {
    if (!role?.id) return;
    setMessage(null);
    try {
      await updateRolePermissions.mutateAsync({ roleId: role.id, permissionIds: selectedPermissions });

      setMessage(messages["updated_successfully"] || "Updated successfully!");

      onSuccess();

      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      console.error(err);
      setMessage(messages["update_failed"] || "An error occurred while updating.");
    }
  };

  const isLoading = isPermissionsLoading || isRolePermissionsLoading;

  return (
    <Modal
      isOpen={isOpen}
      onClose={isPending ? () => { } : onClose}
      className="max-w-xl p-8"
    >
      <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90 text-center">
        {(messages["manage_permissions_for"] || "Manage Permissions for {role}")
          .replace("{role}", role?.name || "")}
      </h4>


      {message && (
        <p className={`mb-4 text-center ${message.includes("Error") ? "text-red-600" : "text-green-600"}`}>
          {message}
        </p>
      )}

      {isLoading && !permissions.length ? (
        <p>{messages["loading"] || "Loading ..."}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {permissions.map(permission => (
            <Label key={permission.id} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={selectedPermissions.includes(permission.id)}
                onChange={() => togglePermission(permission.id)}
                disabled={isPending}
              />
              <span className={isPending ? "opacity-75" : ""}>{permission.name}</span>
            </Label>
          ))}
        </div>
      )}

      <div className="flex justify-end gap-3">
        <Button size="sm" variant="outline" onClick={onClose} disabled={isPending}>
          {messages["close"] || "Close"}
        </Button>
        <Button
          size="sm"
          onClick={handleSave}
          disabled={isPending || !isModified}
          className={isPending ? "opacity-75 cursor-not-allowed flex items-center justify-center text-white" : "text-white"}
        >
          {isPending ? (
            <>
              <LoadingIcon
                width={16}
                height={16}
                className="animate-spin -ml-1 mr-3 !text-white !opacity-100 dark:!invert-0"
              />
              {messages["updating"]|| "Updating..."}
            </>
          ) : (
            messages["update"] || "Update"
          )}
        </Button>
      </div>
    </Modal>
  );
};

export default ManageRolePermissionsModal;