"use client";

import { useQuery, useMutation, useQueryClient, UseMutationResult } from "@tanstack/react-query";
import {
  getProductImagesByProductId,
  createProductImage,
  updateProductImage,
  deleteProductImage,
  CreateProductImageData,
  UpdateProductImageData,
} from "@/services/productImagesService";
import { ProductImage } from "@/types/ProductImage";
import { ApiResponse } from "@/types/ApiResponse";

// fetch product images by product ID
export const useProductImagesByProductId = (productId: number) => {
  return useQuery<ApiResponse<ProductImage[]>>({
    queryKey: ["product-images", productId],
    queryFn: () => getProductImagesByProductId(productId),
    enabled: !!productId,
  });
};

// create product image
export const useCreateProductImage = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ProductImage,
    Error,
    { data: CreateProductImageData; file: File }
  >({
    mutationFn: ({ data, file }) => createProductImage(data, file),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["product-images", variables.data.productId],
      });
    },
  });
};

// update product image
export const useUpdateProductImage = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ProductImage,
    Error,
    { id: number; data: UpdateProductImageData; productId: number }
  >({
    mutationFn: ({ id, data }) => updateProductImage(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["product-images", variables.productId],
      });
    },
  });
};

// delete product image
export const useDeleteProductImage = (): UseMutationResult<
  void,
  Error,
  { id: number; productId: number }
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }) => deleteProductImage(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["product-images", variables.productId],
      });
    },
  });
};

