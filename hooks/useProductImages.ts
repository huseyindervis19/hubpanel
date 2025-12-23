"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  productImageService,
} from "@/services/productImagesService";
import {
  CreateProductImagePayload,
  UpdateProductImagePayload,
  ProductImage,
} from "@/types/ProductImage";

/* =======================
   Fetch images
======================= */
export const useProductImages = (productId?: number) => {
  return useQuery<ProductImage[]>({
    queryKey: ["product-images", productId],
    queryFn: async () => {
      if (!productId) return [];
      const res = await productImageService.getByProductId(productId);
      return res.data;
    },
    enabled: !!productId,
  });
};

/* =======================
   Create image
======================= */
export const useCreateProductImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      payload,
      file,
    }: {
      payload: CreateProductImagePayload;
      file: File;
    }) => productImageService.create(payload, file),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["product-images", variables.payload.productId],
      });
    },
  });
};

/* =======================
   Update image
======================= */
export const useUpdateProductImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      productId,
      payload,
    }: {
      id: number;
      productId: number;
      payload: UpdateProductImagePayload;
    }) => productImageService.update(id, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["product-images", variables.productId],
      });
    },
  });
};

/* =======================
   Delete image
======================= */
export const useDeleteProductImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      productId,
    }: {
      id: number;
      productId: number;
    }) => productImageService.remove(id),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["product-images", variables.productId],
      });
    },
  });
};
