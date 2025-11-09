"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import InputField from "@/components/form/input/InputField";
import { useUpdateLanguage } from "@/hooks/useLanguages";
import { Language } from "@/types/Language";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  language: Language;
}

const EditLanguageModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, language }) => {
  const [form, setForm] = useState({
    code: "",
    name: "",
  });

  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const updateLanguage = useUpdateLanguage();

  // Reset message when modal closes
  useEffect(() => {
    if (!isOpen) setMessage(null);
  }, [isOpen]);

  // Initialize form when language changes
  useEffect(() => {
    if (language) {
      setForm({
        code: language.code || "",
        name: language.name || "",
      });
      setMessage(null);
    }
  }, [language]);

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!language?.id) return;

    setLoading(true);
    setMessage(null);

    try {
      await updateLanguage.mutateAsync({ id: language.id, data: form });
      setMessage("Language updated successfully!");

      await new Promise((resolve) => setTimeout(resolve, 1000));

      onClose();
      onSuccess();
    } catch (err) {
      console.error(err);
      setMessage("Error updating language. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="w-full max-w-[500px] p-8 lg:p-10 mx-4 sm:mx-auto"
    >
      <form onSubmit={handleSubmit}>
        <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90 text-center">
          Edit Language
        </h4>

        {message && (
          <p
            className={`mb-4 text-center font-medium ${
              message.includes("Error") ? "text-red-600" : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}

        <div className="space-y-5">
          {/* Code */}
          <div>
            <Label>Language Code</Label>
            <InputField
              type="text"
              value={form.code}
              onChange={(e) => handleChange("code", e.target.value)}
              placeholder="Enter code (e.g. en, ar)"
              required
            />
          </div>

          {/* Name */}
          <div>
            <Label>Language Name</Label>
            <InputField
              type="text"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Enter name (e.g. English, Arabic)"
              required
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 mt-8">
          <Button size="sm" variant="outline" onClick={onClose} disabled={loading}>
            Close
          </Button>
          <Button size="sm" type="submit" disabled={loading}>
            {loading ? "Saving..." : "Update"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditLanguageModal;
