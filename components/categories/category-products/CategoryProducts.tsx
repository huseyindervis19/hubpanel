"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { useLocale } from "@/context/LocaleContext";
import { PencilIcon, TrashBinIcon } from "@/icons";
import Button from "@/components/ui/button/Button";
import DeleteProductModal from "@/components/products/list-products/FormModals/DeleteProductModal";
import EditProductModel from "@/components/products/list-products/FormModals/EditProductModal";
// import ProductImages from "@/components/products/product-images/ProductImages";
import { Product } from "@/types/Product";
import { useProductsByCategoryId, useCategoryById } from "@/hooks/useCategory";

interface Props {
  categoryId: number;
  categoryName: string;
}

const CategoryProducts: React.FC<Props> = ({ categoryId, categoryName: initialCategoryName }) => {
  const router = useRouter();
  const { messages, locale } = useLocale();

  // Hook: Fetch Category to get translated name
  const { data: categoryResponse } = useCategoryById(categoryId, locale);
  const category = categoryResponse?.data;
  const categoryName = category?.translated?.name || initialCategoryName;

  const { data: productsResponse, isLoading, error, refetch } = useProductsByCategoryId(categoryId, locale);
  const products = productsResponse?.data || [];

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewImagesProduct, setViewImagesProduct] = useState<Product | null>(null);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  
  // Modal actions
  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setEditModalOpen(true);
  };

  const handleEditSuccess = async () => {
    setEditModalOpen(false);
    await refetch();
  };

  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    setDeleteModalOpen(true);
  };

  const handleViewImages = (product: Product) => {
    router.push(`/products/${product.id}/images?name=${encodeURIComponent(product.translated.name)}`);
  };

  if (isLoading) return <p>{messages["loading"] || "Loading..."}</p>;
  if (error) return <p className="text-red-600">{messages["error"] || "Error loading products"}</p>;

  return (
    <>
      <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
        {messages["products_list"] || "Products List"}
        {categoryName && ` - ${categoryName}`}
      </h3>

      {/* Add Product Button */}
      <div className="flex justify-end mb-4">
        <Link href="/products/add-product">
          <Button size="sm">{messages["create"] || "Create"}</Button>
        </Link>
      </div>

      {/* Edit Product Modal */}
      {selectedProduct && (
        <EditProductModel
          product={selectedProduct}
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Delete Product Modal */}
      {selectedProduct && (
        <DeleteProductModal
          product={selectedProduct}
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onSuccess={() => refetch()}
        />
      )}



      {/* Products Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[800px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-6 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400"
                  >
                    {messages["product_main_image"] || "Main Image"}
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-6 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400"
                  >
                    {messages["name"] || "Name"}
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-6 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400"
                  >
                    {messages["slug_in_table"] || "Slug"}
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-6 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400"
                  >
                    {messages["description"] || "Description"}
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-6 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400"
                  >
                    {messages["stock_quantity_in_table"] || "Stock Quantity"}
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-6 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400"
                  >
                    {messages["is_active_in_table"] || "Status"}
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-6 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400"
                  >
                    {messages["is_featured"] || "Featured Product"}
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-6 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400"
                  >
                    {messages["product_images"] || "Product Images"}
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-6 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400"
                  >
                    {messages["action"] || "Action"}
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {products.length > 0 ? (
                  products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="px-6 py-4 text-gray-800 dark:text-white">
                        <div className="flex flex-col items-center group relative">
                          <img
                            src={product.Images?.[0]?.url
                              ? `${baseUrl}${product.Images[0].url}`
                              : "/images/no_image.png"} alt={product.translated.name}
                            title={product.Images?.[0]?.url ? product.translated.name : ""}
                            className="w-12 h-12 object-cover rounded cursor-pointer"
                            onClick={() => {
                              if (product.Images?.[0]?.url) {
                                handleViewImages(product);
                              }
                            }}
                          />
                          {!product.Images?.[0]?.url && (
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-40 text-center bg-white text-red-600 text-xs font-semibold leading-tight rounded p-1">
                              {messages["no_image"] || "No Image"}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-gray-800 dark:text-white">
                        {product.translated.name}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-gray-800 dark:text-white">
                        {product.translated.slug}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-gray-800 dark:text-white">
                        {product.translated.description}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-gray-800 dark:text-white">
                        {product.stockQuantity}
                      </TableCell>
                      <TableCell
                        className={`px-6 py-4 font-medium ${product.isActive
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                          }`}
                      >
                        {product.isActive
                          ? messages["active"] || "Active"
                          : messages["inactive"] || "Inactive"}
                      </TableCell>
                      <TableCell
                        className={`px-6 py-4 font-medium ${product.isFeatured
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                          }`}
                      >
                        {product.isFeatured
                          ? messages["active"] || "Active"
                          : messages["inactive"] || "Inactive"}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-gray-800 dark:text-white">
                        <button
                          onClick={() => handleViewImages(product)}
                          className="px-3 py-1 text-sm font-medium text-white bg-brand-500 hover:bg-brand-600 rounded-lg transition"
                        >
                          {messages["view_images"] || "View Images"}
                        </button>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-gray-800 dark:text-white">
                        <div className="flex items-center gap-5">
                          <button
                            onClick={() => handleEdit(product)}
                          >
                            <PencilIcon />
                          </button>

                          <button
                            onClick={() => handleDelete(product)}
                          >
                            <TrashBinIcon />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <td colSpan={9} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                      {messages["no_products"] || "No products found"}
                    </td>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryProducts;
