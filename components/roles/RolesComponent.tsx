"use client";

import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import { PencilIcon, TrashBinIcon } from "@/icons";
import Button from "@/components/ui/button/Button";
import AddRoleModal from "./FormModals/AddRoleModal";
import EditRoleModal from "./FormModals/EditRoleModal";
import DeleteRoleModal from "./FormModals/DeleteRoleModal";
import ManageRolePermissionsModal from "./FormModals/ManageRolePermissionsModal";
import { useRoles } from "@/hooks/useRoles";
import { useHasPermission } from "@/hooks/useAuth";
import { PERMISSIONS } from "@/types/Permissions";

const RolesComponent = () => {
  const [selectedRole, setSelectedRole] = useState<any | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [permissionsModalOpen, setPermissionsModalOpen] = useState(false);

  const { roles = [], isLoading, refetch } = useRoles();
  const canAddRole = useHasPermission(PERMISSIONS.ADD_ROLE);

  const openEditModal = (role: any) => {
    setSelectedRole(role);
    setEditModalOpen(true);
  };

  const openDeleteModal = (role: any) => {
    setSelectedRole(role);
    setDeleteModalOpen(true);
  };

  const openPermissionsModal = (role: any) => {
    setSelectedRole(role);
    setPermissionsModalOpen(true);
  };

  const closeEditModal = () => setEditModalOpen(false);
  const closeDeleteModal = () => setDeleteModalOpen(false);
  const closePermissionsModal = () => setPermissionsModalOpen(false);

  if (isLoading) {
    return <p>Loading roles...</p>;
  }

  return (
    <>
      <div className="flex items-center justify-between mb-5 lg:mb-7">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Roles</h3>
        <div className="flex justify-end mb-4">
          {canAddRole && (
            <Button className="h-9 px-4 text-sm" onClick={() => setAddModalOpen(true)}>Add</Button>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[700px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400">Name</TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400">Description</TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400">Permissions</TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400">Actions</TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="px-5 py-4">{role.name}</TableCell>
                    <TableCell className="px-5 py-4">{role.description || "-"}</TableCell>
                    <TableCell className="px-5 py-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openPermissionsModal(role)}
                      >
                        Manage
                      </Button>
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <div className="flex items-center gap-5">
                        <button onClick={() => openEditModal(role)}><PencilIcon /></button>
                        <button onClick={() => openDeleteModal(role)}><TrashBinIcon /></button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      <AddRoleModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={() => refetch()}
      />

      {/* Edit Modal */}
      <EditRoleModal
        isOpen={editModalOpen}
        onClose={closeEditModal}
        onSuccess={() => refetch()}
        role={selectedRole}
      />

      {/* Delete Modal */}
      <DeleteRoleModal
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        onSuccess={() => refetch()}
        role={selectedRole}
      />

      {/*  Manage Permissions Modal */}
      <ManageRolePermissionsModal
        isOpen={permissionsModalOpen}
        onClose={closePermissionsModal}
        onSuccess={() => refetch()}
        role={selectedRole}
      />
    </>
  );
};

export default RolesComponent;
