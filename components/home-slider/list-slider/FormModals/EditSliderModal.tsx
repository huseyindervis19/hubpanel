"use client";

import React, { useState, useEffect } from "react";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import InputField from "@/components/form/input/InputField";
import Form from "@/components/form/Form";
import { Modal } from "@/components/ui/modal";
import { LoadingIcon } from "@/icons";
import TitleComponent from "@/components/ui/TitleComponent";
import { useLocale } from "@/context/LocaleContext";
import { useHomeSlider } from "@/hooks/useHomeSlider";
import { HomeSlider } from "@/types/HomeSlider";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  slider?: HomeSlider | null;
}

interface FormState {
  title: string;
  subTitle: string;
  ctaText: string;
}

const EditSliderModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, slider }) => {
  const { messages, locale } = useLocale();
  const { update } = useHomeSlider(locale);

  const [form, setForm] = useState<FormState>({ title: "", subTitle: "", ctaText: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (slider && isOpen) {
      setForm({
        title: slider.translated?.title || "",
        subTitle: slider.translated?.subTitle || "",
        ctaText: slider.translated?.ctaText || "",
      });
      setMessage(null);
    } else if (!isOpen) {
      setForm({ title: "", subTitle: "", ctaText: "" });
      setMessage(null);
    }
  }, [slider, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slider?.id) return;
    setLoading(true);
    setMessage(null);

    try {
      await update({ id: slider.id, data: { title: form.title, subTitle: form.subTitle, ctaText: form.ctaText }, lang: locale });
      setMessage(messages["updated_successfully"] || "Updated successfully!");
      await new Promise((res) => setTimeout(res, 1200));
      onClose();
      onSuccess?.();
    } catch (err) {
      console.error(err);
      setMessage(messages["update_failed"] || "Update failed.");
    } finally {
      setLoading(false);
    }
  };

  const LABEL = "text-md text-gray-800 dark:text-white/90";

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[600px] p-6">
      <Form onSubmit={handleSubmit}>
        <TitleComponent title={messages["edit_home_slider"] || "Edit Slider"} className="text-center mb-6" />

                {message && (
          <div className={`p-4 rounded-xl border mb-4 ${
            message.includes("successfully") || message.includes("Updated")
              ? "border-success-200 bg-success-50 text-success-700 dark:border-success-700 dark:bg-success-900/20"
              : "border-error-200 bg-error-50 text-error-700 dark:border-error-700 dark:bg-error-900/20"
          }`}>
            {message}
          </div>
        )}

        <Label className={LABEL}>{messages["slider_title"] || "Title"}</Label>
        <InputField name="title" value={form.title} onChange={handleChange} />

        <Label className={LABEL}>{messages["slider_subtitle"] || "Sub Title"}</Label>
        <InputField name="subTitle" value={form.subTitle} onChange={handleChange} />

        <Label className={LABEL}>{messages["slider_cta_text"] || "CTA Text"}</Label>
        <InputField name="ctaText" value={form.ctaText} onChange={handleChange} />

        <div className="flex justify-end mt-6 gap-3">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            {messages["close"]}
          </Button>

          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <LoadingIcon className="animate-spin" />
                {messages["updating"]}
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

export default EditSliderModal;
