"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import InputField from "@/components/form/input/InputField";
import { useCreateLanguage } from "@/hooks/useLanguages";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddLanguageModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const createLanguage = useCreateLanguage();

  const [form, setForm] = useState({
    code: "",
    name: "",
  });

  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) setMessage(null);
  }, [isOpen]);

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const payload = {
      code: form.code.trim(),
      name: form.name.trim(),
    };

    try {
      await createLanguage.mutateAsync(payload);
      setMessage("Language added successfully!");

      await new Promise((resolve) => setTimeout(resolve, 1000));

      onSuccess();
      onClose();

      setForm({ code: "", name: "" });
    } catch (err) {
      console.error(err);
      setMessage("Error adding language. Please try again.");
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
        <h4 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90 text-center">
          Add Language
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

        <div className="space-y-4">
          {/* Code */}
          <div>
            <Label>Language Code</Label>
            <InputField
              type="text"
              value={form.code}
              onChange={(e) => handleChange("code", e.target.value)}
              placeholder="Enter language code (e.g. en, ar)"
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
              placeholder="Enter language name (e.g. English, Arabic)"
              required
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 mt-6">
          <Button size="sm" variant="outline" onClick={onClose} disabled={loading}>
            Close
          </Button>
          <Button size="sm" type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddLanguageModal;
