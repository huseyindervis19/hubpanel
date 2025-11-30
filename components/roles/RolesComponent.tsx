"use client";

import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow, Td, Th } from "../ui/table";
import { PencilIcon, TrashBinIcon } from "@/icons";
import Button from "@/components/ui/button/Button";
import AddRoleModal from "./FormModals/AddRoleModal";
import EditRoleModal from "./FormModals/EditRoleModal";
import DeleteRoleModal from "./FormModals/DeleteRoleModal";
import ManageRolePermissionsModal from "./FormModals/ManageRolePermissionsModal";
import { useRoles } from "@/hooks/useRoles";
import { useHasPermission } from "@/hooks/useAuth";
import { PERMISSIONS } from "@/types/Permissions";
import { Role } from "@/types/Role";
import LoadingComponent from "../ui/LoadingComponent";
import TitleComponent from "../ui/TitleComponent";
import { useLocale } from "@/context/LocaleContext";

const RolesComponent = () => {
  const { messages } = useLocale();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [permissionsModalOpen, setPermissionsModalOpen] = useState(false);

  const { roles = [], isLoading, refetch } = useRoles();
  const canAddRole = useHasPermission(PERMISSIONS.ADD_ROLE);
  const canEditRole = useHasPermission(PERMISSIONS.EDIT_ROLE);
  const canDeleteRole = useHasPermission(PERMISSIONS.DELETE_ROLE);
  const canManagePermissions = useHasPermission(PERMISSIONS.MANAGE_ROLE_PERMISSIONS);

  const openEditModal = (role: Role) => {
    setSelectedRole(role);
    setEditModalOpen(true);
  };

  const openDeleteModal = (role: Role) => {
    setSelectedRole(role);
    setDeleteModalOpen(true);
  };

  const openPermissionsModal = (role: Role) => {
    setSelectedRole(role);
    setPermissionsModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setSelectedRole(null);
  };
  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedRole(null);
  };
  const closePermissionsModal = () => {
    setPermissionsModalOpen(false);
    setSelectedRole(null);
  };

  if (isLoading) { <LoadingComponent title={messages["roles"] || "Roles"} /> }

  return (
    <>
      <div className="flex items-center justify-between mb-5 lg:mb-7">
        <TitleComponent title={messages["roles"] || "Roles"} />
        <div className="flex justify-end mb-4">
          {canAddRole && (
            <Button className="h-9 px-4 text-sm" onClick={() => setAddModalOpen(true)}>{messages["create"] || "Create"}</Button>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] shadow-sm">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[700px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <Th>{messages["role_name"] || "Name"}</Th>
                  <Th>{messages["role_description"] || "Description"}</Th>
                  <Th>{messages["role_permissions"] || "Permissions"}</Th>
                  <Th>{messages["actions"] || "Actions"}</Th>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {roles.length > 0 ? (
                  roles.map((role: Role) => (
                    <TableRow key={role.id}>
                      <Td >{role.name}</Td>
                      <Td>{role.description || "-"}</Td>
                      <Td >
                        {canManagePermissions && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openPermissionsModal(role)}
                          >
                            {messages["manage"] || "Manage"}
                          </Button>
                        )}
                      </Td>
                      <Td>
                        <div className="flex items-center ">
                          {canEditRole && (
                            <Button size="icon" variant="ghost" onClick={() => openEditModal(role)}>
                              <PencilIcon width={20} height={20} />
                            </Button>
                          )}
                          {canDeleteRole && (
                            <Button size="icon" variant="ghost" onClick={() => openDeleteModal(role)}>
                              <TrashBinIcon width={20} height={20} />
                            </Button>
                          )}
                        </div>
                      </Td>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <td
                      colSpan={4}
                      className="px-5 py-6 text-center text-gray-500 dark:text-gray-400"
                    >
                      {messages["no_data_found"] || "No Data Found!"}
                    </td>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddRoleModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={() => refetch()}
      />

      <EditRoleModal
        isOpen={editModalOpen}
        onClose={closeEditModal}
        onSuccess={() => refetch()}
        role={selectedRole}
      />

      <DeleteRoleModal
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        onSuccess={() => refetch()}
        role={selectedRole}
      />

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