"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import InputField from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import MultiSelect from "@/components/form/MultiSelect";
import { useRoles } from "@/hooks/useRoles";
import { useLanguages } from "@/hooks/useLanguages";
import { useCreateUser } from "@/hooks/useUsers";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddUserModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) setMessage(null);
  }, [isOpen]);

  const handleChange = (field: string, value: any) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (form.roleIds.length === 0) {
      setMessage("Please select at least one role.");
      setLoading(false);
      return;
    }

    const payload = {
      username: form.username,
      email: form.email,
      password: form.password,
      status: form.status,
      languageId: form.languageId,
      roleIds: form.roleIds,
    };

    try {
      await createUser.mutateAsync(payload);
      setMessage("User created successfully!");

      await new Promise((resolve) => setTimeout(resolve, 1000));

      onSuccess();
      onClose();

      setForm({
        username: "",
        email: "",
        password: "",
        roleIds: [],
        languageId: undefined,
        status: "active",
      });
    } catch (err) {
      console.error(err);
      setMessage("Error creating user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="w-full max-w-[600px] p-8 lg:p-10 mx-4 sm:mx-auto"
    >
      <form onSubmit={handleSubmit}>
        <h4 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90 text-center">
          Add User
        </h4>

        {message && (
          <p
            className={`mb-4 text-center font-medium ${message.includes("Error") ? "text-red-600" : "text-green-600"
              }`}
          >
            {message}
          </p>
        )}

        <div className="space-y-4">
          {/* Username + Email */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label>Username</Label>
              <InputField
                type="text"
                value={form.username}
                onChange={(e) => handleChange("username", e.target.value)}
                placeholder="Enter username"
                required
              />
            </div>

            <div className="flex-1">
              <Label>Email</Label>
              <InputField
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="Enter email"
                required
              />
            </div>
          </div>

          {/* Password + Roles */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label>Password</Label>
              <InputField
                type="password"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>

            <div className="flex-1">
              <Label>Roles</Label>
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
                disabled={roles.length === 0}
                placeholder="Select Roles"
              />

            </div>
          </div>

          {/* Language + Status */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label>Language</Label>
              <Select
                value={form.languageId?.toString() || ""}
                onChange={(value) => handleChange("languageId", parseInt(value))}
                options={languages.map((lang) => ({
                  value: lang.id.toString(),
                  label: lang.name,
                }))}
                placeholder="Select Language"
                required
              />
            </div>

            <div className="flex-1">
              <Label>Status</Label>
              <Select
                value={form.status}
                onChange={(value) => handleChange("status", value)}
                options={[
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" },
                ]}
                placeholder="Select Status"
                required
              />
            </div>
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

export default AddUserModal;
