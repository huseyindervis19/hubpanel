"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import Button from "@/components/ui/button/Button";
import { PencilIcon, TrashBinIcon } from "@/icons";
import EditProductModal from "./FormModals/EditProductModal";
import DeleteProductModal from "./FormModals/DeleteProductModal";
import { useHasPermission } from "@/hooks/useAuth";
import { PERMISSIONS } from "@/types/Permissions";

const mockProducts = [
  {
    id: 1,
    name: "Smartphone",
    description: "Latest model smartphone",
    category: "Electronics",
    stock_quantity: 20,
    is_active: true,
    is_featured: true,
    image_url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 2,
    name: "T-Shirt",
    description: "Cotton casual t-shirt",
    category: "Clothing",
    stock_quantity: 50,
    is_active: true,
    is_featured: false,
    image_url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 3,
    name: "Cooking Book",
    description: "Learn new recipes",
    category: "Books",
    stock_quantity: 15,
    is_active: false,
    is_featured: false,
    image_url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80",
  },
];

const ProductsComponent: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const canAddProduct = useHasPermission(PERMISSIONS.ADD_PRODUCT);
  const canEditProduct = useHasPermission(PERMISSIONS.EDIT_PRODUCT);
  const canDeleteProduct = useHasPermission(PERMISSIONS.DELETE_PRODUCT);

  const openEditModal = (product: any) => {
    setSelectedProduct(product);
    setEditModalOpen(true);
  };

  const openDeleteModal = (product: any) => {
    setSelectedProduct(product);
    setDeleteModalOpen(true);
  };

  const closeEditModal = () => setEditModalOpen(false);
  const closeDeleteModal = () => setDeleteModalOpen(false);

  return (
    <>
      <div className="mb-5 flex items-center justify-between lg:mb-7">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Products List
        </h3>
        {canAddProduct && (
        <Link href="/products/add-product">
          <Button className="h-9 px-4 text-sm">Add Product</Button>
        </Link>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[800px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell isHeader className="px-6 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400">Main Image</TableCell>
                  <TableCell isHeader className="px-6 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400">Category</TableCell>
                  <TableCell isHeader className="px-6 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400">Name</TableCell>
                  <TableCell isHeader className="px-6 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400">Description</TableCell>
                  <TableCell isHeader className="px-6 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400">Stock</TableCell>
                  <TableCell isHeader className="px-6 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400">Status</TableCell>
                  <TableCell isHeader className="px-6 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400">Featured</TableCell>
                  <TableCell isHeader className="px-6 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400">Action</TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {mockProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="px-6 py-4">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </TableCell>
                    <TableCell className="px-6 py-4 text-gray-800 dark:text-white">{product.category}</TableCell>
                    <TableCell className="px-6 py-4 text-gray-800 dark:text-white">{product.name}</TableCell>
                    <TableCell className="px-6 py-4 text-gray-800 dark:text-white">{product.description}</TableCell>
                    <TableCell className="px-6 py-4 text-gray-800 dark:text-white">{product.stock_quantity}</TableCell>
                    <TableCell className={`px-6 py-4 font-medium ${product.is_active ? "text-green-600" : "text-red-600"}`}>
                      {product.is_active ? "Active" : "Inactive"}
                    </TableCell>
                    <TableCell className={`px-6 py-4 font-medium ${product.is_featured ? "text-green-600" : "text-red-600"}`}>
                      {product.is_featured ? "Yes" : "No"}
                    </TableCell>

                    {/* Action buttons */}
                    <TableCell className="px-6 py-4 text-gray-800 dark:text-white">
                      <div className="flex items-center gap-5">
                        {canEditProduct && (
                        <button onClick={() => openEditModal(product)}>
                          <PencilIcon />
                        </button>
                        )}
                        {canDeleteProduct && (
                        <button onClick={() => openDeleteModal(product)}>
                          <TrashBinIcon />
                        </button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Edit Product Modal */}
      <EditProductModal
        isOpen={editModalOpen}
        onClose={closeEditModal}
        onSuccess={() => { }}
        product={selectedProduct}
      />

      {/* Delete Product Modal */}
      <DeleteProductModal
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        onSuccess={() => { }}
        product={selectedProduct}
      />
    </>
  );
};

export default ProductsComponent;
