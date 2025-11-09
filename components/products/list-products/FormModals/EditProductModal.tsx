"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import InputField from "@/components/form/input/InputField";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product?: {
    name: string;
    description: string;
    category: string;
    stock_quantity: number;
    is_active: boolean;
    is_featured: boolean;
    // تم حذف image_url?: string;
  };
}

const EditProductModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, product }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    stock_quantity: 0,
    is_active: false,
    is_featured: false,
  });

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        description: product.description || "",
        category: product.category || "",
        stock_quantity: product.stock_quantity || 0,
        is_active: product.is_active || false,
        is_featured: product.is_featured || false,
      });
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : (name === "stock_quantity" ? Number(value) : value),
    }));
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting product data (Image field removed):", form); 
    onSuccess(); 
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] p-8 lg:p-10">
      <form onSubmit={handleSubmit}>
        <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90 text-center">
          Edit Product
        </h4>

        <div className="space-y-6">
          {/* Name */}
          <div>
            <Label className="text-md text-gray-800 dark:text-white/90">Name</Label>
            <InputField
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter product name"
              className="placeholder:text-gray-800 dark:placeholder:text-white/90"
            />
          </div>

          {/* Description */}
          <div>
            <Label className="text-md text-gray-800 dark:text-white/90">Description</Label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter product description"
              rows={4}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-600 p-3
                text-gray-900 dark:text-white/90 placeholder:text-gray-800 dark:placeholder:text-white/90
                focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
            />
          </div>

          {/* Category */}
          <div>
            <Label className="text-md text-gray-800 dark:text-white/90">Category</Label>
            <InputField
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="Enter product category"
              className="placeholder:text-gray-800 dark:placeholder:text-white/90"
            />
          </div>

          {/* Stock Quantity */}
          <div>
            <Label className="text-md text-gray-800 dark:text-white/90">Stock Quantity</Label>
            <InputField
              type="number"
              name="stock_quantity"
              value={form.stock_quantity}
              onChange={handleChange}
              placeholder="Enter stock quantity"
              className="placeholder:text-gray-800 dark:placeholder:text-white/90"
            />
          </div>

          {/* File Upload (تم حذف هذا القسم بالكامل) */}
          {/* Active / Featured Toggles */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-gray-800 dark:text-white/90">
              <input
                type="checkbox"
                name="is_active"
                checked={form.is_active}
                onChange={handleChange}
              />
              Active
            </label>

            <label className="flex items-center gap-2 text-gray-800 dark:text-white/90">
              <input
                type="checkbox"
                name="is_featured"
                checked={form.is_featured}
                onChange={handleChange}
              />
              Featured
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end w-full gap-3 mt-8">
          <Button size="sm" variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            size="sm"
            type="submit"
            className="bg-primary-500 hover:bg-primary-600 text-white shadow-sm transition-all duration-200 rounded-md focus:ring-2 focus:ring-primary-300"
          >
            Update
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditProductModal;