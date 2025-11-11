"use client";

import { useState } from "react";
import UserInfoCard from "./sections/UserInfoCard";
import UserMetaCard from "./sections/UserMetaCard";
import { useCurrentUser } from "@/hooks/useAuth";
import EditUserModal from "@/components/users/FormModals/EditUserModal";
import TitleComponent from "../ui/TitleComponent";
import LoadingComponent from "../ui/LoadingComponent";

const ProfileComponent = () => {
  const { data: currentUser, isLoading, refetch } = useCurrentUser();
  const [editModalOpen, setEditModalOpen] = useState(false);

  if (isLoading) { <LoadingComponent title="." /> }
  if (!currentUser) return <p>User not found</p>;

  return (
    <>
      <TitleComponent title="Profile"/>

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
