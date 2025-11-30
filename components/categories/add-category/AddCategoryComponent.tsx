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
  priority: number;
}

const AddCategoryComponent: React.FC = () => {
  const { messages } = useLocale();
  const router = useRouter();
  const createCategoryMutation = useCreateCategory();

  const [form, setForm] = useState<FormState>({
    name: "",
    description: "",
    priority: 0,
  });

  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("No file chosen");
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!success) {
      setForm({ name: "", description: "", priority: 0 });
      setFile(null);
      setFileName("No file chosen");
      setMessage(null);
    }
  }, [success]);

  // Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
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
      setMessage({ text: messages["required_fields_error"] || "Please choose an image.", type: "error" });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", form.name.trim());
      formData.append("description", form.description.trim());
      formData.append("priority", String(form.priority));
      formData.append("imageUrl", file);

      await createCategoryMutation.mutateAsync(formData);

      setMessage({ text: messages["created_successfully"] || "Created Successfully!", type: "success" });
      setSuccess(true);

      setTimeout(() => {
        setMessage(null);
        router.push("/categories/list-categories");
      }, 1500);

    } catch (err) {
      console.error(err);
      setMessage({ text: messages["created_error"] || "An error occurred while creating.", type: "error" });
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
          <div className={`p-4 rounded-xl border transition-opacity duration-300 ${message.type === "success"
            ? "border-success-200 bg-success-50 text-success-700 dark:border-success-700 dark:bg-success-900/20"
            : "border-error-200 bg-error-50 text-error-700 dark:border-error-700 dark:bg-error-900/20"
            }`}>
            {message.text}
          </div>
        )}

        <Form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* NAME */}
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

          {/* DESCRIPTION */}
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

          {/* IMAGE + PRIORITY */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* IMAGE INPUT */}
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

            {/* PRIORITY INPUT */}
            <div className="space-y-1">
              <Label htmlFor="priority" className={LABEL_CLASS}>
                {messages["categoy_priority"] || "Priority"} <span className="text-error-500">*</span>
              </Label>
              <InputField
                id="priority"
                name="priority"
                type="number"
                min={0}
                value={form.priority}
                onChange={handleChange}
                
              />
            </div>

          </div>

          {/* SUBMIT BUTTON */}
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
