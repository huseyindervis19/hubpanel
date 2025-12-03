"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import InputField from "@/components/form/input/InputField";
import { useCreateRole } from "@/hooks/useRoles";
import { LoadingIcon } from "@/icons";
import Form from "@/components/form/Form";
import TitleComponent from "@/components/ui/TitleComponent";
import { useLocale } from "@/context/LocaleContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddRoleModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const { messages } = useLocale();
  const createRole = useCreateRole();

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [message, setMessage] = useState<string | null>(null);

  const isPending = createRole.isPending;
  const isSuccess = message?.includes("successfully") ?? false;

  useEffect(() => {
    if (!isOpen) {
      setMessage(null);
      setForm({
        name: "",
        description: "",
      });
    }
  }, [isOpen]);

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
    };

    try {
      await createRole.mutateAsync(payload);

      setMessage(messages["created_successfully"] || "Created Successfully!");

      await new Promise((resolve) => setTimeout(resolve, 1000));

      onSuccess();
      onClose();

    } catch (err) {
      console.error(err);
      setMessage(messages["created_error"] || "An error occurred while creating.");
    }
  };

  const isFormEmpty = form.name.trim() === "";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="w-full max-w-[600px] p-8 lg:p-10 mx-4 sm:mx-auto"
    >
      <Form onSubmit={handleSubmit}>
        <TitleComponent
          title={messages["add_roles"] || "Add Role"}
          className="mb-4 font-semibold text-center"
        />

        {message && (
          <p
            className={`mb-4 text-center font-medium ${message.includes("Error") ? "p-4 rounded-xl border border-error-200 bg-error-50 text-error-700 dark:border-error-700 dark:bg-error-900/20 transition-opacity duration-300" : "p-4 rounded-xl border border-success-200 bg-success-50 text-success-700 dark:border-success-700 dark:bg-success-900/20 transition-opacity duration-300"
              }`}
          >
            {message}
          </p>
        )}

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label>{messages["role_name"] || "Name"}</Label>
              <InputField
                type="text"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder={messages["role_name_placeholder"] || "enter role name"}
                required
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label>{messages["role_description"] || "Description"}</Label>
              <InputField
                type="text"
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder={messages["role_description_placeholder"] || "enter role description"}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6">
          <Button size="sm" variant="outline" onClick={onClose} disabled={isPending || isSuccess}>
            {messages["cancel"] || "Cancel"}
          </Button>
          <Button
            size="sm"
            type="submit"
            disabled={isPending || isFormEmpty || isSuccess}
            className={
              isPending
                ? "opacity-75 cursor-not-allowed flex items-center justify-center"
                : ""
            }
          >
            {isPending ? (
              <>
                <LoadingIcon
                  width={16}
                  height={16}
                  className="animate-spin -ml-1 mr-3 !text-white !opacity-100 dark:!invert-0"
                />
                {messages["creating"] || "Creating..."}
              </>
            ) : (
              messages["create"] || "Create"
            )}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddRoleModal;