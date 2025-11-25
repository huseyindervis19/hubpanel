"use client";

import Button from "@/components/ui/button/Button";
import { Card, CardContent } from "@/components/ui/card";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import { HorizontaLDots } from "@/icons";
import { useLocale } from "@/context/LocaleContext";
import { useSocialLink } from "@/hooks/useSocialLink";
import { SocialLink } from "@/types/SocialLink";
import { useState } from "react";
import { SocialLinkModal, SocialLinkFormValues } from "./SocialLinkModal";

const SocialLinkCard = ({
  link,
  onEdit,
  onDelete,
  deleting,
  messages,
  isDropdownOpen,
  onDropdownToggle,
  onDropdownClose,
}: {
  link: SocialLink;
  onEdit: (link: SocialLink) => void;
  onDelete: (id: number) => void;
  deleting: boolean;
  messages: Record<string, string>;
  isDropdownOpen: boolean;
  onDropdownToggle: () => void;
  onDropdownClose: () => void;
}) => (
  <Card className="group cursor-pointer border border-gray-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900">
    <CardContent className="p-0">
      <div className="relative overflow-hidden rounded-t-2xl bg-gradient-to-br from-brand-50 via-white to-transparent dark:from-brand-500/10 dark:via-gray-900">
        <div className="flex h-48 items-center justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white text-xl font-semibold text-brand-600 shadow-md dark:bg-gray-800 dark:text-brand-300">
            <span className="max-w-[60px] truncate text-center">
              {link.icon || link.platform}
            </span>
          </div>
        </div>
        <div className="absolute inset-0 rounded-t-2xl bg-black/5 transition-colors duration-300 group-hover:bg-black/0 dark:bg-black/30 dark:group-hover:bg-black/10" />
      </div>

      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {link.platform}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 break-all">
              {link.url}
            </p>
            <p className="text-sm font-medium text-brand-600 dark:text-brand-300">
              {messages["display_order"] || "Order"}: #{link.order}
            </p>
          </div>

          <div className="relative flex-shrink-0">
            <button
              className="dropdown-toggle rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
              onClick={onDropdownToggle}
            >
              <HorizontaLDots />
            </button>

            <Dropdown
              isOpen={isDropdownOpen}
              onClose={onDropdownClose}
              className="w-32"
            >
              <DropdownItem
                onItemClick={() => {
                  onDropdownClose();
                  onEdit(link);
                }}
                className="text-gray-800 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
              >
                {messages["edit"] || "Edit"}
              </DropdownItem>
              <DropdownItem
                onItemClick={() => {
                  onDropdownClose();
                  onDelete(link.id);
                }}
                className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
              >
                {deleting ? messages["deleting"] || "Deleting..." : messages["delete"] || "Delete"}
              </DropdownItem>
            </Dropdown>
          </div>
        </div>

      </div>
    </CardContent>
  </Card>
);

export default function SocialLinksComponent() {
  const { messages } = useLocale();
  const {
    socialLinks,
    loading,
    error,
    refetch,
    create,
    update,
    remove,
    creating,
    updating,
    deleting,
  } = useSocialLink();
  const [modalState, setModalState] = useState<{
    mode: "create" | "edit";
    link?: SocialLink;
  } | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  const handleSubmit = async (values: SocialLinkFormValues) => {
    if (modalState?.mode === "edit" && modalState.link) {
      await update(modalState.link.id, values);
    } else {
      await create(values);
    }
    refetch();
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    await remove(id);
    setDeletingId(null);
    refetch();
  };

  const toggleDropdown = (id: number) => {
    setOpenDropdownId((prev) => (prev === id ? null : id));
  };

  const closeDropdown = () => setOpenDropdownId(null);

  const modalLoading = modalState?.mode === "edit" ? updating : creating;

  return (
    <>
      <div className="mb-6 flex justify-end">
        <Button className="h-9 px-4 text-sm" onClick={() => setModalState({ mode: "create" })}>
          {messages["create"] || "Create"}
        </Button>
      </div>

      {loading && (
        <p className="text-gray-500 dark:text-gray-400">
          {messages["loading"] || "Loading..."}
        </p>
      )}

      {error && (
        <p className="text-red-500">
          {error.message || messages["error_loading"] || "Unable to load social links."}
        </p>
      )}

      {!loading && !error && socialLinks.length === 0 && (
        <div className="rounded-3xl border border-dashed border-gray-300 p-8 text-center dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">
            {messages["no_social_links"] || "No social links yet. Add your first platform."}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {socialLinks.map((link) => (
          <SocialLinkCard
            key={link.id}
            link={link}
            onEdit={(item) => setModalState({ mode: "edit", link: item })}
            onDelete={handleDelete}
            deleting={deletingId === link.id && deleting}
            messages={messages as Record<string, string>}
            isDropdownOpen={openDropdownId === link.id}
            onDropdownToggle={() => toggleDropdown(link.id)}
            onDropdownClose={closeDropdown}
          />
        ))}
      </div>

      <SocialLinkModal
        isOpen={!!modalState}
        title={
          modalState?.mode === "edit"
            ? messages["edit_social_link"] || "Edit Social Link"
            : messages["add_social_link"] || "Add Social Link"
        }
        loading={modalLoading}
        initialData={modalState?.link}
        onClose={() => setModalState(null)}
        onSubmit={handleSubmit}
          mode={modalState?.mode === "edit" ? "edit" : "create"}
      />
    </>
  );
}

