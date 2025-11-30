"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { useCreateProduct } from "@/hooks/useProduct";
import { useAllCategories } from "@/hooks/useCategory";

interface FormState {
  name: string;
  slug: string;
  description: string;
  stock_quantity: number;
  is_active: boolean;
  is_featured: boolean;
  category_id: string;
  priority: number;
}
interface AddProductComponentProps {
  preselectedCategoryId?: string;
}
const AddProductComponent: React.FC<AddProductComponentProps> = ({ preselectedCategoryId }) => {
  const router = useRouter();
  const { messages, locale } = useLocale();
  const [form, setForm] = useState<FormState>({
    name: "",
    slug: "",
    description: "",
    stock_quantity: 0,
    is_active: true,
    is_featured: false,
    category_id: preselectedCategoryId || "",
    priority: 0,
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { data: categoriesResponse, isLoading: categoriesLoading } = useAllCategories(locale);
  const categories = categoriesResponse?.data || [];
  const createProduct = useCreateProduct();

  const categoryOptions = categories.map((cat) => ({
    value: cat.id.toString(),
    label: cat.translated?.name || cat.name || "",
  }));

  useEffect(() => {
    if (preselectedCategoryId) {
      setForm(prev => ({ ...prev, category_id: preselectedCategoryId }));
    }
  }, [preselectedCategoryId]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

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
        [name]: name === 'stock_quantity' || name === 'priority' ? Number(e) : e,
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
      slug: "",
      description: "",
      stock_quantity: 0,
      is_active: true,
      is_featured: false,
      category_id: "",
      priority: 0,
    });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (form.name.trim() === "") {
      setErrorMessage(messages["name_required"] || "Name is required");
      return;
    }

    if (form.category_id === "") {
      setErrorMessage(messages["category_name_required"] || "Category is required");
      return;
    }

    if (form.stock_quantity < 0) {
      setErrorMessage(messages["stock_quantity_required"] || "Stock quantity must be 0 or greater");
      return;
    }

    try {
      await createProduct.mutateAsync({
        name: form.name.trim(),
        slug: form.slug.trim(),
        description: form.description.trim() || undefined,
        stockQuantity: form.stock_quantity,
        isActive: form.is_active,
        isFeatured: form.is_featured,
        categoryId: form.category_id ? Number(form.category_id) : undefined,
        priority: form.priority,
      });

      setSuccessMessage(messages["created_successfully"] || "Product created successfully!");
      resetForm();

      setTimeout(() => {
        router.push("/products/list-products");
      }, 1500);
    } catch (error: any) {
      console.error("Error creating product:", error);
      setErrorMessage(error?.response?.data?.message || messages["created_error"] || "An error occurred while creating.");
    }
  };

  return (
    <>
      <TitleComponent
        title={messages["add_new_product"] || "Add New Product"}
        className="mb-6 lg:mb-8"
      />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] lg:p-8 space-y-6">

        {successMessage && (
          <div className="p-4 rounded-xl border border-success-200 bg-success-50 text-success-700 dark:border-success-700 dark:bg-success-900/20 transition-opacity duration-300">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="p-4 rounded-xl border border-error-200 bg-error-50 text-error-700 dark:border-error-700 dark:bg-error-900/20 transition-opacity duration-300">
            {errorMessage}
          </div>
        )}

        <Form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <div>
            <Label className="text-md text-gray-800 dark:text-white/90">
              {messages["product_category_name"] || "Category Name"} <span className="text-red-600">*</span>
            </Label>
            <Select
              value={form.category_id}
              onChange={(value) => handleChange(value, "category_id")}
              options={categoryOptions}
              placeholder={categoriesLoading ? (messages["loading"] || "Loading...") : (messages["product_category_name_placeholder"] || "Select Category")}
              required
              disabled={categoriesLoading || createProduct.isPending}
            />
          </div>

          <InputField
            id="name"
            name="name"
            label={messages["product_name"] || "Product Name"}
            placeholder={messages["product_name_placeholder"] || "Enter product name"}
            value={form.name}
            onChange={handleChange}
            required
            disabled={createProduct.isPending}
          />

          <InputField
            id="slug"
            name="slug"
            label={messages["product_slug"] || "Slug"}
            placeholder={messages["product_slug_placeholder"] || "enter product slug"}
            value={form.slug}
            onChange={handleChange}
            required
            disabled={createProduct.isPending}
          />

          <div>
            <Label htmlFor="description" className="text-md text-gray-800 dark:text-white/90">
              {messages["product_description"] || "Product Description"}
            </Label>
            <TextArea
              value={form.description}
              onChange={(value) => handleTextAreaChange(value, "description")}
              rows={4}
              placeholder={messages["product_description_placeholder"] || "enter product description"}
              disabled={createProduct.isPending}
            />
          </div>

          <InputField
            id="stock_quantity"
            name="stock_quantity"
            type="number"
            label={messages["product_stock_quantity"] || "Stock Quantity"}
            placeholder={messages["product_stock_quantity_placeholder"] || "Enter available stock"}
            value={form.stock_quantity.toString()}
            onChange={handleChange}
            min={0}
            required
            disabled={createProduct.isPending}
          />

          <InputField
            id="priority"
            name="priority"
            type="number"
            label={messages["product_priority"] || "Priority"}
            value={form.priority}
            onChange={handleChange}
            min={0}
            required
          />

          <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-4 sm:space-y-0">
            <Checkbox
              id="is_active"
              label={messages["product_is_active"] || "Active"}
              checked={form.is_active}
              onChange={(checked) => handleCheckboxChange(checked, "is_active")}
              disabled={createProduct.isPending}
            />

            <Checkbox
              id="is_featured"
              label={messages["product_is_featured"] || "Featured"}
              checked={form.is_featured}
              onChange={(checked) => handleCheckboxChange(checked, "is_featured")}
              disabled={createProduct.isPending}
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              size="sm"
              disabled={createProduct.isPending || !!successMessage}
              className={createProduct.isPending ? "opacity-75 cursor-not-allowed flex items-center justify-center text-white" : "text-white"}
            >
              {createProduct.isPending ? (
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

export default AddProductComponent;
