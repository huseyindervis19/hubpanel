"use client";

import React, { useState, useEffect } from "react";
import DeleteConfirmModal from "@/components/ui/DeleteConfirmModal";
import { useLocale } from "@/context/LocaleContext";
import { SocialLink } from "@/types/SocialLink";
import { useDeleteSocialLink } from "@/hooks/useSocialLink";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    link: SocialLink | null;
}

const DeleteSocialLinkModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, link }) => {
    const { messages } = useLocale();
    const deleteSocialLink = useDeleteSocialLink();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen) {
            setErrorMessage(null);
            setSuccessMessage(null);
        }
    }, [isOpen]);

    const handleDelete = async (): Promise<void> => {
        if (!link?.id) return;

        setErrorMessage(null);
        setSuccessMessage(null);

        try {
            await deleteSocialLink.mutateAsync(link.id);
            const successMsg = messages["delete_successfully"] || "Deleted successfully!";
            setSuccessMessage(successMsg);
            onSuccess?.();
        } catch (err) {
            setErrorMessage(messages["deleted_error"] || "An error occurred while deleting.");
            throw err;
        }
    };


    const messageContent = messages["delete_warning_f"] ? (
        <>
            {messages["delete_warning_f"]} <strong>{link?.platform}</strong>
            {messages["delete_warning_s"]}
        </>
    ) : (
        `Are you sure you want to delete "${link?.platform}"? This action cannot be undone.`
    );

    return (
        <DeleteConfirmModal
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={handleDelete}
            title={messages["confirm_delete"] || "Confirm delete"}
            message={messageContent}
            errorMessage={
                errorMessage || messages["delete_error"] || "An error occurred while deleting."
            }
            successMessage={successMessage || undefined}
        />
    );
};

export default DeleteSocialLinkModal;
