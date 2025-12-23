"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { useLocale } from "@/context/LocaleContext";
import Form from "@/components/form/Form";
import { SocialLink } from "@/types/SocialLink";
import { IconPicker, IconName } from "../IconPicker";
import { useUpdateSocialLink } from "@/hooks/useSocialLink";
import { LoadingIcon } from "@/icons";
import Message from "@/components/ui/Message";

interface Props {
  isOpen: boolean;
  onSuccess: () => void;
  link: SocialLink;
  onClose: () => void;
}

interface FormState {
  platform: string;
  icon: IconName | "";
  url: string;
  order: number;
}

const EditSocialLinkModal: React.FC<Props> = ({
  isOpen,
  link,
  onClose,
  onSuccess,
}) => {
  const { messages } = useLocale();
  const updateSocialLink = useUpdateSocialLink();
  const isPending = updateSocialLink.isPending;

  const [form, setForm] = useState<FormState>({
    platform: "",
    icon: "" as IconName | "",
    url: "",
    order: 1,
  });

  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    if (!isOpen) setMessage(null);

    if (link && isOpen) {
      setForm({
        platform: link.platform,
        icon: link.icon as IconName,
        url: link.url,
        order: link.order,
      });
    }
  }, [link, isOpen]);

  const handleChange = (field: keyof FormState, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!link?.id) return;

    setMessage(null);

    try {
      await updateSocialLink.mutateAsync({
        id: link.id,
        data: {
          platform: form.platform.trim(),
          icon: form.icon,
          url: form.url.trim(),
          order: form.order,
        },
      });

      setMessage({
        text: messages["updated_successfully"] || "Link updated successfully!",
        type: "success",
      });

      setTimeout(() => {
        onClose();
        onSuccess();
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setMessage({
        text:
          err?.response?.data?.message ||
          messages["update_error"] ||
          "An error occurred while updating.",
        type: "error",
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="w-full max-w-[600px] p-8 lg:p-4 mx-2 sm:mx-auto"
    >
      <div className="relative w-full h-[70vh] flex flex-col rounded-3xl bg-white dark:bg-gray-900">
        <div className="text-center px-4 pt-5">
          <h4 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1">
            {messages["update"] || "Edit Social Link"}
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {messages["social_link_modal_description"] ||
              "Edit your social platform."}
          </p>
        </div>

        {/* ✅ Message الموحد */}
        <Message message={message} />

        <Form onSubmit={handleSubmit} className="flex flex-col flex-1">
          <div className="flex-1 overflow-y-auto px-4 space-y-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>{messages["platform"] || "Platform"}</Label>
                <Input
                  value={form.platform}
                  onChange={(e) =>
                    handleChange("platform", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>{messages["display_order"] || "Order"}</Label>
                <Input
                  type="number"
                  min={1}
                  value={form.order}
                  onChange={(e) =>
                    handleChange("order", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{messages["url"] || "URL"}</Label>
              <Input
                value={form.url}
                onChange={(e) => handleChange("url", e.target.value)}
                placeholder="https://"
              />
            </div>

            <div className="space-y-2">
              <Label>{messages["icon_name"] || "Icon"}</Label>
              <IconPicker
                value={form.icon}
                onChange={(iconName: IconName) =>
                  handleChange("icon", iconName)
                }
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-6">
            <Button
              size="sm"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
            >
              {messages["cancel"] || "Cancel"}
            </Button>

            <Button size="sm" type="submit" disabled={isPending}>
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
      </div>
    </Modal>
  );
};

export default EditSocialLinkModal;
