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

interface FormState {
  name: string;
  description: string;
  alt_text: string;
}

const AddCategoryComponent: React.FC = () => {
  const [form, setForm] = useState<FormState>({
    name: "",
    description: "",
    alt_text: "",
  });

  const INITIAL_FILE_NAME = "No file chosen";

  const [fileName, setFileName] = useState(INITIAL_FILE_NAME);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(e.target.files?.[0]?.name || INITIAL_FILE_NAME);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleTextAreaChange = (value: string, name: keyof FormState) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    setLoading(true);
    setError(false);
    setSuccess(false);

    if (form.name.trim() === "" || fileName === INITIAL_FILE_NAME) {
      setError(true);
      setLoading(false);
      return;
    }

    setTimeout(() => {
      setSuccess(true);
      setForm({ name: "", description: "", alt_text: "" });
      setFileName(INITIAL_FILE_NAME);
      setLoading(false);
    }, 1000);
  };
  const LABEL_CLASS = "text-md text-gray-800 dark:text-white/90";

  return (
    <>
         <TitleComponent
          title="Add New Category"
          className="mb-6 font-semibold "
        />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] lg:p-8 space-y-6">
        {success && (
          <div className="p-4 rounded-xl border border-success-200 bg-success-50 text-success-700 dark:border-success-700 dark:bg-success-900/20 transition-opacity duration-300">
            Category created successfully!
          </div>
        )}
        {error && (
          <div className="p-4 rounded-xl border border-error-200 bg-error-50 text-error-700 dark:border-error-700 dark:bg-error-900/20 transition-opacity duration-300">
            Please fill in required fields.
          </div>
        )}

        <Form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="name" className={LABEL_CLASS}>
              Category Name <span className="text-error-500">*</span>
            </Label>
            <InputField
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter category name"
            />
          </div>

          <div>
            <Label htmlFor="description" className={LABEL_CLASS}>
              Description
            </Label>
            <TextArea
              value={form.description}
              onChange={(value) => handleTextAreaChange(value, "description")}
              rows={4}
              placeholder="Enter description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <Label htmlFor="file" className={LABEL_CLASS}>
                Category Image <span className="text-error-500">*</span>
              </Label>
              <FileInput
                onChange={handleFileChange}
                className="w-full"
                accept="image/*"
                placeholder="Choose File"
                fileName={fileName}
              />
            </div>

            <div>
              <Label htmlFor="alt_text" className={LABEL_CLASS}>
                Alt Text
              </Label>
              <InputField
                id="alt_text"
                name="alt_text"
                value={form.alt_text}
                onChange={handleChange}
                placeholder="Enter alt text"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={loading || success}
              className={loading ? "opacity-75 cursor-not-allowed flex items-center justify-center" : "text-white"}
            >
              {loading ? (
                <>
                  <LoadingIcon
                    width={16}
                    height={16}
                    className="animate-spin -ml-1 mr-3 !text-white !opacity-100 dark:!invert-0"
                  />
                  Creating...
                </>
              ) : (
                "Create"
              )}
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default AddCategoryComponent;