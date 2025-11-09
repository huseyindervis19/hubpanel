"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import InputField from "@/components/form/input/InputField";
import { useCreateRole } from "@/hooks/useRoles";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddRoleModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const createRole = useCreateRole();

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setMessage(null);
    }
  }, [isOpen]);

  const handleChange = (field: string, value: string | number) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const payload = {
      name: form.name,
      description: form.description,
    };

    try {
      await createRole.mutateAsync(payload);

      setMessage("Role created successfully!");

      await new Promise((resolve) => setTimeout(resolve, 1000));

      onSuccess();
      onClose();

      setForm({
        name: "",
        description: "",
      });
    } catch (err) {
      console.error(err);
      setMessage("Error creating role. Please try again.");
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
          Add Role
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
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label>Name</Label>
              <InputField
                type="text"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Enter role name"
                required
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label>Description</Label>
              <InputField
                type="text"
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Enter role description"
              />
            </div>
          </div>
        </div>

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

export default AddRoleModal;
