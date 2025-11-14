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

const mockProducts = [
  {
    id: 1,
    name: "Smartphone",
    description: "Latest model smartphone",
    category_id: 1,
    category: { id: 1, name: "Electronics" },
    stock_quantity: 20,
    is_active: true,
    is_featured: true,
    image_url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 2,
    name: "T-Shirt",
    description: "Cotton casual t-shirt",
    category_id: 2,
    category: { id: 2, name: "Clothing" },
    stock_quantity: 50,
    is_active: true,
    is_featured: false,
    image_url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 3,
    name: "Cooking Book",
    description: "Learn new recipes",
    category_id: 3,
    category: { id: 3, name: "Books" },
    stock_quantity: 15,
    is_active: false,
    is_featured: false,
    image_url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80",
  },
];

const ProductsComponent: React.FC = () => {
  const { messages } = useLocale();
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
                  <Th> {messages["description"] || "Description"}</Th>
                  <Th> {messages["stock_quantity_in_table"] || "Stock Quantity"}</Th>
                  <Th> {messages["is_active_in_table"] || "Status"}</Th>
                  <Th> {messages["is_featured"] || "Featured"}</Th>
                  <Th> {messages["action"] || "Action"}</Th>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {mockProducts.map((product) => (
                  <TableRow key={product.id}>
                    <Td className="px-6 py-4">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </Td>
                    <Td>{product.category?.name || "-"}</Td>
                    <Td>{product.name}</Td>
                    <Td>{product.description}</Td>
                    <Td>{product.stock_quantity}</Td>
                    <Td className={`px-6 py-4 font-medium ${product.is_active ? "text-green-600" : "text-red-600"}`}>
                      {product.is_active ? (messages["active"] || "Active") : (messages["inactive"] || "Inactive")}
                    </Td>
                    <Td className={`px-6 py-4 font-medium ${product.is_featured ? "text-green-600" : "text-red-600"}`}>
                      {product.is_featured ? (messages["yes"] || "Yes") : (messages["no"] || "No")}
                    </Td>

                    {/* Action buttons */}
                    <Td>
                      <div className="-mx-[5px] flex items-center">
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
