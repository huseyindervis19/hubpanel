"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import InputField from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import FileInput from "@/components/form/input/FileInput";
import Form from "@/components/form/Form";
import { Modal } from "@/components/ui/modal";
import { LoadingIcon } from "@/icons";
import TitleComponent from "@/components/ui/TitleComponent";

interface CategoryData {
  name: string;
  description: string;
  alt_text?: string;
  image_url?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  category?: CategoryData;
}

interface FormState {
  name: string;
  description: string;
  file: File | null;
  alt_text: string;
}

const EditCategoryModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, category }) => {
  const [form, setForm] = useState<FormState>({
    name: "",
    description: "",
    file: null,
    alt_text: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const INITIAL_FILE_NAME = "No file chosen";

  useEffect(() => {
    if (category) {
      setForm({
        name: category.name || "",
        description: category.description || "",
        alt_text: category.alt_text || "",
        file: null,
      });
      setSuccess(false);
      setError(false);
    }
    setPreviewUrl(null);
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    }
  }, [category, isOpen]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleTextAreaChange = (value: string, name: keyof FormState) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (previewUrl) URL.revokeObjectURL(previewUrl);

    if (selectedFile) {
      setForm(prev => ({ ...prev, file: selectedFile }));

      const newPreviewUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(newPreviewUrl);
    } else {
      setForm(prev => ({ ...prev, file: null }));
      setPreviewUrl(null);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    setLoading(true);
    setError(false);

    if (form.name.trim() === "") {
      setError(true);
      setLoading(false);
      return;
    }

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      if (onSuccess) onSuccess();
    }, 1500);
  };

  const currentImageUrl = previewUrl || category?.image_url || null;

  const LABEL_CLASS = "text-md text-gray-800 dark:text-white/90";

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] p-8 lg:p-10">
      <Form onSubmit={handleSubmit}>
        <TitleComponent
          title="Edit Product Category"
          className="text-center mb-6"
        />

        {success && (
          <div className="mb-4 p-4 rounded-xl border border-success-200 bg-success-50 text-success-700 dark:border-success-700 dark:bg-success-900/20 transition-opacity duration-300">
            Category updated successfully!
          </div>
        )}
        {error && (
          <div className="mb-4 p-4 rounded-xl border border-error-200 bg-error-50 text-error-700 dark:border-error-700 dark:bg-error-900/20 transition-opacity duration-300">
            Please ensure all required fields are filled.
          </div>
        )}

        <div className="flex flex-col gap-4">
          {/* Name */}
          <div>
            <Label htmlFor="name" className={LABEL_CLASS}>
              Name
            </Label>
            <InputField
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter category name"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className={LABEL_CLASS}>
              Description
            </Label>
            <TextArea
              value={form.description}
              onChange={(value) => handleTextAreaChange(value, "description")}
              rows={5}
              placeholder="Enter category description"
            />
          </div>

          {/* Image Upload and Preview */}
          <div>
            <Label className={LABEL_CLASS}>
              Category Image
            </Label>
            <FileInput
              onChange={handleFileChange}
              className="w-full"
              accept="image/*"
              placeholder="Choose File"
              fileName={form.file ? form.file.name : INITIAL_FILE_NAME}
            />

            {/* Preview and File Name Display - Adjusted to work with new FileInput setup */}
            <div className="flex items-center gap-3 p-3 rounded-lg border bg-white dark:bg-gray-900 dark:border-gray-700 shadow-sm mt-3">
              {currentImageUrl ? (
                <img
                  src={currentImageUrl}
                  alt={category?.name || "Category Image"}
                  className="w-12 h-12 rounded-md object-cover"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-md flex items-center justify-center text-xs text-gray-500">
                  No Img
                </div>
              )}
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                  {form.file ? (
                    <span className="text-brand-500 dark:text-brand-400">
                      New File Selected ({form.file.name})
                    </span>
                  ) : (
                    <span className="text-gray-500 dark:text-gray-400">
                      {category?.image_url ? "Current Image Set" : "No Image Set"}
                    </span>
                  )}
                </span>
                {category?.image_url && !form.file && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {category.image_url.split('/').pop()}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Alt Text */}
          <div>
            <Label htmlFor="alt_text" className={LABEL_CLASS}>
              Alt Text
            </Label>
            <InputField
              id="alt_text"
              name="alt_text"
              type="text"
              value={form.alt_text}
              onChange={handleChange}
              placeholder="Enter alt text for image"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end w-full gap-3 mt-8">
          <Button size="sm" variant="outline" onClick={onClose} disabled={loading}>
            Close
          </Button>
          <Button
            size="sm"
            type="submit"
            disabled={loading || success}
            className={loading ? "opacity-75 cursor-not-allowed flex items-center justify-center" : ""}
          >
            {loading ? (
              <>
                <LoadingIcon
                  width={16}
                  height={16}
                  className="animate-spin -ml-1 mr-3 !text-white !opacity-100 dark:!invert-0"
                />
                Updating...
              </>
            ) : (
              "Update"
            )}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default EditCategoryModal;