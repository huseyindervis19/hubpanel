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
import { User } from "@/types/User";
import { useUpdateUser } from "@/hooks/useUsers";
import { LoadingIcon } from "@/icons";

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

  const { roles = [], isLoading: rolesLoading } = useRoles();
  const { languages = [], isLoading: langsLoading } = useLanguages();
  const updateUser = useUpdateUser();

  const isPending = updateUser.isPending;

  useEffect(() => {
    if (!isOpen) setMessage(null);
  }, [isOpen]);

  useEffect(() => {
    if (user && !rolesLoading && !langsLoading) {
      const initialRoleIds = user.userRoles?.map((ur) => ur.role.id) || [];

      setForm({
        username: user.username || "",
        email: user.email || "",
        roleIds: initialRoleIds,
        languageId: user.language?.id || user.languageId,
        status: (user.status === "active" || user.status === "inactive" ? user.status : "active"),
      });
      setMessage(null);
    }
  }, [user, rolesLoading, langsLoading, isOpen]);

  const handleChange = (field: string, value: any) => {
    setForm({ ...form, [field]: value });
  };

  const isModified = useMemo(() => {
    if (!user) return false;

    const arraysEqual = (a: number[], b: number[]) => {
      if (a.length !== b.length) return false;
      const setA = new Set(a);
      const setB = new Set(b);
      return a.every(item => setB.has(item)) && b.every(item => setA.has(item));
    };

    const initialRoleIds = user.userRoles?.map((ur) => ur.role.id) || [];
    const roleIdsChanged = !arraysEqual(form.roleIds, initialRoleIds);

    const languageIdChanged = form.languageId !== (user.language?.id || user.languageId);

    const usernameChanged = form.username.trim() !== (user.username || "");
    const emailChanged = form.email.trim() !== (user.email || "");
    const statusChanged = form.status !== (user.status || "active");

    return usernameChanged || emailChanged || roleIdsChanged || languageIdChanged || statusChanged;
  }, [form, user]);

  const isFormInvalid = useMemo(() => {
    return (
      form.username.trim() === "" ||
      form.email.trim() === "" ||
      form.roleIds.length === 0 ||
      form.languageId === undefined
    );
  }, [form]);

  const handleSubmit = async () => {
    if (!user || !user.id) return;

    if (form.roleIds.length === 0) {
      setMessage("Please select at least one role.");
      return;
    }

    setMessage(null);

    const payload = {
      username: form.username.trim(),
      email: form.email.trim(),
      status: form.status,
      languageId: form.languageId,
      roleIds: form.roleIds,
    };

    try {
      await updateUser.mutateAsync({ id: user.id, data: payload });

      setMessage("User updated successfully!");
      await new Promise((resolve) => setTimeout(resolve, 1000));

      onClose();
      onSuccess();

    } catch (err) {
      console.error(err);
      setMessage("Error updating user. Please try again.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="w-full max-w-[600px] p-8 lg:p-10 mx-4 sm:mx-auto"
    >
      <Form onSubmit={handleSubmit}>
        <TitleComponent
          title="Edit User"
          className="mb-6 text-center"
        />

        {message && (
          <p
            className={`mb-4 text-center font-medium ${message.includes("Error") ? "text-red-600" : "text-green-600"
              }`}
          >
            {message}
          </p>
        )}

        <div className="space-y-6">
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

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label>Roles</Label>
              <MultiSelect
                options={roles.map((role) => ({
                  value: role.id.toString(),
                  text: role.name,
                  label: role.name,
                }))}
                defaultSelected={form.roleIds.map((id) => id.toString())}
                onChange={(selected) => handleChange(
                  "roleIds",
                  selected.map((v) => parseInt(v))
                )}
                placeholder={rolesLoading ? "Loading roles..." : "Select Role"}
                disabled={rolesLoading || isPending}
              />
            </div>

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
                disabled={langsLoading || isPending}
                required
              />
            </div>
          </div>

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
                disabled={isPending}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6">
          <Button size="sm" variant="outline" onClick={onClose} disabled={isPending}>
            Close
          </Button>
          <Button
            size="sm"
            type="submit"
            disabled={isPending || !isModified || isFormInvalid}
          >
            {isPending ? (
              <>
                <LoadingIcon
                  width={16}
                  height={16}
                  className="animate-spin -ml-1 mr-3 !text-white !opacity-100 dark:!invert-0"
                />
                Updating...
              </>
            ) : (
              "Update"
            )}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default EditUserModal;