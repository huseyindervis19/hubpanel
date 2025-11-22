"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHeader, TableRow, Td, Th } from "@/components/ui/table";
import Button from "@/components/ui/button/Button";
import { PencilIcon, TrashBinIcon } from "@/icons";
import EditProductModal from "./FormModals/EditProductModal";
import DeleteProductModal from "./FormModals/DeleteProductModal";
import { useHasPermission } from "@/hooks/useAuth";
import { PERMISSIONS } from "@/types/Permissions";
import TitleComponent from "@/components/ui/TitleComponent";
import { useLocale } from "@/context/LocaleContext";
import { useAllProducts } from "@/hooks/useProduct";
import { Product } from "@/types/Product";
import { useRouter } from "next/navigation";
import { useAllCategories } from "@/hooks/useCategory";

const ProductsComponent: React.FC = () => {
  const router = useRouter();
  const { messages, locale } = useLocale();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);


  const { data: productsResponse, isLoading, error, refetch } = useAllProducts(locale);
  const products = productsResponse?.data || [];

  const { data: categoriesResponse } = useAllCategories(locale);
  const categories = categoriesResponse?.data || [];

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  // Helper function to get category name
  const getCategoryName = (categoryId: number | null) => {
    if (!categoryId) return "-";
    const category = categories.find((cat) => cat.id === categoryId);
    return category?.translated?.name || category?.name || `Category ${categoryId}`;
  };

  const handleViewImages = (product: Product) => {
    router.push(`/products/${product.id}/images?name=${encodeURIComponent(product.translated.name)}`);
  };


  const canAddProduct = useHasPermission(PERMISSIONS.ADD_PRODUCT);
  const canEditProduct = useHasPermission(PERMISSIONS.EDIT_PRODUCT);
  const canDeleteProduct = useHasPermission(PERMISSIONS.DELETE_PRODUCT);

  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setEditModalOpen(true);
  };

  const openDeleteModal = (product: Product) => {
    setSelectedProduct(product);
    setDeleteModalOpen(true);
  };

  const closeEditModal = () => setEditModalOpen(false);
  const closeDeleteModal = () => setDeleteModalOpen(false);

  const handleEditSuccess = async () => {
    setEditModalOpen(false);
    await refetch();
  };

  const handleDeleteSuccess = async () => {
    setDeleteModalOpen(false);
    await refetch();
  };

  if (isLoading) return <p className="text-center py-8">{messages["loading"] || "Loading..."}</p>;
  if (error) return <p className="text-center py-8 text-red-600">{messages["error"] || "Error loading products"}</p>;

  return (
    <>
      <div className="mb-5 flex items-center justify-between lg:mb-7">
        <TitleComponent title={messages["product_list"] || "Products List"} />

        {canAddProduct && (
          <Link href="/products/add-product">
            <Button className="h-9 px-4 text-sm">{messages["create"] || "Create"}</Button>
          </Link>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[800px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <Th> {messages["product_main_image"] || "Main Image"} </Th>
                  <Th> {messages["product_category_name_in_table"] || "Category"} </Th>
                  <Th> {messages["name"] || "Name"} </Th>
                  <Th> {messages["slug"] || "Slug"} </Th>
                  <Th> {messages["description"] || "Description"}</Th>
                  <Th> {messages["stock_quantity_in_table"] || "Stock Quantity"}</Th>
                  <Th> {messages["is_active_in_table"] || "Status"}</Th>
                  <Th> {messages["is_featured"] || "Featured"}</Th>
                  <Th> {messages["product_images"] || "Product Images"}</Th>
                  <Th> {messages["action"] || "Action"}</Th>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {products.length > 0 ? (
                  products.map((product) => {
                    const imageUrl = product.mainImage || product.Images?.[0]?.url;
                    return (
                      <TableRow key={product.id}>
                        <Td className="px-6 py-4">
                          <div className="flex flex-col items-center group relative">
                            <img
                              src={imageUrl ? `${baseUrl}${imageUrl}` : "/images/no_image.png"}
                              alt={product.translated.name}
                              title={imageUrl ? product.translated.name : ""}
                              className="w-12 h-12 object-cover rounded cursor-pointer"
                              onClick={() => {
                                if (imageUrl) {
                                  handleViewImages(product);
                                }
                              }}
                            />
                            {!imageUrl && (
                              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-40 text-center bg-white text-red-600 text-xs font-semibold leading-tight rounded p-1">
                                {messages["no_image"] || "No Image"}
                              </div>
                            )}
                          </div>
                        </Td>
                        <Td className="px-6 py-4 text-gray-800 dark:text-white">
                          {getCategoryName(product.categoryId)}
                        </Td>
                        <Td className="px-6 py-4 text-gray-800 dark:text-white">
                          {product.translated.name}
                        </Td>
                        <Td className="px-6 py-4 text-gray-800 dark:text-white">
                          {product.translated.slug}
                        </Td>

                        <Td className="px-6 py-4 text-gray-800 dark:text-white">
                          {product.translated.description}
                        </Td>
                        <Td className="px-6 py-4 text-gray-800 dark:text-white">
                          {product.stockQuantity}
                        </Td>
                        <Td className={`px-6 py-4 font-medium ${product.isActive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                          {product.isActive ? (messages["active"] || "Active") : (messages["inactive"] || "Inactive")}
                        </Td>
                        <Td className={`px-6 py-4 font-medium ${product.isFeatured ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                          {product.isFeatured ? (messages["yes"] || "Yes") : (messages["no"] || "No")}
                        </Td>

                        {/* Action buttons */}
                        <Td>
                          <button
                            onClick={() => handleViewImages(product)}
                            className="px-3 py-1 text-sm font-medium text-white bg-brand-500 hover:bg-brand-600 rounded-lg transition"
                          >
                            {messages["view_images"] || "View Images"}
                          </button>
                        </Td>
                        <Td>
                          <div className="-mx-[5px] flex items-center gap-2">
                            {canEditProduct && (
                              <Button size="icon" variant="ghost" onClick={() => openEditModal(product)}>
                                <PencilIcon width={20} height={20} />
                              </Button>
                            )}
                            {canDeleteProduct && (
                              <Button size="icon" variant="ghost" onClick={() => openDeleteModal(product)}>
                                <TrashBinIcon width={20} height={20} />
                              </Button>
                            )}
                          </div>
                        </Td>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <td colSpan={8} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                      {messages["no_products"] || "No products found"}
                    </td>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Edit Product Modal */}
      {selectedProduct && (
        <EditProductModal
          isOpen={editModalOpen}
          onClose={closeEditModal}
          onSuccess={handleEditSuccess}
          product={selectedProduct}
        />
      )}

      {/* Delete Product Modal */}
      {selectedProduct && (
        <DeleteProductModal
          isOpen={deleteModalOpen}
          onClose={closeDeleteModal}
          onSuccess={handleDeleteSuccess}
          product={selectedProduct}
        />
      )}
      {/* {viewImagesProduct && (
        <div className="mt-6">
          <ProductImages
            productId={viewImagesProduct.id}
            productName={viewImagesProduct.name}
          />
        </div>
      )} */}

    </>
  );
};

export default ProductsComponent;
