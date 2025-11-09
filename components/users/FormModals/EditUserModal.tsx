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
import { User } from "@/types/User";
import { useUpdateUser } from "@/hooks/useUsers";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user: User | null;
}

const EditUserModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, user }) => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    roleIds: [] as number[],
    languageId: undefined as number | undefined,
    status: "active" as "active" | "inactive",
  });

  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { roles = [], isLoading: rolesLoading } = useRoles();
  const { languages = [], isLoading: langsLoading } = useLanguages();
  const updateUser = useUpdateUser();

  useEffect(() => {
    if (!isOpen) setMessage(null);
  }, [isOpen]);

  // --- Initialize form with user's current data ---
  useEffect(() => {
    if (user && !rolesLoading && !langsLoading) {
      setForm({
        username: user.username || "",
        email: user.email || "",
        roleIds: user.userRoles?.map((ur) => ur.role.id) || [],
        languageId: user.language?.id || user.languageId,
        status: user.status === "active" || user.status === "inactive" ? user.status : "active",
      });
      setMessage(null);
    }
  }, [user, rolesLoading, langsLoading]);

  const handleChange = (field: string, value: any) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.id) return;

    if (form.roleIds.length === 0) {
      setMessage("Please select at least one role.");
      return;
    }

    setLoading(true);
    try {
      await updateUser.mutateAsync({ id: user.id, data: form });

      setMessage("User updated successfully!");
      await new Promise((resolve) => setTimeout(resolve, 1000));

      onClose();
      onSuccess();

    } catch (err) {
      console.error(err);
      setMessage("Error updating user. Please try again.");
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
        <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90 text-center">
          Edit User
        </h4>

        {message && (
          <p
            className={`mb-4 text-center font-medium ${message.includes("Error") ? "text-red-600" : "text-green-600"
              }`}
          >
            {message}
          </p>
        )}

        <div className="space-y-6">
          {/* Username & Email */}
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

          {/* Roles */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label>Roles</Label>
              <MultiSelect
                options={roles.map((role) => ({
                  value: role.id.toString(),
                  text: role.name,
                  label: role.name,
                  selected: form.roleIds.includes(role.id),
                }))}
                defaultSelected={form.roleIds.map((id) => id.toString())}
                onChange={(selected) => handleChange(
                  "roleIds",
                  selected.map((v) => parseInt(v))
                )}
                placeholder={rolesLoading ? "Loading roles..." : "Select Role"}
                disabled={rolesLoading}
              />

            </div>

            {/* Language */}
            <div className="flex-1">
              <Label>Language</Label>
              <Select
                value={form.languageId?.toString() || ""}
                onChange={(value) => handleChange("languageId", parseInt(value))}
                options={languages.map((l) => ({
                  value: String(l.id),
                  label: l.name,
                }))}
                placeholder={langsLoading ? "Loading languages..." : "Select Language"}
                disabled={langsLoading}
                required
              />
            </div>
          </div>

          {/* Status */}
          <div className="flex flex-col sm:flex-row gap-4">
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

export default EditUserModal;
