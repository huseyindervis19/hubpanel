"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import InputField from "@/components/form/input/InputField";
import { Role } from "@/types/Role";
import { useUpdateRole } from "@/hooks/useRoles";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  role: Role;
}

const EditRoleModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, role }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const updateRole = useUpdateRole();

  useEffect(() => {
    if (!isOpen) {
      setMessage(null);
    }
  }, [isOpen]);

  // --- Initialize form when role loads ---
  useEffect(() => {
    if (role) {
      setForm({
        name: role.name || "",
        description: role.description || "",
      });
      setMessage(null);
    }
  }, [role]);

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role.id) return;

    setLoading(true);
    setMessage(null);

    try {
      await updateRole.mutateAsync({ id: role.id, data: form });
      setMessage("Role updated successfully!");

      await new Promise((resolve) => setTimeout(resolve, 1000));

      onClose();
      onSuccess();

      setForm({ name: "", description: "" });
    } catch (err) {
      console.error(err);
      setMessage("Error updating role. Please try again.");
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
          Edit Role
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

        <div className="space-y-6">
          {/* Name */}
          <div>
            <Label>Name</Label>
            <InputField
              type="text"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Enter role name"
              required
            />
          </div>

          {/* Description */}
          <div>
            <Label>Description</Label>
            <InputField
              type="text"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter role description"
            />
          </div>
        </div>

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

export default EditRoleModal;
