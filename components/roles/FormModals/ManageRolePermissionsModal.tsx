"use client";

import React, { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import { usePermissions } from "@/hooks/usePermissions";
import { rolePermissionService } from "@/services/rolePermissionService";
import { Permission } from "@/types/Permission";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  role: { id: number; name: string } | null;
}

const ManageRolePermissionsModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, role }) => {
  const { permissions = [], isLoading } = usePermissions();
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

useEffect(() => {
  const fetchRolePermissions = async () => {
    if (!role?.id) return;
    try {
      const res = await rolePermissionService.getRolePermissions(role.id);

      const ids = res.map((p: Permission) => p.id);
      setSelectedPermissions(ids);
    } catch (err) {
      console.error("Error fetching role permissions:", err);
    }
  };
  if (isOpen) fetchRolePermissions();
}, [isOpen, role]);

  const togglePermission = (permissionId: number) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSave = async () => {
    if (!role?.id) return;
    setLoading(true);
    try {
      await rolePermissionService.updateRolePermissions(role.id, selectedPermissions);
      setMessage("Permissions updated successfully!");
      onSuccess();
      setTimeout(() => {
        setMessage(null);
        onClose();
      }, 1000);
    } catch (err) {
      console.error(err);
      setMessage("Error updating permissions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-xl p-8">
      <h3 className="text-lg font-semibold text-center mb-4">
        Manage Permissions for {role?.name}
      </h3>

      {message && (
        <p
          className={`mb-4 text-center ${message.includes("Error") ? "text-red-600" : "text-green-600"
            }`}
        >
          {message}
        </p>
      )}

      {isLoading ? (
        <p>Loading permissions...</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 mb-6">
          {permissions.map((permission) => (
            <label key={permission.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedPermissions.includes(permission.id)}
                onChange={() => togglePermission(permission.id)}
              />
              <span>{permission.name}</span>
            </label>
          ))}
        </div>
      )}

      <div className="flex justify-end gap-3">
        <Button size="sm" variant="outline" onClick={onClose} disabled={loading}>
          Close
        </Button>
        <Button size="sm" onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </Button>
      </div>
    </Modal>
  );
};

export default ManageRolePermissionsModal;
