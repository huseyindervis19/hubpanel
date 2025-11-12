"use client";

import { useState, useMemo } from "react";
import { Table, TableBody, Th, Td, TableHeader, TableRow } from "@/components/ui/table";
import Button from "@/components/ui/button/Button";
import SearchBar from "@/components/form/input/SearchBar";
import LoadingComponent from "@/components/ui/LoadingComponent";
import TitleComponent from "@/components/ui/TitleComponent";
import { PencilIcon, TrashBinIcon } from "@/icons";
import AddUserModal from "./FormModals/AddUserModal";
import EditUserModal from "./FormModals/EditUserModal";
import DeleteUserModal from "./FormModals/DeleteUserModal";
import { useUsers } from "@/hooks/useUsers";
import { useHasPermission } from "@/hooks/useAuth";
import { PERMISSIONS } from "@/types/Permissions";
import { User } from "@/types/User";
import { useLocale } from "@/context/LocaleContext";

const UsersComponent = () => {
  const { messages } = useLocale();
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

  if (isLoading) { <LoadingComponent title={messages["message"] || "Users"} /> }


  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 lg:mb-7">
        <TitleComponent title={messages["nav_users"] || "Users"} />
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {messages["dashboard_total_categories"]?.replace("Categories", "Users") || "Total"}: {filteredUsers.length}
            </p>
            <div className="relative">
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
              />
            </div>
          </div>
          {canAddUser && (
            <Button className="h-8.5 px-4 text-sm" onClick={() => setAddModalOpen(true)}>
              {messages["add"] || "Add"}
            </Button>
          )}
        </div>
      </div>

      {/* --- Table Section --- */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[800px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <Th> {messages["name"] || "Name"} </Th>
                  <Th> {messages["email"] || "Email"} </Th>
                  <Th> {messages["role"] || "Role"} </Th>
                  <Th> {messages["language"] || "Language"}</Th>
                  <Th> {messages["status"] || "Status"}</Th>
                  <Th> {messages["action"] || "Action"}</Th>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <Td >{user.username}</Td>
                      <Td>{user.email}</Td>
                      <Td>
                        {user.userRoles && user.userRoles.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {user.userRoles.map((ur) => (
                              <span
                                key={ur.id}
                                className="inline-flex items-center rounded-full bg-blue-100 px-3 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                              >
                                {ur.role?.name || "N/A"}
                              </span>
                            ))}
                          </div>
                        ) : (
                          "-"
                        )}
                      </Td>
                      <Td>
                        {user.language?.name || "-"}
                      </Td>

                      {/* Status */}
                      <Td>
                        <span className={`inline-flex items-center rounded-full px-3 py-0.5 text-xs font-medium ${user.status === "active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          }`}
                        >
                          {user.status}
                        </span>
                      </Td>
                      <Td>
                        <div className="flex items-center gap-5">
                          {canEditUser && (
                            <button onClick={() => openEditModal(user)} title={messages["edit_user"] || "Edit User"}>
                              <PencilIcon />
                            </button>
                          )}
                          {canDeleteUser && (
                            <button onClick={() => openDeleteModal(user)} title={messages["delete"] + " " + (messages["nav_users"] || "User") || "Delete User"}>
                              <TrashBinIcon />
                            </button>
                          )}
                        </div>
                      </Td>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <td
                      colSpan={6}
                      className="px-5 py-6 text-center text-gray-500 dark:text-gray-400"
                    >
                      {messages["no_data"] || "No users found."}
                    </td>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* --- Modals --- */}
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