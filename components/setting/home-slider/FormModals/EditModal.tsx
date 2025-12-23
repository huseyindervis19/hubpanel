"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import InputField from "@/components/form/input/InputField";
import FileInput from "@/components/form/input/FileInput";
import Form from "@/components/form/Form";
import { LoadingIcon } from "@/icons";
import TitleComponent from "@/components/ui/TitleComponent";
import { useLocale } from "@/context/LocaleContext";
import { useUpdateHomeSlider } from "@/hooks/useHomeSlider";
import { HomeSlider } from "@/types/HomeSlider";
import Message from "@/components/ui/Message";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  slider?: HomeSlider | null;
}

const EditSliderModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, slider }) => {
  const { messages, locale } = useLocale();
  const updateHomeSlider = useUpdateHomeSlider();

  const [form, setForm] = useState({
    title: "",
    subTitle: "",
    ctaLink: "",
    ctaText: "",
    imageFile: null as File | null,
    imagePreview: "" as string,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (slider && isOpen) {
      setForm({
        title: slider.translated?.title || "",
        subTitle: slider.translated?.subTitle || "",
        ctaLink: slider?.ctaLink || "",
        ctaText: slider.translated?.ctaText || "",
        imageFile: null,
        imagePreview: slider.imageUrl ? `${process.env.NEXT_PUBLIC_API_URL}${slider.imageUrl}` : "",
      });
    } else if (!isOpen) {
      setForm({
        title: "",
        subTitle: "",
        ctaLink: "",
        ctaText: "",
        imageFile: null,
        imagePreview: "",
      });
      setMessage(null);
    }
  }, [slider, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setForm(prev => ({ ...prev, imageFile: selectedFile }));

    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setForm(prev => ({ ...prev, imagePreview: url }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slider?.id) return;

    setLoading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("subTitle", form.subTitle);
      formData.append("ctaLink", form.ctaLink);
      formData.append("ctaText", form.ctaText);
      if (form.imageFile) formData.append("imageUrl", form.imageFile);

      await updateHomeSlider.mutateAsync({ id: slider.id, data: formData, lang: locale });

      setMessage({
        text: messages["updated_successfully"] || "Updated successfully",
        type: "success",
      });

      setTimeout(() => {
        onClose();
        onSuccess?.();
        setMessage(null);
      }, 1200);
    } catch (err) {
      setMessage({
        text: messages["updated_error"] || "An error occurred",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md p-6">
      <div className="space-y-4">
        <Form onSubmit={handleSubmit}>
          <TitleComponent
            title={messages["edit_home_slider"] || "Edit Slider"}
            className="text-center mb-4"
          />

          {/* ✅ Message الموحد */}
          <Message message={message} />

          <FileInput
            accept="image/*"
            onChange={handleFileChange}
            placeholder={messages["choose_file"] || "Choose File"}
          />

          {form.imagePreview && (
            <img
              src={form.imagePreview}
              alt="preview"
              className="w-full max-h-32 object-cover rounded-xl border border-gray-200 dark:border-gray-700 mt-2"
            />
          )}

          <div className="space-y-3">
            <div>
              <Label className="text-md text-gray-800 dark:text-white/90">
                {messages["slider_title"] || "Title"} :
              </Label>
              <InputField name="title" value={form.title} onChange={handleChange} />
            </div>

            <div>
              <Label className="text-md text-gray-800 dark:text-white/90">
                {messages["slider_subtitle"] || "Sub Title"} :
              </Label>
              <InputField name="subTitle" value={form.subTitle} onChange={handleChange} />
            </div>

            <div>
              <Label className="text-md text-gray-800 dark:text-white/90">
                {messages["slider_cta_link"] || "CTA Link"} :
              </Label>
              <InputField name="ctaText" value={form.ctaLink} onChange={handleChange} />
            </div>

            <div>
              <Label className="text-md text-gray-800 dark:text-white/90">
                {messages["slider_cta_text"] || "CTA Text"} :
              </Label>
              <InputField name="ctaText" value={form.ctaText} onChange={handleChange} />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              {messages["cancel"] || "Cancel"}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <LoadingIcon className="animate-spin -ml-1 mr-2" />
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

export default EditSliderModal;
