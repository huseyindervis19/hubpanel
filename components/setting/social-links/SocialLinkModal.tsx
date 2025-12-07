"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { useLocale } from "@/context/LocaleContext";
import { SocialLink } from "@/types/SocialLink";
import { IconPicker, IconName } from "./IconPicker";

export type SocialLinkFormValues = {
  platform: string;
  icon: IconName;
  url: string;
  order: number;
};

interface SocialLinkModalProps {
  isOpen: boolean;
  title: string;
  loading: boolean;
  initialData?: SocialLink | null;
  onClose: () => void;
  mode: "create" | "edit";
  onSubmit: (values: SocialLinkFormValues) => Promise<void> | void;
}

export const SocialLinkModal = ({
  isOpen,
  title,
  loading,
  initialData,
  onClose,
  mode,
  onSubmit
}: SocialLinkModalProps) => {
  const { messages } = useLocale();

  const [form, setForm] = useState<SocialLinkFormValues>({
    platform: "",
    icon: "" as IconName,
    url: "",
    order: 1
  });

  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        platform: initialData.platform,
        icon: initialData.icon as IconName,
        url: initialData.url,
        order: initialData.order
      });
    } else {
      setForm({
        platform: "",
        icon: "" as IconName,
        url: "",
        order: 1
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (field: keyof SocialLinkFormValues, value: string) => {
    setForm(prev => ({
      ...prev,
      [field]: field === "order" ? Number(value) : value
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await onSubmit(form);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4">
      <div className="relative w-full h-[70vh] flex flex-col rounded-3xl bg-white dark:bg-gray-900">

        <div className="text-center px-4 pt-5">
          <h4 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1">{title}</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {messages["social_link_modal_description"] ||
              "Add or update your social platforms to keep users connected."}
          </p>
        </div>

        {success && (
          <div className="mx-4 mb-3 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-700 dark:bg-green-900/30 dark:text-green-300">
            {mode === "edit"
              ? messages["updated_successfully"] || "Updated successfully"
              : messages["created_successfully"] || "Created successfully"}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col flex-1">
          <div className="flex-1 overflow-y-auto px-4 space-y-6 pb-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-800 dark:text-white/80">
                  {messages["platform"] || "Platform"}
                </Label>
                <Input
                  value={form.platform}
                  onChange={e => handleChange("platform", e.target.value)}
                  placeholder={messages["platform_placeholder"] || "e.g. Facebook"}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-800 dark:text-white/80">
                  {messages["display_order"] || "Order"}
                </Label>
                <Input
                  type="number"
                  min={1}
                  value={form.order}
                  onChange={e => handleChange("order", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-800 dark:text-white/80">
                {messages["url"] || "URL"}
              </Label>
              <Input
                value={form.url}
                onChange={e => handleChange("url", e.target.value)}
                placeholder="https://"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-800 dark:text-white/80">
                {messages["icon_name"] || "Icons"}
              </Label>
              <IconPicker
                value={form.icon || ""}
                onChange={(iconName) => handleChange("icon", iconName)}
              />
            </div>

          </div>

          <div className="flex items-center justify-end gap-3 px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 sticky bottom-0">
            <Button size="sm" variant="outline" type="button" onClick={onClose}>
              {messages["cancel"] || "Cancel"}
            </Button>
            <Button size="sm" type="submit" disabled={loading}>
              {loading ? messages["creating"] || "Creating..." : messages["create"] || "Create"}
            </Button>
          </div>

        </form>
      </div>
    </Modal>
  );
};
