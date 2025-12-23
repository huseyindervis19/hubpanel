"use client";

import React, { useState } from "react";
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
import Message from "@/components/ui/Message";

interface FormState {
  name: string;
  description: string;
  priority: number;
}

const AddCategoryComponent: React.FC = () => {
  const { messages } = useLocale();
  const router = useRouter();
  const { mutateAsync, isPending } = useCreateCategory();

  const [form, setForm] = useState<FormState>({
    name: "",
    description: "",
    priority: 0,
  });

  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("No file chosen");
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

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
      setMessage({
        text: messages["required_fields_error"] || "Please choose an image.",
        type: "error",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", form.name.trim());
      formData.append("description", form.description.trim());
      formData.append("priority", String(form.priority));
      formData.append("imageUrl", file);

      await mutateAsync(formData);

      setMessage({
        text: messages["created_successfully"] || "Created Successfully!",
        type: "success",
      });

      setTimeout(() => {
        router.push("/categories/list-categories");
      }, 600);

    } catch (error) {
      console.error(error);
      setMessage({
        text: messages["created_error"] || "An error occurred while creating.",
        type: "error",
      });
    }
  };

  return (
    <>
      <TitleComponent
        title={messages["add_new_category"] || "Add New Category"}
        className="mb-6 font-semibold"
      />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] lg:p-8 space-y-6">
        <Message message={message} />

        <Form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <InputField
            label={messages["category_name"] || "Category Name"}
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <TextArea
            label={messages["category_description"] || "Category Description"}
            value={form.description}
            onChange={handleTextAreaChange}
            rows={4}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>
                {messages["category_image"] || "Category Image"} *
              </Label>
              <FileInput
                onChange={handleFileChange}
                accept="image/*"
                fileName={fileName}
              />
            </div>

            <InputField
              label={messages["categoy_priority"] || "Priority"}
              name="priority"
              type="number"
              min={0}
              value={form.priority}
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-end mt-6">
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <LoadingIcon className="animate-spin mr-2" />
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
