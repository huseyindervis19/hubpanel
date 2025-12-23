"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import TextArea from "@/components/form/input/TextArea";
import FileInput from "@/components/form/input/FileInput";
import Form from "@/components/form/Form";
import { AboutUs } from "@/types/AboutUs";
import { useLocale } from "@/context/LocaleContext";
import TitleComponent from "@/components/ui/TitleComponent";
import { useUpdateAboutUs } from "@/hooks/useAboutUs";
import { LoadingIcon } from "@/icons";
import Message from "@/components/ui/Message";

interface EditAboutUsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  data: AboutUs;
}

export const EditAboutUsModal = ({
  isOpen,
  onClose,
  onSuccess,
  data,
}: EditAboutUsModalProps) => {
  const { messages, locale } = useLocale();
  const updateAboutUs = useUpdateAboutUs();

  const [form, setForm] = useState({
    story: "",
    mission: "",
    vision: "",
    values: "",
    imageFile: null as File | null,
    imagePreview: "" as string,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (data && isOpen) {
      setForm({
        story: data.translated?.story ?? "",
        mission: data.translated?.mission ?? "",
        vision: data.translated?.vision ?? "",
        values: data.translated?.values ?? "",
        imageFile: null,
        imagePreview: data.imageUrl
          ? `${process.env.NEXT_PUBLIC_API_URL}${data.imageUrl}`
          : "",
      });
    } else if (!isOpen) {
      setForm({
        story: "",
        mission: "",
        vision: "",
        values: "",
        imageFile: null,
        imagePreview: "",
      });
      setMessage(null);
    }
  }, [data, isOpen]);

  const handleTextAreaChange = (
    field: "story" | "mission" | "vision" | "values",
    value: string
  ) => {
    setForm(prev => ({ ...prev, [field]: value }));
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
    if (!data?.id) return;

    setLoading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("story", form.story);
      formData.append("mission", form.mission);
      formData.append("vision", form.vision);
      formData.append("values", form.values);
      if (form.imageFile) formData.append("imageUrl", form.imageFile);

      await updateAboutUs.mutateAsync({
        id: data.id,
        data: formData,
        lang: locale,
      });

      setMessage({
        text: messages["updated_successfully"] || "Updated successfully",
        type: "success",
      });

      setTimeout(() => {
        onClose();
        onSuccess();
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

  const LABEL = "text-md text-gray-800 dark:text-white/90";

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] p-0">
      <div className="max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 dark:bg-gray-900">
        <Form onSubmit={handleSubmit}>
          <TitleComponent
            title={messages["about_us"] || "Edit About Us"}
            className="text-center mb-6"
          />

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

          <div className="space-y-1 mt-4">
            <Label className={LABEL}>
              {messages["about_us_story"] || "Story"} :
            </Label>
            <TextArea
              value={form.story}
              onChange={v => handleTextAreaChange("story", v)}
              rows={3}
            />
          </div>

          <div className="space-y-1 mt-4">
            <Label className={LABEL}>
              {messages["about_us_values"] || "Values"} :
            </Label>
            <TextArea
              value={form.values}
              onChange={v => handleTextAreaChange("values", v)}
              rows={3}
            />
          </div>

          <div className="space-y-1 mt-4">
            <Label className={LABEL}>
              {messages["about_us_mission"] || "Mission"} :
            </Label>
            <TextArea
              value={form.mission}
              onChange={v => handleTextAreaChange("mission", v)}
              rows={3}
            />
          </div>

          <div className="space-y-1 mt-4">
            <Label className={LABEL}>
              {messages["about_us_vision"] || "Vision"} :
            </Label>
            <TextArea
              value={form.vision}
              onChange={v => handleTextAreaChange("vision", v)}
              rows={3}
            />
          </div>

          <div className="sticky bottom-0 left-0 right-0 bg-white dark:bg-gray-900 p-4 flex justify-end border-t border-gray-200 dark:border-gray-700">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              {messages["cancel"] || "Cancel"}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <LoadingIcon className="animate-spin" />
                  {messages["updating"] || "Updating..."}
                </>
              ) : (
                messages["update"]
              )}
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};
