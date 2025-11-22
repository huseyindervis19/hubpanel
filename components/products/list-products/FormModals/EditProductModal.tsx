"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import InputField from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Form from "@/components/form/Form";
import Checkbox from "@/components/form/input/Checkbox";
import Select from "@/components/form/Select";
import { LoadingIcon } from "@/icons";
import { Product } from "@/types/Product";
import TitleComponent from "@/components/ui/TitleComponent";
import { useLocale } from "@/context/LocaleContext";
import { useUpdateProduct } from "@/hooks/useProduct";
import { useAllCategories } from "@/hooks/useCategory";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product?: Product;
}

interface FormState {
  name: string;
  slug: string;
  description: string;
  category_id: string;
  stock_quantity: number;
  is_active: boolean;
  is_featured: boolean;
}

const EditProductModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, product }) => {
  const { messages, locale } = useLocale();
  const [form, setForm] = useState<FormState>({
    name: "",
    slug: "",
    description: "",
    category_id: "",
    stock_quantity: 0,
    is_active: false,
    is_featured: false,
  });
  const [message, setMessage] = useState<string | null>(null);

  const { data: categoriesResponse, isLoading: categoriesLoading } = useAllCategories(locale);
  const categories = categoriesResponse?.data || [];
  const updateProductMutation = useUpdateProduct();

  const isPending = updateProductMutation.isPending;

  const categoryOptions = categories.map((cat) => ({
    value: cat.id.toString(),
    label: cat.translated?.name || cat.name || "",
  }));

  useEffect(() => {
    if (!isOpen) setMessage(null);
  }, [isOpen]);

  useEffect(() => {
    if (product && !categoriesLoading) {
      // Support both new Product type and legacy format
      const productName = 'translated' in product ? product.translated?.name : (product as any).name || "";
      const productDescription = 'translated' in product ? product.translated?.description : (product as any).description || "";
      const productSlug = 'translated' in product ? product.translated?.slug : (product as any).slug || "";
      const productCategoryId = 'categoryId' in product ? product.categoryId : (product as any).category_id;
      const productStockQuantity = 'stockQuantity' in product ? product.stockQuantity : (product as any).stock_quantity || 0;
      const productIsActive = 'isActive' in product ? product.isActive : (product as any).is_active || false;
      const productIsFeatured = 'isFeatured' in product ? product.isFeatured : (product as any).is_featured || false;

      setForm({
        name: productName,
          slug: productSlug,
        description: productDescription,
        category_id: productCategoryId ? productCategoryId.toString() : "",
        stock_quantity: productStockQuantity,
        is_active: productIsActive,
        is_featured: productIsFeatured,
      });
      setMessage(null);
    }
  }, [product, categoriesLoading, isOpen]);

  const handleChange = (field: keyof FormState, value: any) => {
    setForm({ ...form, [field]: value });
  };

  const isModified = useMemo(() => {
    if (!product) return false;

    // Support both new Product type and legacy format
    const productName = 'translated' in product ? product.translated?.name : (product as any).name || "";
    const productDescription = 'translated' in product ? product.translated?.description : (product as any).description || "";
    const productSlug = 'translated' in product ? product.translated?.slug : (product as any).slug || "";
    const productCategoryId = 'categoryId' in product ? product.categoryId : (product as any).category_id;
    const productStockQuantity = 'stockQuantity' in product ? product.stockQuantity : (product as any).stock_quantity || 0;
    const productIsActive = 'isActive' in product ? product.isActive : (product as any).is_active || false;
    const productIsFeatured = 'isFeatured' in product ? product.isFeatured : (product as any).is_featured || false;

    const initialCategoryId = productCategoryId ? productCategoryId.toString() : "";
    const categoryIdChanged = form.category_id !== initialCategoryId;

    const nameChanged = form.name.trim() !== productName;
    const slugChanged = form.slug.trim() !== productSlug;
    const descriptionChanged = form.description.trim() !== productDescription;
    const stockQuantityChanged = form.stock_quantity !== productStockQuantity;
    const isActiveChanged = form.is_active !== productIsActive;
    const isFeaturedChanged = form.is_featured !== productIsFeatured;

    return nameChanged || slugChanged || descriptionChanged || categoryIdChanged || stockQuantityChanged || isActiveChanged || isFeaturedChanged;
  }, [form, product]);

  const isFormInvalid = useMemo(() => {
    return (
      form.name.trim() === "" ||
      form.category_id.trim() === "" ||
      form.stock_quantity < 0
    );
  }, [form]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !product.id) return;

    if (form.name.trim() === "") {
      setMessage(messages["name_required"] || "name required.");
      return;
    }

    if (form.category_id.trim() === "") {
      setMessage(messages["category_name_required"] || "Category name required.");
      return;
    }

    if (form.stock_quantity < 0) {
      setMessage(messages["stock_quantity_required"] || "stock quantity required");
      return;
    }

    setMessage(null);

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim() || undefined,
      description: form.description.trim() || undefined,
      stockQuantity: form.stock_quantity,
      isActive: form.is_active,
      isFeatured: form.is_featured,
      categoryId: form.category_id ? Number(form.category_id) : undefined,
    };

    try {
      await updateProductMutation.mutateAsync({ 
        id: product.id, 
        data: payload,
        lang: locale,
      });

      setMessage(messages["updated_successfully"] || "Product updated successfully!");
      await new Promise((resolve) => setTimeout(resolve, 1000));

      onClose();
      onSuccess();

    } catch (err: any) {
      console.error(err);
      setMessage(err?.response?.data?.message || messages["update_failed"] || "An error occurred while updating.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] p-8 lg:p-10">
      <Form onSubmit={handleSubmit}>
        <TitleComponent
          title={messages["edit_product"] || "Edit Product"}
          className="mb-6 text-center"
        />

        {message && (
          <p
            className={`mb-4 text-center font-medium ${message.includes("Error") ? "text-red-600" : "text-green-600"
              }`}
          >
            {message}
          </p>
        )}

        <div className="space-y-6">
          <div>
            <Label>{messages["product_name"] || "Product Name"}</Label>
            <InputField
              type="text"
              name="name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder={messages["product_name_placeholder"] || "Enter product name"}
              required
              disabled={isPending}
            />
          </div>
          <div>
            <Label>{messages["product_slug"] || "Slug"}</Label>
            <InputField
              type="text"
              name="slug"
              value={form.slug}
              onChange={(e) => handleChange("slug", e.target.value)}
              placeholder={messages["product_slug_placeholder"] || "Enter slug (optional)"}
              disabled={isPending}
            />
          </div>
          <div>
            <Label>{messages["product_description"] || "Product Description"}</Label>
            <TextArea
              value={form.description}
              onChange={(value) => handleChange("description", value)}
              placeholder={messages["product_description_placeholder"] || "Enter product description"}
              rows={4}
              disabled={isPending}
            />
          </div>
          <div>
            <Label>{messages["product_category_name"] || "Category Name"}</Label>
            <Select
              value={form.category_id}
              onChange={(value) => handleChange("category_id", value)}
              options={categoryOptions}
              placeholder={categoriesLoading ? (messages["loading"] || "Loading...") : (messages["product_category_name_placeholder"] || "Select Category")}
              disabled={categoriesLoading || isPending}
              required
            />
          </div>
          <div>
            <Label>{messages["product_stock_quantity"] || "Stock Quantity"}</Label>
            <InputField
              type="number"
              name="stock_quantity"
              value={form.stock_quantity.toString()}
              onChange={(e) => handleChange("stock_quantity", Number(e.target.value))}
              placeholder={messages["product_stock_quantity_placeholder"] || "Enter available stock"}
              min="0"
              disabled={isPending}
            />
          </div>
          <div className="flex gap-6">
            <Checkbox
              label={messages["is_active"] || "Active"}
              checked={form.is_active}
              onChange={(checked) => handleChange("is_active", checked)}
              disabled={isPending}
            />
            <Checkbox
              label={messages["is_featured"] || "Featured"}
              checked={form.is_featured}
              onChange={(checked) => handleChange("is_featured", checked)}
              disabled={isPending}
            />
          </div>
        </div>


        <div className="flex items-center justify-end w-full gap-3 mt-8">
          <Button size="sm" variant="outline" onClick={onClose} disabled={isPending}>
            {messages["close"] || "Close"}
          </Button>
          <Button
            size="sm"
            type="submit"
            disabled={isPending || !isModified || isFormInvalid}
            className={isPending ? "opacity-75 cursor-not-allowed flex items-center justify-center text-white" : "text-white"}
          >
            {isPending ? (
              <>
                <LoadingIcon
                  width={16}
                  height={16}
                  className="animate-spin -ml-1 mr-3 !text-white !opacity-100 dark:!invert-0"
                />
                {messages["updating"] || "Updating..."}
              </>
            ) : (
              messages["update"] || "Update"
            )}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default EditProductModal;