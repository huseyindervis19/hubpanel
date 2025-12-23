"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import InputField from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Label from "@/components/form/Label";
import Form from "@/components/form/Form";
import Checkbox from "@/components/form/input/Checkbox";
import Select from "@/components/form/Select";
import { LoadingIcon } from "@/icons";
import { Product } from "@/types/Product";
import TitleComponent from "@/components/ui/TitleComponent";
import { useLocale } from "@/context/LocaleContext";
import { useUpdateProduct } from "@/hooks/useProduct";
import { useCategories } from "@/hooks/useCategory";
import Message from "@/components/ui/Message";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product?: Product;
}

interface FormState {
  name: string;
  description: string;
  category_id: string;
  stockQuantity: number;
  priority: number;
  isActive: boolean;
  isFeatured: boolean;
}

const EditProductModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, product }) => {
  const { messages, locale } = useLocale();
  const [form, setForm] = useState<FormState>({
    name: "",
    description: "",
    category_id: "",
    stockQuantity: 0,
    priority: 0,
    isActive: false,
    isFeatured: false,
  });
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const { data: categoriesResponse, isLoading: categoriesLoading } = useCategories(locale);
  const categories = categoriesResponse || [];
  const updateProductMutation = useUpdateProduct();

  const isPending = updateProductMutation.isPending;

  const categoryOptions = categories.map(cat => ({
    value: cat.id.toString(),
    label: cat.translated?.name || cat.name || "",
  }));

  useEffect(() => {
    if (!isOpen) setMessage(null);
  }, [isOpen]);

  useEffect(() => {
    if (product && !categoriesLoading) {
      setForm({
        name: product.translated?.name || "",
        description: product.translated?.description || "",
        category_id: product.categoryId?.toString() ?? "",
        stockQuantity: product.stockQuantity,
        priority: product.priority,
        isActive: product.isActive,
        isFeatured: product.isFeatured,
      });
      setMessage(null);
    }
  }, [product, categoriesLoading]);

  const handleChange = (field: keyof FormState, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !product.id) return;

    setMessage(null);

    if (!form.category_id) {
      setMessage({
        text: messages["category_name_required"] || "Category is required",
        type: "error",
      });
      return;
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      stockQuantity: form.stockQuantity,
      priority: form.priority,
      isActive: form.isActive,
      isFeatured: form.isFeatured,
      categoryId: Number(form.category_id),
    };

    try {
      await updateProductMutation.mutateAsync({ id: product.id, payload, lang: locale });
      setMessage({ text: messages["updated_successfully"] || "Product updated successfully!", type: "success" });
      setTimeout(() => {
        onClose();
        onSuccess();
      }, 800);
    } catch (err: any) {
      console.error(err);
      setMessage({
        text: err?.response?.data?.message || messages["update_error"] || "An error occurred while updating.",
        type: "error"
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] p-8 lg:p-10">
      <Form onSubmit={handleSubmit}>
        <TitleComponent title={messages["edit_product"] || "Edit Product"} className="mb-6 text-center" />

        <Message message={message} />

        <div className="space-y-6 pt-2">
          <Select
            label={messages["product_category_name"] || "Category Name"}
            value={form.category_id}
            onChange={(value) => handleChange("category_id", value)}
            options={categoryOptions}
            placeholder={categoriesLoading ? (messages["loading"] || "Loading...") : (messages["product_category_name_placeholder"] || "Select Category")}
            disabled={categoriesLoading || isPending}
            required
          />
          <InputField
            label={messages["product_name"] || "Product Name"}
            type="text"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder={messages["product_name_placeholder"] || "Enter product name"}
            required
            disabled={isPending}
          />
          <Label className="text-md text-gray-800 dark:text-white/90">{messages["product_description"]|| "Product Description"}</Label>
          <TextArea
            value={form.description}
            onChange={(value) => handleChange("description", value)}
            rows={4}
            disabled={isPending}
          />
          <InputField
            label={messages["product_stock_quantity"] || "Stock Quantity"}
            type="number"
            value={form.stockQuantity.toString()}
            onChange={(e) => handleChange("stockQuantity", Number(e.target.value))}
            min={0}
            required
            disabled={isPending}
          />
          <InputField
            label={messages["product_priority"] || "Priority"}
            type="number"
            value={form.priority.toString()}
            onChange={(e) => handleChange("priority", Number(e.target.value))}
            min={0}
            required
            disabled={isPending}
          />
          <div className="flex gap-6">
            <Checkbox
              label={messages["product_is_active"] || "Active"}
              checked={form.isActive}
              onChange={(checked) => handleChange("isActive", checked)}
              disabled={isPending}
            />
            <Checkbox
              label={messages["product_is_featured"] || "Featured"}
              checked={form.isFeatured}
              onChange={(checked) => handleChange("isFeatured", checked)}
              disabled={isPending}
            />
          </div>
        </div>

        <div className="flex items-center justify-end w-full gap-3 mt-8">
          <Button size="sm" variant="outline" onClick={onClose} disabled={isPending}>{messages["cancel"] || "Cancel"}</Button>
          <Button size="sm" type="submit" disabled={isPending} className="text-white">
            {isPending ? (
              <>
                <LoadingIcon width={16} height={16} className="animate-spin -ml-1 mr-3" />
                {messages["updating"] || "Updating..."}
              </>
            ) : messages["update"] || "Update"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default EditProductModal;
