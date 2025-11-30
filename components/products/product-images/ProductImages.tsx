"use client";

import React, { useState } from "react";
import { ProductImage } from "@/types/ProductImage";
import { useLocale } from "@/context/LocaleContext";
import { PencilIcon, TrashBinIcon } from "@/icons";
import Button from "@/components/ui/button/Button";
import AddImageModal from "./AddImageModal";
import EditImageModal from "./EditImageModal";
import DeleteImageModal from "./DeleteImageModal";
import { useProductImagesByProductId } from "@/hooks/useProductImages";
import { useProductById } from "@/hooks/useProduct";

interface Props {
  productId: number;
  productName: string;
}

const ProductImages: React.FC<Props> = ({ productId, productName: initialProductName }) => {
  const { messages, locale } = useLocale();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  // Hook: Fetch Product to get translated name
  const { data: productResponse } = useProductById(productId, locale);
  const product = productResponse?.data;
  const productName = product?.translated?.name || initialProductName;

  // Hook: Fetch Images
  const { data: imagesResponse, isLoading, error, refetch } = useProductImagesByProductId(productId);
  const imagesProduct = imagesResponse?.data || [];


  // Local UI States
  const [selectedImg, setSelectedImg] = useState<ProductImage | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Handlers
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

  const handleSuccess = () => {
    refetch();
  };

  // Loading / Error states
  if (isLoading)
    return <p>{messages["loading"] || "Loading..."}</p>;

  if (error)
    return <p className="text-red-600">{messages["error"] || "Error loading images"}</p>;

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">
          {messages["product_images"] || "Product Images"}
          {productName && ` — ${productName}`}
        </h3>
        <Button size="sm" onClick={handleAdd} className="bg-primary hover:bg-primary/90 text-white shadow-sm">
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
              className="group relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-all duration-300"
            >
              {/* Image */}
              <div className="relative w-full h-44">
                <img
                  src={`${baseUrl}${img.url}`}
                  alt={img.alt_text || "Product Image"}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />

                {/* Main Tag */}
                {img.isMain && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 text-xs font-medium bg-green-500 text-white rounded-full shadow-sm">
                    {messages["main_image"] || "Main"}
                  </span>
                )}
              </div>

              {/* Info + Actions */}
              <div className="flex items-center justify-between p-3">
                <p className="text-sm truncate text-gray-800 dark:text-gray-200 max-w-[65%]">
                  {img.alt_text || ""}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(img)}
                    className="p-1.5 rounded-lg text-gray-800 dark:text-white"
                    title={messages["edit"] || "Edit"}
                  >
                    <PencilIcon className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => handleDelete(img)}
                    className="p-1.5 rounded-lg dark:text-red-400 transition-colors"
                    title={messages["delete"] || "Delete"}
                  >
                    <TrashBinIcon className="w-6 h-6" />
                  </button>
                </div>
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
          onSuccess={handleSuccess}
        />
      )}

      {selectedImg && (
        <EditImageModal
          img={selectedImg}
          isOpen={editModalOpen}
          images={imagesProduct}
          onClose={closeEditModal}
          onSuccess={handleSuccess}
        />
      )}

      {selectedImg && (
        <DeleteImageModal
          img={selectedImg}
          isOpen={deleteModalOpen}
          onClose={closeDeleteModal}
          onSuccess={handleSuccess}
        />
      )}
    </>

  );
};

export default ProductImages;
