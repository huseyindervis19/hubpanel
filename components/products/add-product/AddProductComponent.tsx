"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Label from "@/components/form/Label";
import InputField from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Select from "@/components/form/Select";
import Checkbox from "@/components/form/input/Checkbox";
import Button from "@/components/ui/button/Button";
import Form from "@/components/form/Form";
import { LoadingIcon } from "@/icons";
import TitleComponent from "@/components/ui/TitleComponent";
import { useLocale } from "@/context/LocaleContext";
import { useCreateProduct } from "@/hooks/useProduct";
import { useAllCategories } from "@/hooks/useCategory";
import { ProductData } from "@/types/Product";

interface AddProductProps {
  preselectedCategoryId?: number;
}

const AddProductComponent: React.FC<AddProductProps> = ({ preselectedCategoryId }) => {
  const router = useRouter();
  const { messages, locale } = useLocale();

  const [form, setForm] = useState<ProductData>({
    name: "",
    slug: "",
    description: "",
    stockQuantity: 0,
    isActive: true,
    isFeatured: false,
    categoryId: preselectedCategoryId || 0,
    priority: 0,
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { data: categoriesResponse, isLoading: categoriesLoading } = useAllCategories(locale);
  const categories = categoriesResponse?.data || [];
  const createProduct = useCreateProduct();

  const categoryOptions = categories.map(cat => ({
    value: cat.id.toString(),
    label: cat.translated?.name || cat.name || "",
  }));

  // Update preselected category if it changes
  useEffect(() => {
    if (preselectedCategoryId) {
      setForm(prev => ({ ...prev, categoryId: preselectedCategoryId }));
    }
  }, [preselectedCategoryId]);

  // Clear success message after 4 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Handle field changes
  const handleChange = (value: string | boolean, field: keyof ProductData) => {
    setForm(prev => ({
      ...prev,
      [field]:
        field === "categoryId" && typeof value === "string"
          ? Number(value)
          : typeof value === "string" && (field === "stockQuantity" || field === "priority")
            ? Number(value)
            : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!form.name.trim()) {
      setErrorMessage(messages["name_required"] || "Name is required");
      return;
    }
    if (!form.categoryId) {
      setErrorMessage(messages["category_name_required"] || "Category is required");
      return;
    }
    if ((form.stockQuantity ?? 0) < 0) {
      setErrorMessage(messages["stock_quantity_required"] || "Stock must be 0 or greater");
      return;
    }
    if ((form.priority ?? 0) < 0) {
      setErrorMessage(messages["priority_required"] || "Priority must be 0 or greater");
      return;
    }

    try {
      await createProduct.mutateAsync({
        name: form.name.trim(),
        slug: form.slug?.trim() || undefined,
        description: form.description?.trim() || undefined,
        stockQuantity: form.stockQuantity,
        isActive: form.isActive,
        isFeatured: form.isFeatured,
        categoryId: Number(form.categoryId),
        priority: form.priority,
      });

      setSuccessMessage(messages["created_successfully"] || "Product created successfully!");
      setForm({
        name: "",
        slug: "",
        description: "",
        stockQuantity: 0,
        isActive: true,
        isFeatured: false,
        categoryId: preselectedCategoryId || 0,
        priority: 0,
      });

      setTimeout(() => router.push("/products/list-products"), 1500);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.response?.data?.message || messages["created_error"] || "Error creating product");
    }
  };

  return (
    <>
      <TitleComponent title={messages["add_new_product"] || "Add New Product"} className="mb-6 lg:mb-8" />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] lg:p-8 space-y-6">
        {successMessage && (
          <div className="p-4 rounded-xl border border-success-200 bg-success-50 text-success-700 dark:border-success-700 dark:bg-success-900/20">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="p-4 rounded-xl border border-error-200 bg-error-50 text-error-700 dark:border-error-700 dark:bg-error-900/20">
            {errorMessage}
          </div>
        )}

        <Form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Category */}
          <Select
            label={messages["product_category_name"] || "Category Name"}
            value={form.categoryId.toString()}
            onChange={(value) => handleChange(value, "categoryId")}
            options={categoryOptions}
            placeholder={categoriesLoading ? messages["loading"] || "Loading..." : messages["product_category_name_placeholder"] || "Select Category"}
            required
            disabled={categoriesLoading || createProduct.isPending}
          />

          {/* Name */}
          <InputField
            label={messages["product_name"] || "Product Name"}
            value={form.name}
            onChange={(e) => handleChange(e.target.value, "name")}
            placeholder={messages["product_name_placeholder"] || "Enter product name"}
            required
            disabled={createProduct.isPending}
          />

          {/* Slug */}
          <InputField
            label={messages["product_slug"] || "Slug"}
            value={form.slug || ""}
            onChange={(e) => handleChange(e.target.value, "slug")}
            placeholder={messages["product_slug_placeholder"] || "Enter product slug"}
            disabled={createProduct.isPending}
          />

          {/* Description */}
          <TextArea
            label={messages["product_description"] || "Product Description"}
            value={form.description || ""}
            onChange={(value) => handleChange(value, "description")}
            rows={4}
            placeholder={messages["product_description_placeholder"] || "Enter product description"}
            disabled={createProduct.isPending}
          />

          {/* Stock */}
          <InputField
            type="number"
            label={messages["product_stock_quantity"] || "Stock Quantity"}
            value={form.stockQuantity?.toString()}
            onChange={(e) => handleChange(e.target.value, "stockQuantity")}
            min={0}
            required
            disabled={createProduct.isPending}
          />

          {/* Priority */}
          <InputField
            type="number"
            label={messages["product_priority"] || "Priority"}
            value={form.priority?.toString()}
            onChange={(e) => handleChange(e.target.value, "priority")}
            min={0}
            required
          />

          {/* Active / Featured */}
          <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-4 sm:space-y-0">
            <Checkbox
              label={messages["product_is_active"] || "Active"}
              checked={form.isActive ?? false}
              onChange={(checked) => handleChange(checked, "isActive")}
              disabled={createProduct.isPending}
            />
            <Checkbox
              label={messages["product_is_featured"] || "Featured"}
              checked={form.isFeatured ?? false}
              onChange={(checked) => handleChange(checked, "isFeatured")}
              disabled={createProduct.isPending}
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <Button
              type="submit"
              size="sm"
              disabled={createProduct.isPending || !!successMessage}
              className="text-white"
            >
              {createProduct.isPending ? (
                <>
                  <LoadingIcon width={16} height={16} className="animate-spin -ml-1 mr-3 !text-white" />
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
