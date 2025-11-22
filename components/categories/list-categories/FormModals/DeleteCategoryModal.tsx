"use client";

import React, { useState, useEffect } from "react";
import DeleteConfirmModal from "@/components/ui/DeleteConfirmModal";
import { useLocale } from "@/context/LocaleContext";
import { Category } from "@/types/Category";
import { useDeleteCategory } from "@/hooks/useCategory";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  category?: Category | null;
}

const DeleteCategoryModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSuccess,
  category,
}) => {
  const { messages } = useLocale();
  const deleteCategory = useDeleteCategory();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setMessage(null);
    }
  }, [isOpen]);

  const handleDeleteCategory = async (): Promise<void> => {
    if (!category?.id) return;
    
    setMessage(null);

    try {
      await deleteCategory.mutateAsync(category.id);
      // تعيين رسالة النجاح بعد إتمام الحذف
      const successMsg = messages["delete_successfully"] || "Deleted successfully!";
      setMessage(successMsg);
      onSuccess?.();
    } catch (err) {
      console.error(err);
      setMessage(messages["delete_failed"] || "An error occurred while deleting.");
      throw err; // إعادة throw الخطأ حتى يعرض DeleteConfirmModal رسالة الخطأ
    }
  };

  // الحصول على اسم الفئة للعرض
  const categoryName = category?.translated?.name || category?.name || "this category";

  return (
    <DeleteConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleDeleteCategory}
      title={messages["confirm_delete"] || "Confirm Deletion"}
      message={
        <>
          {messages["delete_warning"]
            ? messages["delete_warning"].replace("{name}", categoryName)
            : <>Are you sure you want to delete <strong>"{categoryName}"</strong>? This action cannot be undone.</>
          }
        </>
      }
      errorMessage={messages["delete_failed"] || "An error occurred while deleting."}
    />
  );
};

export default DeleteCategoryModal;
