"use client";

import { useState } from "react";
import UserInfoCard from "./sections/UserInfoCard";
import UserMetaCard from "./sections/UserMetaCard";
import { useCurrentUser } from "@/hooks/useAuth";
import EditUserModal from "@/components/users/FormModals/EditUserModal";

const ProfileComponent = () => {
  const { data: currentUser, isLoading, refetch } = useCurrentUser();
  const [editModalOpen, setEditModalOpen] = useState(false);

  if (isLoading) return <p>Loading...</p>;
  if (!currentUser) return <p>User not found</p>;

  return (
    <>
      <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
        Profile
      </h3>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6 space-y-6">
        <UserMetaCard user={currentUser} onEdit={() => setEditModalOpen(true)} />
        <UserInfoCard user={currentUser} onEdit={() => setEditModalOpen(true)} />
      </div>

      <EditUserModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSuccess={() => refetch()}
        user={currentUser}
      />
    </>
  );
}

export default ProfileComponent;
