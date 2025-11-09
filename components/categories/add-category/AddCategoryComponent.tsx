"use client";

import React, { useState } from "react";
import Label from "@/components/form/Label";
import InputField from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";

const AddCategoryComponent: React.FC = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    alt_text: "",
  });

  const [fileName, setFileName] = useState("No file chosen");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(e.target.files?.[0]?.name || "No file chosen");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    setSuccess(false);

    // Simulate API call
    setTimeout(() => {
      if (form.name.trim() === "" || fileName === "No file chosen") {
        setError(true);
        setLoading(false);
      } else {
        setSuccess(true);
        setForm({ name: "", description: "", alt_text: "" });
        setFileName("No file chosen");
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
        Add New Category
      </h3>

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

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="name" className="text-md text-gray-800 dark:text-white/90">
              Category Name <span className="text-error-500">*</span>
            </Label>
            <InputField
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter category name"
              className="placeholder:text-gray-800 dark:placeholder:text-white/90"
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-md text-gray-800 dark:text-white/90">
              Description
            </Label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={form.description}
              onChange={handleChange}
              placeholder="Enter description"
              className="w-full rounded-xl border border-gray-300 dark:border-gray-600 p-3 text-gray-900 dark:text-white/90 placeholder:text-gray-800 dark:placeholder:text-white/90 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <Label htmlFor="file" className="text-md text-gray-800 dark:text-white/90">
                Category Image <span className="text-error-500">*</span>
              </Label>
              <label
                htmlFor="file"
                className="block w-full border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center cursor-pointer hover:border-brand-500 transition"
                aria-describedby="fileHelp"
              >
                <input
                  id="file"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <span className="text-gray-400 dark:text-gray-300">Click to select an image</span>
                <br />
                <span className="text-gray-800 dark:text-white">{fileName}</span>
              </label>
              <span id="fileHelp" className="sr-only">
                Upload category image
              </span>
            </div>

            <div>
              <Label htmlFor="alt_text" className="text-md text-gray-800 dark:text-white/90">
                Alt Text
              </Label>
              <InputField
                id="alt_text"
                name="alt_text"
                value={form.alt_text}
                onChange={handleChange}
                placeholder="Enter alt text"
                className="placeholder:text-gray-800 dark:placeholder:text-white/90"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={loading}
              className={loading ? "opacity-50 cursor-not-allowed" : ""}
            >
              {loading ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddCategoryComponent;
