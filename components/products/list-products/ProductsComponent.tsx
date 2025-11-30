"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { useProductsByCategoryId, useCategoryById, useAllCategories } from "@/hooks/useCategory";
import { Product } from "@/types/Product";

interface Props {
  categoryId?: number;
  categoryName?: string;
  onViewProducts?: () => void;
}

const ProductsComponent: React.FC<Props> = ({ categoryId, categoryName: initialCategoryName, onViewProducts }) => {
  const router = useRouter();
  const { messages, locale } = useLocale();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const canAddProduct = useHasPermission(PERMISSIONS.ADD_PRODUCT);
  const canEditProduct = useHasPermission(PERMISSIONS.EDIT_PRODUCT);
  const canDeleteProduct = useHasPermission(PERMISSIONS.DELETE_PRODUCT);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const { data: categoriesResponse } = useAllCategories(locale);
  const categories = categoriesResponse?.data || [];

  const { data: categoryResponse } = useCategoryById(categoryId || 0, locale);
  const category = categoryResponse?.data;
  const categoryName = category?.translated?.name || initialCategoryName;

  const { data: productsResponse, isLoading, error, refetch } = categoryId
    ? useProductsByCategoryId(categoryId, locale)
    : useAllProducts(locale);

  const products = productsResponse?.data || [];

  const getCategoryName = (id: number | null) => {
    if (!id) return "-";
    const cat = categories.find((c) => c.id === id);
    return cat?.translated?.name || cat?.name || `Category ${id}`;
  };

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

  const handleDeleteSuccess = async () => {
    setDeleteModalOpen(false);
    await refetch();
  };

  const handleViewImages = (product: Product) => {
    router.push(`/products/${product.id}/images?name=${encodeURIComponent(product.translated.name)}`);
  };

  if (isLoading) return <p className="text-center py-8">{messages["loading"] || "Loading..."}</p>;
  if (error) return <p className="text-center py-8 text-red-600">{messages["error"] || "Error loading data"}</p>;

  return (
    <>
      <div className="mb-5 flex items-center justify-between lg:mb-7">
        <TitleComponent
          title={
            categoryId
              ? `${messages["products_list"] || "Products List"} - ${categoryName}`
              : messages["products_list"] || "Products List"
          }
        />
        {canAddProduct && (
          <Link
            href={
              categoryId
                ? `/products/add-product?categoryId=${categoryId}`
                : "/products/add-product"
            }
          >
            <Button className="h-9 px-4 text-sm">{messages["create"] || "Create"}</Button>
          </Link>
        )}
        {onViewProducts && (
          <Button onClick={onViewProducts} className="h-9 px-4 text-sm ml-2">
            {messages["categoy_view_products"] || "View Products"}
          </Button>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[900px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <Th>{messages["product_main_image"] || "Main Image"}</Th>
                  {!categoryId && <Th>{messages["product_category_name"] || "Category"}</Th>}
                  <Th>{messages["product_name"] || "Name"}</Th>
                  <Th>{messages["slug"] || "Slug"}</Th>
                  <Th>{messages["product_description"] || "Description"}</Th>
                  <Th>{messages["product_stock_quantity"] || "Stock Quantity"}</Th>
                  <Th>{messages["product_priority"] || "Priority"}</Th>
                  <Th>{messages["product_is_active"] || "Status"}</Th>
                  <Th>{messages["product_is_featured"] || "Featured"}</Th>
                  <Th>{messages["product_images"] || "Product Images"}</Th>
                  <Th>{messages["actions"] || "Actions"}</Th>
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
                              onClick={() => imageUrl && handleViewImages(product)}
                            />
                            {!imageUrl && (
                              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-40 text-center bg-white text-red-600 text-xs font-semibold leading-tight rounded p-1">
                                {messages["no_image"] || "No Image"}
                              </div>
                            )}
                          </div>
                        </Td>
                        {!categoryId && (
                          <Td className="px-6 py-4 text-gray-800 dark:text-white">
                            {getCategoryName(product.categoryId)}
                          </Td>
                        )}
                        <Td className="px-6 py-4 text-gray-800 dark:text-white">{product.translated.name}</Td>
                        <Td className="px-6 py-4 text-gray-800 dark:text-white">{product.translated.slug}</Td>
                        <Td className="px-6 py-4 text-gray-800 dark:text-white">{product.translated.description}</Td>
                        <Td className="px-6 py-4 text-gray-800 dark:text-white">{product.stockQuantity}</Td>
                        <Td className="px-6 py-4 text-gray-800 dark:text-white">{product.priority}</Td>
                        <Td
                          className={`px-6 py-4 font-medium ${product.isActive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                            }`}
                        >
                          {product.isActive ? messages["active"] || "Active" : messages["inactive"] || "Inactive"}
                        </Td>
                        <Td
                          className={`px-6 py-4 font-medium ${product.isFeatured ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                            }`}
                        >
                          {product.isFeatured ? messages["yes"] || "Yes" : messages["no"] || "No"}
                        </Td>
                        <Td className="px-6 py-4 text-gray-800 dark:text-white">
                          <button
                            onClick={() => handleViewImages(product)}
                            className="px-3 py-1 text-sm font-medium text-white bg-brand-500 hover:bg-brand-600 rounded-lg transition"
                          >
                            {messages["view_images"] || "View Images"}
                          </button>
                        </Td>
                        <Td className="px-6 py-4 text-gray-800 dark:text-white">
                          <div className="-mx-[5px] flex items-center gap-2">
                            {canEditProduct && (
                              <Button size="icon" variant="ghost" onClick={() => handleEdit(product)}>
                                <PencilIcon width={20} height={20} />
                              </Button>
                            )}
                            {canDeleteProduct && (
                              <Button size="icon" variant="ghost" onClick={() => handleDelete(product)}>
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
                    <td colSpan={categoryId ? 10 : 11} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                      {messages["no_data_found"] || "No data found!"}
                    </td>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {selectedProduct && (
        <EditProductModal
          product={selectedProduct}
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSuccess={() => refetch()}
        />
      )}
      {selectedProduct && (
        <DeleteProductModal
          product={selectedProduct}
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onSuccess={() => refetch()}
        />
      )}
    </>
  );
};

export default ProductsComponent;
