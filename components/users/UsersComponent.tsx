"use client";

import { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import { PencilIcon, TrashBinIcon } from "@/icons";
import Button from "@/components/ui/button/Button";
import AddUserModal from "./FormModals/AddUserModal";
import EditUserModal from "./FormModals/EditUserModal";
import DeleteUserModal from "./FormModals/DeleteUserModal";
import { useUsers } from "@/hooks/useUsers";
import { Search } from "lucide-react";
import { useHasPermission } from "@/hooks/useAuth";
import { PERMISSIONS } from "@/types/Permissions";
import { User } from "@/types/User";

const UsersComponent = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const canAddUser = useHasPermission(PERMISSIONS.ADD_USER);
  const canEditUser = useHasPermission(PERMISSIONS.EDIT_USER);
  const canDeleteUser = useHasPermission(PERMISSIONS.DELETE_USER);

  const { data: users = [], isLoading, refetch } = useUsers();

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const roleName = user.userRoles[0]?.role?.name?.toLowerCase() || "";
      return (
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        roleName.includes(searchTerm.toLowerCase())
      );
    });
  }, [users, searchTerm]);

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const openDeleteModal = (user: User) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };

  const closeEditModal = () => setEditModalOpen(false);
  const closeDeleteModal = () => setDeleteModalOpen(false);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <p className="text-gray-600 dark:text-gray-300">Loading users...</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 lg:mb-7">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Users
        </h3>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total: {filteredUsers.length}
            </p>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-2 text-sm border rounded-lg bg-white dark:bg-slate-900 dark:text-gray-100 dark:border-white/10 focus:ring-2 focus:ring-primary/40 outline-none"
              />
            </div>
          </div>

          {canAddUser && (
            <Button className="h-9 px-4 text-sm" onClick={() => setAddModalOpen(true)}>
              Add
            </Button>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[800px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Name
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Email
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Role
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Language
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Status
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Action
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="px-5 py-4 sm:px-6 text-start text-theme-lg dark:text-gray-100">
                        {user.username}
                      </TableCell>

                      <TableCell className="px-5 py-4 sm:px-6 text-start text-theme-lg dark:text-gray-100">
                        {user.email}
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start text-theme-lg dark:text-gray-100">
                        {user.userRoles && user.userRoles.length > 0 ? (
                          user.userRoles.map((ur, index) => (
                            <span key={ur.id}>
                              {ur.role?.name}
                              {index < user.userRoles.length - 1 ? ", " : ""}
                            </span>
                          ))
                        ) : (
                          "-"
                        )}
                      </TableCell>

                      <TableCell className="px-5 py-4 sm:px-6 text-start text-theme-lg dark:text-gray-100">
                        {user.language?.name || "-"}
                      </TableCell>

                      <TableCell
                        className={`px-5 py-4 sm:px-6 text-start text-theme-lg ${user.status === "active"
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                          }`}
                      >
                        {user.status}
                      </TableCell>

                      <TableCell className="px-6 py-4 text-gray-800 dark:text-white">
                        <div className="flex items-center gap-5">
                          {canEditUser && (
                            <button onClick={() => openEditModal(user)}>
                              <PencilIcon />
                            </button>
                          )}
                          {canDeleteUser && (
                            <button onClick={() => openDeleteModal(user)}>
                              <TrashBinIcon />
                            </button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <td
                      colSpan={6}
                      className="px-5 py-6 text-center text-gray-500 dark:text-gray-400"
                    >
                      No users found.
                    </td>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <AddUserModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={() => refetch()}
      />

      <EditUserModal
        isOpen={editModalOpen}
        onClose={closeEditModal}
        onSuccess={() => refetch()}
        user={selectedUser}
      />

      <DeleteUserModal
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        onSuccess={() => refetch()}
        user={selectedUser}
      />
    </>
  );
};

export default UsersComponent;
