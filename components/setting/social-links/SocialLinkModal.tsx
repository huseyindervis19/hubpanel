"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { useLocale } from "@/context/LocaleContext";
import { SocialLink } from "@/types/SocialLink";

export type SocialLinkFormValues = {
  platform: string;
  icon: string;
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
  onSubmit,
}: SocialLinkModalProps) => {
  const { messages } = useLocale();
  const [form, setForm] = useState<SocialLinkFormValues>({
    platform: "",
    icon: "",
    url: "",
    order: 1,
  });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        platform: initialData.platform,
        icon: initialData.icon,
        url: initialData.url,
        order: initialData.order,
      });
    } else {
      setForm({
        platform: "",
        icon: "",
        url: "",
        order: 1,
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (field: keyof SocialLinkFormValues, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: field === "order" ? Number(value) || 0 : value,
    }));
  };

 const handleSubmit = async (event: React.FormEvent) => {
  event.preventDefault();

  await onSubmit(form);
  setSuccess(true);

  setTimeout(() => {
    setSuccess(false);
    onClose();
  }, 1500);
};


  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4">
      <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-8">
          <h4 className="mb-2 text-2xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            {messages["social_link_modal_description"] ||
              "Add or update your social platforms to keep users connected."}
          </p>
        </div>
           {success && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 shadow-sm dark:border-green-700 dark:bg-green-900/30 dark:text-green-300 animate-in slide-in-from-top-2 duration-300">
            {mode === "edit"
              ? messages["updated_successfully"] || "Updated successfully"
              : messages["created_successfully"] || "Created successfully"}
          </div>
        )}
        <br />
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-800 dark:text-white/80">
                {messages["platform"] || "Platform"}
              </Label>
              <Input
                value={form.platform}
                onChange={(e) => handleChange("platform", e.target.value)}
                placeholder={messages["platform_placeholder"] || "e.g. Facebook"}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-800 dark:text-white/80">
                {messages["icon_name"] || "Icon Name"}
              </Label>
              <Input
                value={form.icon}
                onChange={(e) => handleChange("icon", e.target.value)}
                placeholder={messages["icon_placeholder"] || "Facebook"}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-800 dark:text-white/80">
                {messages["url"] || "URL"}
              </Label>
              <Input
                value={form.url}
                onChange={(e) => handleChange("url", e.target.value)}
                placeholder="https://"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-800 dark:text-white/80">
                {messages["display_order"] || "Display Order"}
              </Label>
              <Input
                type="number"
                min={1}
                value={form.order}
                onChange={(e) => handleChange("order", e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 px-2">
            <Button size="sm" variant="outline" onClick={onClose}>
              {messages["cancel"] || "Cancel"}
            </Button>
            <Button size="sm" type="submit" disabled={loading}>
              {loading
                ? messages["submitting"] || "Submitting..."
                : messages["save"] || "Save"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

