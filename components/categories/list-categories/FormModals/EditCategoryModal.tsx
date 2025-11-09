"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import InputField from "@/components/form/input/InputField";
import { Modal } from "@/components/ui/modal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  category?: {
    name: string;
    description: string;
    alt_text?: string;
    image_url?: string;
  };
}

const EditCategoryModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, category }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    file: null as File | null,
    alt_text: "",
  });

  useEffect(() => {
    if (category) {
      setForm({
        name: category.name || "",
        description: category.description || "",
        alt_text: category.alt_text || "",
        file: null,
      });
    }
  }, [category]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setForm(prev => ({ ...prev, file: e.target.files![0] }));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Perform API call or state update here
    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] p-8 lg:p-10">
      <form onSubmit={handleSubmit}>
        <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90 text-center">
          Edit Product Category
        </h4>

        <div className="flex flex-col gap-4">
          {/* Name */}
          <div>
            <Label htmlFor="name" className="text-md text-gray-800 dark:text-white/90">
              Name
            </Label>
            <InputField
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter category name"
              className="placeholder:text-gray-800 dark:placeholder:text-white/90"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-md text-gray-800 dark:text-white/90">
              Description
            </Label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter category description"
              rows={5}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-600 p-3
                text-gray-900 dark:text-white/90 placeholder:text-gray-800 dark:placeholder:text-white/90
                focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
            />
          </div>

          {/* Image Upload */}
          <div>
            <Label className="text-md text-gray-800 dark:text-white/90">
              Category Image
            </Label>
            <label className="block w-full border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center cursor-pointer hover:border-brand-500 transition text-gray-400 dark:text-gray-300">
              Select Image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
            <div className="flex items-center gap-3 p-3 rounded-lg border bg-white dark:bg-gray-900 dark:border-gray-700 shadow-sm mt-3">
              {form.file ? (
                <img
                  src={URL.createObjectURL(form.file)}
                  alt="Preview"
                  className="w-12 h-12 rounded-md object-cover"
                />
              ) : category?.image_url ? (
                <img
                  src={category.image_url}
                  alt={category.name}
                  className="w-12 h-12 rounded-md object-cover"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-md" />
              )}
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                {form.file ? form.file.name : "No file chosen"}
              </span>
            </div>
          </div>

          {/* Alt Text */}
          <div>
            <Label htmlFor="alt_text" className="text-md text-gray-800 dark:text-white/90">
              Alt Text
            </Label>
            <InputField
              id="alt_text"
              name="alt_text"
              type="text"
              value={form.alt_text}
              onChange={handleChange}
              placeholder="Enter alt text for image"
              className="placeholder:text-gray-800 dark:placeholder:text-white/90"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end w-full gap-3 mt-8">
          <Button size="sm" variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button size="sm" type="submit">
            Update
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditCategoryModal;
