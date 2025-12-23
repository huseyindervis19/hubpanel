"use client";

import { useState } from "react";
import UserInfoCard from "./sections/UserInfoCard";
import UserMetaCard from "./sections/UserMetaCard";
import { useCurrentUser } from "@/hooks/useAuth";
import EditUserModal from "@/components/users/FormModals/EditUserModal";
import TitleComponent from "../ui/TitleComponent";
import LoadingComponent from "../ui/LoadingComponent";
import { useLocale } from "@/context/LocaleContext";
import { useHasPermission } from "@/hooks/useAuth";
import { PERMISSIONS } from "@/types/Permissions";

const ProfileComponent = () => {
  const { messages } = useLocale();
  const { data: currentUser, isLoading, refetch } = useCurrentUser();
  const [editModalOpen, setEditModalOpen] = useState(false);

  if (isLoading) { <LoadingComponent title="." /> }
  if (!currentUser) return <p>{messages["user_not_found"] || "User not found"}</p>;

  const canUpdateProfile = useHasPermission(PERMISSIONS.EDIT_PROFILE);

  return (
    <>
      <TitleComponent title={messages["profile"] || "Profile"}/>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6 space-y-6">
        <UserMetaCard user={currentUser} onEdit={() => setEditModalOpen(true)} />
        <UserInfoCard user={currentUser} onEdit={() => setEditModalOpen(true)} />
      </div>

      {canUpdateProfile && (
      <EditUserModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSuccess={() => refetch()}
        user={currentUser}
      />
      )}
    </>
  );
}

export default ProfileComponent;
