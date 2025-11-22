"use client";

import React, { useState, useEffect } from "react";
import Label from "@/components/form/Label";
import InputField from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import TextArea from "@/components/form/input/TextArea";
import FileInput from "@/components/form/input/FileInput";
import Form from "@/components/form/Form";
import { LoadingIcon } from "@/icons";
import TitleComponent from "@/components/ui/TitleComponent";
import { useLocale } from "@/context/LocaleContext";
import { useCreateCategory } from "@/hooks/useCategory";
import { useRouter } from "next/navigation";

interface FormState {
  name: string;
  description: string;
  isFeatured: boolean;
}

const AddCategoryComponent: React.FC = () => {
  const { messages } = useLocale();
  const router = useRouter();
  const createCategoryMutation = useCreateCategory();

  const [form, setForm] = useState<FormState>({
    name: "",
    description: "",
    isFeatured: false,
  });
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("No file chosen");
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!success) {
      setForm({ name: "", description: "", isFeatured: false });
      setFile(null);
      setFileName("No file chosen");
      setMessage(null);
    }
  }, [success]);

  // Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleTextAreaChange = (value: string) => {
    setForm(prev => ({ ...prev, description: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setFileName(selectedFile?.name || "No file chosen");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!file) {
      setMessage(messages["required_fields_error"] || "Please choose an image.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", form.name.trim());
      formData.append("description", form.description.trim());
      formData.append("isFeatured", String(form.isFeatured));
      formData.append("imageUrl", file); // ← تم تعديل اسم الحقل

      await createCategoryMutation.mutateAsync(formData);

      setMessage(messages["created_successfully"] || "Created Successfully!");
      setSuccess(true);

      setTimeout(() => {
        setMessage(null);
        router.push("/categories/list-categories");
      }, 1500);

    } catch (err) {
      console.error(err);
      setMessage(messages["error"] || "An error occurred while creating.");
    }
  };

  const LABEL_CLASS = "text-md text-gray-800 dark:text-white/90";

  return (
    <>
      <TitleComponent
        title={messages["add_new_category"] || "Add New Category"}
        className="mb-6 font-semibold"
      />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] lg:p-8 space-y-6">
        {message && (
          <div className={`p-4 rounded-xl border transition-opacity duration-300 ${
            message.includes("successfully") || message.includes("Successfully")
              ? "border-success-200 bg-success-50 text-success-700 dark:border-success-700 dark:bg-success-900/20"
              : "border-error-200 bg-error-50 text-error-700 dark:border-error-700 dark:bg-error-900/20"
          }`}>
            {message}
          </div>
        )}

        <Form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="name" className={LABEL_CLASS}>
              {messages["category_name"] || "Category Name"} <span className="text-error-500">*</span>
            </Label>
            <InputField
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder={messages["category_name_placeholder"] || "Enter category name"}
              required
            />
          </div>

          <div>
            <Label htmlFor="description" className={LABEL_CLASS}>
              {messages["category_description"] || "Description"}
            </Label>
            <TextArea
              value={form.description}
              onChange={handleTextAreaChange}
              rows={4}
              placeholder={messages["category_description_placeholder"] || "Enter description"}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <Label htmlFor="file" className={LABEL_CLASS}>
                {messages["category_image"] || "Category Image"} <span className="text-error-500">*</span>
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

            <div className="flex flex-col justify-between">
              <Label htmlFor="isFeatured" className={LABEL_CLASS}>
                {messages["is_featured"] || "Is Featured"}
              </Label>
              <input
                type="checkbox"
                id="isFeatured"
                name="isFeatured"
                checked={form.isFeatured}
                onChange={handleChange}
                className="w-5 h-5"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={createCategoryMutation.isPending || success}
              className={createCategoryMutation.isPending ? "opacity-75 cursor-not-allowed flex items-center justify-center" : "text-white"}
            >
              {createCategoryMutation.isPending ? (
                <>
                  <LoadingIcon
                    width={16}
                    height={16}
                    className="animate-spin -ml-1 mr-3 !text-white !opacity-100 dark:!invert-0"
                  />
                  {messages["creating"] || "Creating..."}
                </>
              ) : (
                messages["create"] || "Create"
              )}
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default AddCategoryComponent;
