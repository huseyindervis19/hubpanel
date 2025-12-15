"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/form/Label";
import InputField from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import FileInput from "@/components/form/input/FileInput";
import Form from "@/components/form/Form";
import { LoadingIcon } from "@/icons";
import { useLocale } from "@/context/LocaleContext";
import { useCreateHomeSlider } from "@/hooks/useHomeSlider";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormState {
  title: string;
  subTitle: string;
  ctaText: string;
  ctaLink: string;
}

const AddModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const { messages } = useLocale();
  const CreateHomeSlider = useCreateHomeSlider();

  const [form, setForm] = useState<FormState>({
    title: "",
    subTitle: "",
    ctaText: "",
    ctaLink: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("No file chosen");
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!success) {
      setForm({ title: "", subTitle: "", ctaText: "", ctaLink: "" });
      setFile(null);
      setFileName("No file chosen");
      setMessage(null);
    }
  }, [success]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setFileName(selectedFile?.name || "No file chosen");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!form.title.trim()) {
      setMessage(messages["required_fields_error"] || "Please provide a title.");
      return;
    }

    if (!file) {
      setMessage(messages["required_fields_error"] || "Please choose an image.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", form.title.trim());
      formData.append("subTitle", form.subTitle.trim());
      formData.append("ctaText", form.ctaText.trim());
      formData.append("ctaLink", form.ctaLink.trim());
      formData.append("imageUrl", file);

      await CreateHomeSlider.mutateAsync(formData);
      setMessage(messages["created_successfully"] || "Created Successfully!");
      setSuccess(true);

      setTimeout(() => {
        onSuccess();
        onClose();
        setSuccess(false);
      }, 700);
    } catch (err) {
      console.error(err);
      setMessage(messages["created_error"] || "An error occurred while creating.");
    }
  };

  const LABEL_CLASS = "text-md text-gray-800 dark:text-white/90";

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md p-6">
      <h4 className="text-center text-lg font-semibold text-gray-800 dark:text-white mb-4">
        {messages["add_home_slider"] || "Add Slider"}
      </h4>

      {message && (
        <div
          className={`p-4 rounded-xl border transition-opacity duration-300 ${message.includes("successfully") || message.includes("Successfully")
            ? "border-success-200 bg-success-50 text-success-700 dark:border-success-700 dark:bg-success-900/20"
            : "border-error-200 bg-error-50 text-error-700 dark:border-error-700 dark:bg-error-900/20"
            }`}
        >
          {message}
        </div>
      )}

      <Form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
        <div className="space-y-1">
          <Label htmlFor="file" className={LABEL_CLASS}>
            {messages["slider_image"] || "Image"}  :
          </Label>
          <FileInput
            id="file"
            onChange={handleFileChange}
            className="w-full"
            accept="image/*"
            placeholder={messages["choose_file"] || "Choose File"}
            fileName={fileName}
          />
        </div>

        <div>
          <Label htmlFor="title" className={LABEL_CLASS}>
            {messages["slider_title"] || "Title"} :
          </Label>
          <InputField
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder={messages["slider_title_placeholder"] || "Enter title"}
            required
          />
        </div>

        <div>
          <Label htmlFor="subTitle" className={LABEL_CLASS}>
            {messages["slider_subtitle"] || "Sub Title"} :
          </Label>
          <InputField
            id="subTitle"
            name="subTitle"
            value={form.subTitle}
            onChange={handleChange}
            placeholder={messages["slider_subtitle_placeholder"] || "Enter subtitle"}
          />
        </div>

        <div>
          <Label htmlFor="ctaLink" className={LABEL_CLASS}>
            {messages["slider_cta_link"] || "CTA Link"} :
          </Label>
          <InputField
            id="ctaLink"
            name="ctaLink"
            value={form.ctaLink}
            onChange={handleChange}
            placeholder={messages["slider_cta_link_placeholder"] || "/products or https://..."}
          />
        </div>

        <div>
          <Label htmlFor="ctaText" className={LABEL_CLASS}>
            {messages["slider_cta_text"] || "CTA Text"} :
          </Label>
          <InputField
            id="ctaText"
            name="ctaText"
            value={form.ctaText}
            onChange={handleChange}
            placeholder={messages["slider_cta_text_placeholder"] || "Enter CTA text"}
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            {messages["cancel"] || "Cancel"}
          </Button>
          <Button type="submit" variant="primary" size="sm" disabled={CreateHomeSlider.isPending || success} className="text-white">
            {CreateHomeSlider.isPending ? (
              <>
                <LoadingIcon width={16} height={16} className="animate-spin -ml-1 mr-3 !text-white !opacity-100 dark:!invert-0" />
                {messages["creating"] || "Creating..."}
              </>
            ) : (
              messages["create"] || "Create"
            )}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddModal;
