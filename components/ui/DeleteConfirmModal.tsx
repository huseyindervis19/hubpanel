"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import { LoadingIcon } from "../../icons";
import { useLocale } from "@/context/LocaleContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title: string;
  message: React.ReactNode;
  errorMessage?: string;
  successMessage?: string;
}

const DeleteConfirmModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  errorMessage = "An error occurred while deleting. Please try again.",
  successMessage
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const { messages } = useLocale();

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(false);
    setSuccess(false);

    try {
      await onConfirm();
      setSuccess(true);
      setTimeout(() => {
        setIsDeleting(false);
        onClose();
      }, 700);
    } catch (e) {
      setError(true);
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      setError(false);
      setSuccess(false);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-md p-6">
      <div className="pt-4 pb-4 text-center">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          {title}
        </h4>

        {success && successMessage && (
          <div className="p-4 rounded-xl border mb-4 text-center font-medium transition-opacity duration-300 border-success-200 bg-success-50 text-success-700 dark:border-success-700 dark:bg-success-900/20">
            {successMessage}
          </div>
        )}

        <div className="text-medium leading-6 text-gray-600 dark:text-gray-300">{message}</div>

        {error && (
          <div className="p-4 rounded-xl border mb-4 text-center font-medium transition-opacity duration-300 border-error-200 bg-error-50 text-error-700 dark:border-error-700 dark:bg-error-900/20">
            {errorMessage}
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button size="sm" variant="outline" onClick={handleClose} disabled={isDeleting}>
          {messages["cancel"] || "Cancel"}

        </Button>
        <Button
          size="sm"
          disabled={isDeleting || success}
          className={
            isDeleting
              ? "bg-red-700 opacity-75 cursor-not-allowed flex items-center justify-center text-white"
              : "bg-red-600 hover:bg-red-700 text-white"
          }
          onClick={handleDelete}
        >
          {isDeleting ? (
            <>
              <LoadingIcon
                width={16}
                height={16}
                className="animate-spin -ml-1 mr-3 !text-white !opacity-100 dark:!invert-0"
              />
              {messages["deleting"]}
            </>
          ) : (
            messages["delete"]
          )}
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteConfirmModal;
