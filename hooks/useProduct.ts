"use client";

import { useQuery, useMutation, useQueryClient, UseMutationResult } from "@tanstack/react-query";
import { fetchAllProducts, fetchProductById, createProduct, updateProduct, deleteProduct, UpdateProductData } from "@/services/productService";
import { Product, CreateProductData } from "@/types/Product";
import { ApiResponse } from "@/types/ApiResponse";

// fetch all products by language
export const useAllProducts = (language: string) => {
  return useQuery<ApiResponse<Product[]>>({
    queryKey: ["products", language],
    queryFn: () => fetchAllProducts(language),
    enabled: !!language,
  });
};

// fetch product by ID
export const useProductById = (id: number, language: string) => {
  return useQuery<ApiResponse<Product>>({
    queryKey: ["product", id, language],
    queryFn: () => fetchProductById(id, language),
    enabled: !!id && !!language,
  });
};

// create product
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation<Product, Error, CreateProductData>({
    mutationFn: (data) => createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

// update product
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation<Product, Error, { id: number; data: UpdateProductData; lang: string }>({
    mutationFn: ({ id, data, lang }) => updateProduct(id, data, lang),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["products-by-category"] });
    },
  });
};

// delete product
export const useDeleteProduct = (): UseMutationResult<void, Error, number> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["products-by-category"] });
    },
  });
};

