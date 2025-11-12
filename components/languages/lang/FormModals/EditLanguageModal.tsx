"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import InputField from "@/components/form/input/InputField";
import { useUpdateLanguage } from "@/hooks/useLanguages";
import { Language } from "@/types/Language";
import Form from "@/components/form/Form";
import TitleComponent from "@/components/ui/TitleComponent";
import { useLocale } from "@/context/LocaleContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  language: Language;
}

const EditLanguageModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, language }) => {
  const { messages } = useLocale();
  const updateLanguage = useUpdateLanguage();
  const [form, setForm] = useState({
    code: "",
    name: "",
    isDefault: false,
  });

  const [message, setMessage] = useState<string | null>(null);

  const isPending = updateLanguage.isPending;

  // Reset message when modal closes
  useEffect(() => {
    if (!isOpen) setMessage(null);
  }, [isOpen]);

  useEffect(() => {
    if (language) {
      setForm({
        code: language.code || "",
        name: language.name || "",
        isDefault: language.isDefault || false,
      });
      setMessage(null);
    }
  }, [language, isOpen]);

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  // Handle change for the checkbox input
  const handleCheckboxChange = (checked: boolean) => {
    setForm(prev => ({ ...prev, isDefault: checked }));
  };

  const isModified = useMemo(() => {
    if (!language) return false;

    const codeChanged = form.code.trim() !== (language.code || "");
    const nameChanged = form.name.trim() !== (language.name || "");
    const isDefaultChanged = form.isDefault !== (language.isDefault || false);

    return codeChanged || nameChanged || isDefaultChanged;
  }, [form, language]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!language?.id) return;

    setMessage(null);

    const payload = {
      code: form.code.trim(),
      name: form.name.trim(),
      isDefault: form.isDefault,
    };

    try {
      await updateLanguage.mutateAsync({ id: language.id, data: payload });
      setMessage(messages["user_updated_successfully"]?.replace("User", "Language") || "Language updated successfully!");

      await new Promise((resolve) => setTimeout(resolve, 1000));

      onClose();
      onSuccess();
    } catch (err) {
      console.error(err);
      setMessage(messages["error"] || "Error updating language. Please try again.");
    }
  };

  // Check if fields are empty to disable the button
  const areFieldsEmpty = form.code.trim() === "" || form.name.trim() === "";


  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="w-full max-w-[500px] p-8 lg:p-10 mx-4 sm:mx-auto"
    >
      <Form onSubmit={handleSubmit}>
        <TitleComponent
          title={messages["edit_language"] || "Edit Language"}
          className="mb-6 font-semibold text-center"
        />

        {message && (
          <p
            className={`mb-4 text-center font-medium ${message.includes("Error") ? "text-red-600" : "text-green-600"
              }`}
          >
            {message}
          </p>
        )}

        <div className="space-y-5">
          {/* Code */}
          <div>
            <Label>{messages["code"] || "Language Code"}</Label>
            <InputField
              type="text"
              value={form.code}
              onChange={(e) => handleChange("code", e.target.value)}
              placeholder={messages["code_placeholder"] || "Enter code (e.g. en, ar)"}
              required
            />
          </div>

          {/* Name */}
          <div>
            <Label>{messages["name"] || "Language Name"}</Label>
            <InputField
              type="text"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder={messages["name_placeholder"] || "Enter name (e.g. English, Arabic)"}
              required
            />
          </div>

          {/* isDefault */}
          <div className="flex items-center pt-2">
            <input
              id="isDefaultEdit"
              type="checkbox"
              checked={form.isDefault}
              onChange={(e) => handleCheckboxChange(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600"
            />
            <Label htmlFor="isDefaultEdit" className="ml-2 mb-0 cursor-pointer">
              {messages["set_as_default"] || "Set as Default Language"}
            </Label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 mt-8">
          <Button size="sm" variant="outline" onClick={onClose} disabled={isPending}>
            {messages["close"] || "Close"}
          </Button>
          <Button
            size="sm"
            type="submit"
            disabled={isPending || !isModified || areFieldsEmpty}
          >
            {isPending ? (messages["edit_profile_modal_loading"]?.replace("profile", "language") || "Updating...") : (messages["update"] || "Update")}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default EditLanguageModal;