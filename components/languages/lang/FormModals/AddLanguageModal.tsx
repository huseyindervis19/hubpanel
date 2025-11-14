"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import InputField from "@/components/form/input/InputField";
import { useCreateLanguage } from "@/hooks/useLanguages";
import Form from "@/components/form/Form";
import TitleComponent from "@/components/ui/TitleComponent";
import { useLocale } from "@/context/LocaleContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddLanguageModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const { messages } = useLocale();
  const createLanguage = useCreateLanguage();

  const [form, setForm] = useState({
    code: "",
    name: "",
    isDefault: false,
  });

  const [message, setMessage] = useState<string | null>(null);

  const isPending = createLanguage.isPending;

  useEffect(() => {
    if (!isOpen) {
      setMessage(null);
      setForm({ code: "", name: "", isDefault: false });
    }
  }, [isOpen]);

  // Handle changes for text inputs
  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  // Handle change for the checkbox input
  const handleCheckboxChange = (checked: boolean) => {
    setForm(prev => ({ ...prev, isDefault: checked }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const payload = {
      code: form.code.trim(),
      name: form.name.trim(),
      isDefault: form.isDefault,
    };

    try {
      await createLanguage.mutateAsync(payload);
      setMessage(messages["created_successfully"] || "Created Successfully!");

      await new Promise((resolve) => setTimeout(resolve, 1000));

      onSuccess();
      onClose();

    } catch (err) {
      console.error(err);
      setMessage(messages["error"] || "An error occurred while creating.");
    }
  };

  // Check if code or name fields are empty
  const isFormEmpty = form.code.trim() === "" || form.name.trim() === "";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="w-full max-w-[500px] p-8 lg:p-10 mx-4 sm:mx-auto"
    >
      <Form onSubmit={handleSubmit}>
        <TitleComponent
          title={messages["add_language"] || "Add Language"}
          className="mb-4 font-semibold text-center"
        />

        {message && (
          <p
            className={`mb-4 text-center font-medium ${message.includes("Error") ? "text-red-600" : "text-green-600"
              }`}
          >
            {message}
          </p>
        )}

        <div className="space-y-4">
          {/* Code */}
          <div>
            <Label>{messages["language_code"] || "Language Code"}</Label>
            <InputField
              type="text"
              value={form.code}
              onChange={(e) => handleChange("code", e.target.value)}
              placeholder={messages["language_code_placeholder"] || "enter language code (e.g. en, ar)"}
              required
            />
          </div>

          {/* Name */}
          <div>
            <Label>{messages["language_name"] || "Language Name"}</Label>
            <InputField
              type="text"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder={messages["language_name_placeholder"] || "enter language name (e.g. English, Arabic)"}
              required
            />
          </div>

          {/* isDefault */}
          <div className="flex items-center pt-2">
            <input
              id="isDefault"
              type="checkbox"
              checked={form.isDefault}
              onChange={(e) => handleCheckboxChange(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600"
            />
            <Label htmlFor="isDefault" className="ml-2 mb-0 cursor-pointer">
              {messages["set_as_default"] || "Set as Default Language"}
            </Label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6">
          <Button size="sm" variant="outline" onClick={onClose} disabled={isPending}>
            {messages["close"] || "Close"}
          </Button>
          <Button
            size="sm"
            type="submit"
            disabled={isPending || isFormEmpty}
          >
            {isPending ? (messages["creating"] || "Creating...") : (messages["create"] || "Create")}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddLanguageModal;
