"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import InputField from "@/components/form/input/InputField";
import { Role } from "@/types/Role";
import { useUpdateRole } from "@/hooks/useRoles";
import { LoadingIcon } from "@/icons";
import Form from "@/components/form/Form";
import TitleComponent from "@/components/ui/TitleComponent";
import { useLocale } from "@/context/LocaleContext";
import Message from "@/components/ui/Message";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  role: Role | null;
}

const EditRoleModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, role }) => {
  const { messages, locale } = useLocale();
  const updateRole = useUpdateRole();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const isPending = updateRole.isPending;
  const isSuccess = message?.type === "success";

  /* ---------------- INIT / RESET ---------------- */

  useEffect(() => {
    if (isOpen && role) {
      setName(role.translated?.name ?? "");
      setDescription(role.translated?.description ?? "");
      setMessage(null);
    }
  }, [isOpen, role]);

  useEffect(() => {
    if (!isOpen) {
      setName("");
      setDescription("");
      setMessage(null);
    }
  }, [isOpen]);

  /* ---------------- DERIVED STATE ---------------- */

  const isModified = useMemo(() => {
    if (!role) return false;

    return (
      name.trim() !== (role.translated?.name ?? "") ||
      description.trim() !== (role.translated?.description ?? "")
    );
  }, [name, description, role]);

  const isInvalid = name.trim().length === 0;

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!role?.id || isInvalid) return;

      setMessage(null);

      const payload: { name?: string; description?: string } = {};

      if (name.trim() !== role.translated?.name) {
        payload.name = name.trim();
      }

      if (description.trim() !== (role.translated?.description ?? "")) {
        payload.description = description.trim();
      }

      try {
        await updateRole.mutateAsync({
          id: role.id,
          payload,
          lang: locale,
        });

        setMessage({
          text: messages["updated_successfully"] || "Updated successfully!",
          type: "success",
        });

        setTimeout(() => {
          onClose();
          onSuccess();
        }, 800);
      } catch (error) {
        console.error(error);
        setMessage({
          text:
            messages["updated_error"] ||
            "An error occurred while updating.",
          type: "error",
        });
      }
    },
    [role, name, description, locale, isInvalid, updateRole, messages, onClose, onSuccess]
  );

  /* ---------------- RENDER ---------------- */

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="w-full max-w-[600px] p-8 lg:p-10 mx-4 sm:mx-auto"
    >
      <Form onSubmit={handleSubmit}>
        <TitleComponent
          title={messages["edit_role"] || "Edit Role"}
          className="mb-6 text-center"
        />

        <Message message={message} />

        <div className="space-y-6">
          {/* Name */}
          <div>
            <Label>{messages["role_name"] || "Name"}</Label>
            <InputField
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={messages["role_name_placeholder"] || "Enter role name"}
              required
            />
          </div>

          {/* Description */}
          <div>
            <Label>{messages["role_description"] || "Description"}</Label>
            <InputField
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                messages["role_description_placeholder"] ||
                "Enter role description"
              }
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6">
          <Button
            size="sm"
            variant="outline"
            onClick={onClose}
            disabled={isPending || isSuccess}
          >
            {messages["cancel"] || "Cancel"}
          </Button>

          <Button
            size="sm"
            type="submit"
            disabled={isPending || !isModified || isInvalid || isSuccess}
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
                  className="animate-spin -ml-1 mr-3"
                />
                {messages["updating"] || "Updating..."}
              </>
            ) : (
              messages["update"] || "Update"
            )}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default EditRoleModal;
