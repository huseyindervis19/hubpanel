"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import InputField from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import MultiSelect from "@/components/form/MultiSelect";
import TitleComponent from "@/components/ui/TitleComponent";
import Form from "@/components/form/Form";
import { useRoles } from "@/hooks/useRoles";
import { useLanguages } from "@/hooks/useLanguages";
import { useCreateUser } from "@/hooks/useUsers";
import { useLocale } from "@/context/LocaleContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddUserModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const { messages } = useLocale();
  const { roles = [] } = useRoles();
  const { languages = [] } = useLanguages();
  const createUser = useCreateUser();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    roleIds: [] as number[],
    languageId: undefined as number | undefined,
    status: "active" as "active" | "inactive",
  });

  const [message, setMessage] = useState<string | null>(null);

  const isPending = createUser.isPending;

  useEffect(() => {
    if (!isOpen) {
      setMessage(null);
      setForm({
        username: "",
        email: "",
        password: "",
        roleIds: [],
        languageId: undefined,
        status: "active",
      });
    }
  }, [isOpen]);

  const handleChange = (field: string, value: any) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async () => {
    setMessage(null);

    if (form.roleIds.length === 0) {
      setMessage(messages["select_at_least_one_role"] || "Please select at least one role.");
      return;
    }

    const payload = {
      username: form.username.trim(),
      email: form.email.trim(),
      password: form.password.trim(),
      status: form.status,
      languageId: form.languageId,
      roleIds: form.roleIds,
    };

    try {
      await createUser.mutateAsync(payload);
      setMessage(messages["created_successfully"] || "Created successfully!");

      await new Promise((resolve) => setTimeout(resolve, 1000));

      onSuccess();
      onClose();

    } catch (err) {
      console.error(err);
      setMessage(messages["error"] || "An error occurred while creating.");
    }
  };

  const isFormInvalid = useMemo(() => {
    return (
      form.username.trim() === "" ||
      form.email.trim() === "" ||
      form.password.trim() === "" ||
      form.roleIds.length === 0 ||
      form.languageId === undefined
    );
  }, [form]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="w-full max-w-[600px] p-8 lg:p-10 mx-4 sm:mx-auto"
    >
      <Form onSubmit={handleSubmit}>
        <TitleComponent
          title={messages["add_new_user"] || "Add User"}
          className="mb-6 font-semibold text-center"
        />

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
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label>{messages["username"] || "Username"}</Label>
              <InputField
                type="text"
                value={form.username}
                onChange={(e) => handleChange("username", e.target.value)}
                placeholder={messages["username_placeholder"] || "Enter username"}
                required
              />
            </div>

            <div className="flex-1">
              <Label>{messages["email"] || "Email"}</Label>
              <InputField
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder={messages["email_placeholder"] || "Enter email"}
                required
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label>{messages["user_password"] || "Password"}</Label>
              <InputField
                type="password"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                placeholder={messages["password_placeholder"] || "Enter password"}
                required
              />
            </div>

            <div className="flex-1">
              <Label>{messages["roles"] || "Roles"}</Label>
              <MultiSelect
                options={roles.map((role) => ({
                  value: role.id.toString(),
                  text: role.name,
                  selected: form.roleIds.includes(role.id),
                }))}
                defaultSelected={form.roleIds.map((id) => id.toString())}
                onChange={(selected) => {
                  handleChange(
                    "roleIds",
                    selected.map((v) => parseInt(v))
                  );
                }}
                disabled={roles.length === 0 || isPending}
                placeholder={messages["select_roles"] || "Select Roles"}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label>{messages["language"] || "Language"}</Label>
              <Select
                value={form.languageId?.toString() || ""}
                onChange={(value) => handleChange("languageId", parseInt(value))}
                options={languages.map((lang) => ({
                  value: lang.id.toString(),
                  label: lang.name,
                }))}
                placeholder={messages["select_language"] || "Select Language"}
                required
              />
            </div>

            <div className="flex-1">
              <Label>{messages["status"] || "Status"}</Label>
              <Select
                value={form.status}
                onChange={(value) => handleChange("status", value)}
                options={[
                  { value: "active", label: messages["active"] || "Active" },
                  { value: "inactive", label: messages["inactive"] || "Inactive" },
                ]}
                placeholder={messages["select_status"] || "Select Status"}
                required
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6">
          <Button size="sm" variant="outline" onClick={onClose} disabled={isPending}>
            {messages["close"] || "Close"}
          </Button>
          <Button 
            size="sm" 
            type="submit" 
            disabled={isPending || isFormInvalid}
          >
            {isPending ? (messages["creating"] || "Creating...") : (messages["create"] || "Create")}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddUserModal;