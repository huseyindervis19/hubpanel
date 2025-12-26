"use client";

import React, { useState } from "react";
import { ProductImage } from "@/types/ProductImage";
import { useLocale } from "@/context/LocaleContext";
import { PencilIcon, TrashBinIcon } from "@/icons";
import Button from "@/components/ui/button/Button";
import AddImageModal from "./AddImageModal";
import EditImageModal from "./EditImageModal";
import DeleteImageModal from "./DeleteImageModal";
import { useProductImages } from "@/hooks/useProductImages";
import { useProduct } from "@/hooks/useProduct";

interface Props {
  productId: number;
  productName: string;
}

const ProductImages: React.FC<Props> = ({
  productId,
  productName: initialProductName,
}) => {
  const { messages, locale } = useLocale();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  /* =======================
     Product (for name)
  ======================= */
  const { data: product } = useProduct(productId, locale);
  const productName = product?.translated?.name || initialProductName;

  /* =======================
     Images
  ======================= */
  const {
    data: imagesProduct = [],
    isLoading,
    error,
    refetch,
  } = useProductImages(productId);

  /* =======================
     Local UI State
  ======================= */
  const [selectedImg, setSelectedImg] = useState<ProductImage | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  /* =======================
     Handlers
  ======================= */
  const handleAdd = () => setAddModalOpen(true);

  const handleEdit = (img: ProductImage) => {
    setSelectedImg(img);
    setEditModalOpen(true);
  };

  const handleDelete = (img: ProductImage) => {
    setSelectedImg(img);
    setDeleteModalOpen(true);
  };

  const closeAddModal = () => {
    setAddModalOpen(false);
    refetch();
  };

  const closeEditModal = () => {
    setSelectedImg(null);
    setEditModalOpen(false);
    refetch();
  };

  const closeDeleteModal = () => {
    setSelectedImg(null);
    setDeleteModalOpen(false);
    refetch();
  };

  /* =======================
     States
  ======================= */
  if (isLoading) {
    return <p>{messages["loading"] || "Loading..."}</p>;
  }

  if (error) {
    return (
      <p className="text-red-600">
        {messages["error"] || "Error loading images"}
      </p>
    );
  }

  /* =======================
     Render
  ======================= */
  return (
    <>
      {/* Header */}
      <div className="mb-5 flex items-center justify-between lg:mb-7">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          {messages["product_images"] || "Product Images"}
          {productName && ` — ${productName}`}
        </h3>

        <Button
          size="sm"
          onClick={handleAdd}
          className="bg-primary hover:bg-primary/90 text-white"
        >
          {messages["create"] || "Create"}
        </Button>
      </div>

      {/* Empty State */}
      {imagesProduct.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center border border-dashed rounded-2xl border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
          <p className="text-md text-gray-800 dark:text-white/90">
            {messages["no_data_found"] || "No data found!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {imagesProduct.map((img) => (
            <div
              key={img.id}
              className="group relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-all"
            >
              {/* Image */}
              <div className="relative w-full h-44">
                <img
                  src={`${baseUrl}${img.url}`}
                  alt="Product Image"
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />

                {/* Main badge */}
                {img.isMain && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 text-xs font-medium bg-green-500 text-white rounded-full">
                    {messages["main_image"] || "Main"}
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 p-3">
                <button
                  onClick={() => handleEdit(img)}
                  className="p-1.5 rounded-lg text-gray-800 dark:text-white"
                  title={messages["edit"] || "Edit"}
                >
                  <PencilIcon className="w-6 h-6" />
                </button>

                <button
                  onClick={() => handleDelete(img)}
                  className="p-1.5 rounded-lg text-red-500"
                  title={messages["delete"] || "Delete"}
                >
                  <TrashBinIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {addModalOpen && (
        <AddImageModal
          productId={productId}
          isOpen={addModalOpen}
          onClose={closeAddModal}
          onSuccess={refetch}
        />
      )}

      {selectedImg && (
        <EditImageModal
          img={selectedImg}
          images={imagesProduct}
          isOpen={editModalOpen}
          onClose={closeEditModal}
          onSuccess={refetch}
        />
      )}

      {selectedImg && (
        <DeleteImageModal
          img={selectedImg}
          isOpen={deleteModalOpen}
          onClose={closeDeleteModal}
          onSuccess={refetch}
        />
      )}
    </>
  );
};

export default ProductImages;
