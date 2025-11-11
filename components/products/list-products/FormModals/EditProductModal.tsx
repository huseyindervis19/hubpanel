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

interface Category {
  id: number;
  name: string;
}

const useCategories = () => {
  const CATEGORIES: Category[] = [
    { id: 1, name: "Electronics" },
    { id: 2, name: "Clothing" },
    { id: 3, name: "Books" },
    { id: 4, name: "Home & Kitchen" },
  ];
  return { categories: CATEGORIES, isLoading: false };
};

const useUpdateProduct = () => {
    return {
        mutateAsync: async (data: { id: number, data: any }) => {
            return new Promise((resolve) => setTimeout(resolve, 500));
        },
        isPending: false,
    };
};

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
  stock_quantity: number;
  is_active: boolean;
  is_featured: boolean;
}

const EditProductModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, product }) => {
  const [form, setForm] = useState<FormState>({
    name: "",
    description: "",
    category_id: "",
    stock_quantity: 0,
    is_active: false,
    is_featured: false,
  });
  const [message, setMessage] = useState<string | null>(null);
  
  const { categories = [], isLoading: categoriesLoading } = useCategories();
  const updateProduct = useUpdateProduct();

  const isPending = updateProduct.isPending;

  const categoryOptions = categories.map((cat) => ({
    value: cat.id.toString(),
    label: cat.name,
  }));

  useEffect(() => {
    if (!isOpen) setMessage(null);
  }, [isOpen]);

  useEffect(() => {
    if (product && !categoriesLoading) {
      setForm({
        name: product.name || "",
        description: product.description || "",
        category_id: product.category_id ? product.category_id.toString() : "", 
        stock_quantity: product.stock_quantity || 0,
        is_active: product.is_active || false,
        is_featured: product.is_featured || false,
      });
      setMessage(null);
    }
  }, [product, categoriesLoading, isOpen]);

  const handleChange = (field: keyof FormState, value: any) => {
    setForm({ ...form, [field]: value });
  };

  const isModified = useMemo(() => {
    if (!product) return false;

    const initialCategoryId = product.category_id ? product.category_id.toString() : "";
    const categoryIdChanged = form.category_id !== initialCategoryId;

    const nameChanged = form.name.trim() !== (product.name || "");
    const descriptionChanged = form.description.trim() !== (product.description || "");
    const stockQuantityChanged = form.stock_quantity !== (product.stock_quantity || 0);
    const isActiveChanged = form.is_active !== (product.is_active || false);
    const isFeaturedChanged = form.is_featured !== (product.is_featured || false);


    return nameChanged || descriptionChanged || categoryIdChanged || stockQuantityChanged || isActiveChanged || isFeaturedChanged;
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
        setMessage("Product Name is required.");
        return;
    }
    
    if (form.category_id.trim() === "") {
      setMessage("Please select a category.");
      return;
    }

    if (form.stock_quantity < 0) {
        setMessage("Stock quantity cannot be negative.");
        return;
    }

    setMessage(null);
    
    const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        category_id: Number(form.category_id),
        stock_quantity: form.stock_quantity,
        is_active: form.is_active,
        is_featured: form.is_featured,
    };

    try {
      await updateProduct.mutateAsync({ id: product.id, data: payload });

      setMessage("Product updated successfully!");
      await new Promise((resolve) => setTimeout(resolve, 1000));

      onClose();
      onSuccess();

    } catch (err) {
      console.error(err);
      setMessage("Error updating product. Please try again.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] p-8 lg:p-10">
      <Form onSubmit={handleSubmit}>
         <TitleComponent
          title="Edit Product"
          className="mb-6 text-center"
        />

        {message && (
          <p
            className={`mb-4 text-center font-medium ${message.includes("Error") || message.includes("required") || message.includes("select") || message.includes("negative") ? "text-red-600" : "text-green-600"
              }`}
          >
            {message}
          </p>
        )}

        <div className="space-y-6">
          <div>
            <Label>Name</Label>
            <InputField
              type="text"
              name="name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Enter product name"
              required
              disabled={isPending}
            />
          </div>
          <div>
            <Label>Description</Label>
            <TextArea
              value={form.description}
              onChange={(value) => handleChange("description", value)}
              placeholder="Enter product description"
              rows={4}
              disabled={isPending}
            />
          </div>
          <div>
            <Label>Category</Label>
            <Select
              value={form.category_id}
              onChange={(value) => handleChange("category_id", value)}
              options={categoryOptions}
              placeholder={categoriesLoading ? "Loading categories..." : "Select Category"}
              disabled={categoriesLoading || isPending}
              required
            />
          </div>
          <div>
            <Label>Stock Quantity</Label>
            <InputField
              type="number"
              name="stock_quantity"
              value={form.stock_quantity.toString()}
              onChange={(e) => handleChange("stock_quantity", Number(e.target.value))}
              placeholder="Enter stock quantity"
              min="0"
              disabled={isPending}
            />
          </div>
          <div className="flex gap-6">
            <Checkbox
              label="Active Status"
              checked={form.is_active}
              onChange={(checked) => handleChange("is_active", checked)}
              disabled={isPending}
            />
            <Checkbox
              label="Featured Product"
              checked={form.is_featured}
              onChange={(checked) => handleChange("is_featured", checked)}
              disabled={isPending}
            />
          </div>
        </div>

        
        <div className="flex items-center justify-end w-full gap-3 mt-8">
          <Button size="sm" variant="outline" onClick={onClose} disabled={isPending}>
            Close
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

export default EditProductModal;