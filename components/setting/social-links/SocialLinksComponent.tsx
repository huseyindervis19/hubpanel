"use client";

import { useState } from "react";
import { useLocale } from "@/context/LocaleContext";
import { useSocialLinks } from "@/hooks/useSocialLink";
import { SocialLink } from "@/types/SocialLink";

import TitleComponent from "@/components/ui/TitleComponent";
import Button from "@/components/ui/button/Button";
import SocialLinkCard from "./SocialLinkCard";

import AddSocialLinkModal from "./FormModals/AddSocialLinkModal";
import EditSocialLinkModal from "./FormModals/EditSocialLinkModal";
import DeleteSocialLinkModal from "./FormModals/DeleteSocialLinkModal";

import { useHasPermission } from "@/hooks/useAuth";
import { PERMISSIONS } from "@/types/Permissions";

/* -------------------------------------------------------------------------- */
/*                           Main Component                                    */
/* -------------------------------------------------------------------------- */

const SocialLinksComponent = () => {
  const { messages } = useLocale();
  const { data, isLoading, error, refetch } = useSocialLinks();

  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [selectedLink, setSelectedLink] = useState<SocialLink | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const canAddLink = useHasPermission(PERMISSIONS.ADD_SOCIAL_LINKS);
  
  const handleDropdownToggle = (linkId: number) => {
    setOpenDropdownId(prev => (prev === linkId ? null : linkId));
  };

  const handleDropdownClose = () => setOpenDropdownId(null);

  const openEditModal = (link: SocialLink) => {
    setSelectedLink(link);
    setEditModalOpen(true);
    handleDropdownClose();
  };

  const openDeleteModal = (link: SocialLink) => {
    setSelectedLink(link);
    setDeleteModalOpen(true);
    handleDropdownClose();
  };

  const closeEditModal = () => {
    setSelectedLink(null);
    setEditModalOpen(false);
  };

  const closeDeleteModal = () => {
    setSelectedLink(null);
    setDeleteModalOpen(false);
  };

  return (
    <>
      {/* Loading */}
      {isLoading && (
        <p className="text-gray-500 dark:text-gray-400">
          {messages["loading"] || "Loading..."}
        </p>
      )}

      {/* Error */}
      {error && (
        <p className="text-red-500">
          {messages["error_loading"] ||
            "Unable to load social links."}
        </p>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-5 lg:mb-7">
        <TitleComponent
          title={messages["social_links"] || "Social Links"}
        />
        {canAddLink && (
        <Button
          className="h-9 px-4 text-sm"
          onClick={() => setAddModalOpen(true)}
        >
          {messages["create"] || "Create"}
        </Button>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.data.map(link => (
          <SocialLinkCard
            key={link.id}
            link={link}
            isDropdownOpen={openDropdownId == link.id}
            onToggleDropdown={() => handleDropdownToggle(link.id)}
            onCloseDropdown={handleDropdownClose}
            onEdit={() => openEditModal(link)}
            onDelete={() => openDeleteModal(link)}
          />
        ))}
      </div>

      {/* Add Modal */}
      <AddSocialLinkModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={() => refetch()}
      />

      {/* Edit & Delete Modals */}
      {selectedLink && (
        <>
          <EditSocialLinkModal
            isOpen={editModalOpen}
            onClose={closeEditModal}
            onSuccess={() => refetch()}
            link={selectedLink}
          />

          <DeleteSocialLinkModal
            isOpen={deleteModalOpen}
            onClose={closeDeleteModal}
            onSuccess={() => refetch()}
            link={selectedLink}
          />
        </>
      )}
    </>
  );
};

export default SocialLinksComponent;
