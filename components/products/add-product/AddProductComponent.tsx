"use client";

import React, { useState } from "react";
import Label from "@/components/form/Label";
import InputField from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";

const AddProductComponent: React.FC = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    stock_quantity: 0,
    is_active: true,
    is_featured: false,
    category_id: "",
  });

  const categories = [
    { id: 1, name: "Electronics" },
    { id: 2, name: "Clothing" },
    { id: 3, name: "Books" },
    { id: 4, name: "Home & Kitchen" },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, type, value, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted product:", form);
    // Add your API submission logic here
  };

  return (
    <>
      <h3 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-8">
        Add New Product
      </h3>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] lg:p-8 space-y-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Category */}
          <div>
            <Label
              htmlFor="category_id"
              className="text-md text-gray-800 dark:text-white/90"
            >
              Category <span className="text-red-600">*</span>
            </Label>
            <select
              id="category_id"
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition"
              required
            >
              <option value="" disabled>
                Select Category
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Name */}
          <InputField
            id="name"
            name="name"
            label="Product Name"
            placeholder="Enter product name"
            value={form.name}
            onChange={handleChange}
            className="placeholder:text-gray-800 dark:placeholder:text-white/90"
            required
          />

          {/* Description */}
          <div>
            <Label
              htmlFor="description"
              className="text-md text-gray-800 dark:text-white/90"
            >
              Product Description
            </Label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={form.description}
              onChange={handleChange}
              placeholder="Enter product description"
              className="w-full rounded-xl border border-gray-300 dark:border-gray-600 p-3
               text-gray-900 dark:text-white/90 placeholder:text-gray-800 dark:placeholder:text-white/90
               focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
            />
          </div>

          {/* Stock Quantity */}
          <InputField
            id="stock_quantity"
            name="stock_quantity"
            type="number"
            label="Stock Quantity"
            placeholder="Enter available stock"
            value={form.stock_quantity}
            onChange={handleChange}
            className="placeholder:text-gray-800 dark:placeholder:text-white/90"
            min={0}
            required
          />

          {/* Checkboxes */}
          <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-4 sm:space-y-0">
            <label className="flex items-center gap-3 pb-1">
              <input
                type="checkbox"
                name="is_active"
                checked={form.is_active}
                onChange={handleChange}
                className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
              />
              <span className="text-md text-gray-800 dark:text-white/90">Active</span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="is_featured"
                checked={form.is_featured}
                onChange={handleChange}
                className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
              />
              <span className="text-md text-gray-800 dark:text-white/90">Featured</span>
            </label>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <Button type="submit" size="sm" className="text-white">
              Create Product
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddProductComponent;
