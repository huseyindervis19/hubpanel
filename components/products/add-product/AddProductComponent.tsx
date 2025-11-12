"use client";

import React, { useState, useEffect } from "react";
import Label from "@/components/form/Label";
import InputField from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import Select from "@/components/form/Select";
import TextArea from "@/components/form/input/TextArea"; 
import Form from "@/components/form/Form";
import Checkbox from "@/components/form/input/Checkbox";
import { LoadingIcon } from "@/icons";
import TitleComponent from "@/components/ui/TitleComponent";
import { useLocale } from "@/context/LocaleContext";

interface FormState {
  name: string;
  description: string;
  stock_quantity: number;
  is_active: boolean;
  is_featured: boolean;
  category_id: string; 
}

const AddProductComponent: React.FC = () => {
  const { messages } = useLocale();
  const [form, setForm] = useState<FormState>({
    name: "",
    description: "",
    stock_quantity: 0,
    is_active: true,
    is_featured: false,
    category_id: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const categories = [
    { id: 1, name: "Electronics" },
    { id: 2, name: "Clothing" },
    { id: 3, name: "Books" },
    { id: 4, name: "Home & Kitchen" },
  ];

  const categoryOptions = categories.map((cat) => ({
    value: cat.id.toString(),
    label: cat.name,
  }));

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleTextAreaChange = (value: string, name: keyof FormState) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | string,
    name?: string
  ) => {
    if (typeof e === 'string' && name) {
        setForm((prev) => ({
            ...prev,
            [name]: name === 'stock_quantity' ? Number(e) : e,
        }));
        return;
    }

    if (typeof e !== 'string') {
        const target = e.target as (HTMLInputElement | HTMLTextAreaElement) & {
          name: string;
          value: string;
          type: string;
          checked?: boolean;
        };

        const { name: fieldName, value, type, checked } = target;

        if (type === "checkbox") {
          setForm((prev) => ({
            ...prev,
            [fieldName]: checked,
          }));
          return;
        }

        if (type === "number") {
          setForm((prev) => ({
            ...prev,
            [fieldName]: Number(value),
          }));
          return;
        }

        setForm((prev) => ({
          ...prev,
          [fieldName]: value,
        }));
    }
  };

  const handleCheckboxChange = (checked: boolean, name: keyof FormState) => {
    setForm(prev => ({ ...prev, [name]: checked }));
  }

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      stock_quantity: 0,
      is_active: true,
      is_featured: false,
      category_id: "",
    });
  }

  const handleSubmit = (e: React.FormEvent) => {
    setLoading(true);
    setError(false);
    setSuccess(false);

    if (form.name.trim() === "" || form.category_id === "" || form.stock_quantity < 0) {
      setError(true);
      setLoading(false);
      return;
    }

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      resetForm();
    }, 1500);
  };

  return (
    <>
         <TitleComponent
          title={messages["product_form_title"] || "Add New Product"}
          className="mb-6 lg:mb-8"
        />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] lg:p-8 space-y-6">

        {success && (
          <div className="p-4 rounded-xl border border-success-200 bg-success-50 text-success-700 dark:border-success-700 dark:bg-success-900/20 transition-opacity duration-300">
            {messages["product_created_successfully"] || "Product created successfully!"}
          </div>
        )}
        {error && (
          <div className="p-4 rounded-xl border border-error-200 bg-error-50 text-error-700 dark:border-error-700 dark:bg-error-900/20 transition-opacity duration-300">
            {messages["required_fields_error"] || "Please fill in all required fields correctly."}
          </div>
        )}

        <Form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Category */}
          <div>
            <Label
              className="text-md text-gray-800 dark:text-white/90"
            >
              {messages["product_category_label"]?.replace(":", "") || "Category"} <span className="text-red-600">*</span>
            </Label>
            <Select
              value={form.category_id}
              onChange={(value) => handleChange(value, "category_id")} 
              options={categoryOptions}
              placeholder={messages["select_category"] || "Select Category"}
              required
              disabled={loading}
            />
          </div>

          {/* Name */}
          <InputField
            id="name"
            name="name"
            label={messages["product_name_label"]?.replace(":", "") || "Product Name"}
            placeholder={messages["product_name_placeholder"] || "Enter product name"}
            value={form.name}
            onChange={handleChange}
            required
            disabled={loading}
          />

          {/* Description */}
          <div>
            <Label
              htmlFor="description"
              className="text-md text-gray-800 dark:text-white/90"
            >
              {messages["product_description_label"]?.replace(":", "") || "Product Description"}
            </Label>
            <TextArea
              value={form.description}
              onChange={(value) => handleTextAreaChange(value, "description")}
              rows={4}
              placeholder={messages["product_description_placeholder"] || "Enter product description"}
              disabled={loading}
            />
          </div>

          {/* Stock Quantity */}
          <InputField
            id="stock_quantity"
            name="stock_quantity"
            type="number"
            label={messages["stock_quantity_label"] || "Stock Quantity"}
            placeholder={messages["stock_quantity_placeholder"] || "Enter available stock"}
            value={form.stock_quantity.toString()} 
            onChange={handleChange}
            min={0}
            required
            disabled={loading}
          />

          {/* Checkboxes */}
          <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-4 sm:space-y-0">
            <Checkbox
              id="is_active"
              label={messages["is_active_label"] || "Active"}
              checked={form.is_active}
              onChange={(checked) => handleCheckboxChange(checked, "is_active")}
              disabled={loading}
            />

            <Checkbox
              id="is_featured"
              label={messages["is_featured_label"] || "Featured"}
              checked={form.is_featured}
              onChange={(checked) => handleCheckboxChange(checked, "is_featured")}
              disabled={loading}
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <Button
              type="submit"
              size="sm"
              disabled={loading || success}
              className={loading ? "opacity-75 cursor-not-allowed flex items-center justify-center text-white" : "text-white"}
            >
              {loading ? (
                <>
                  <LoadingIcon
                    width={16}
                    height={16}
                    className="animate-spin -ml-1 mr-3 !text-white !opacity-100 dark:!invert-0"
                  />
                  {messages["adding"] || "Creating..."}
                </>
              ) : (
                messages["add"] || "Create"
              )}
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default AddProductComponent;