"use client";

import { useQuery, useMutation, useQueryClient, UseMutationResult } from "@tanstack/react-query";
import { productService } from "@/services/productService";
import { Product } from "@/types/Product";
import { CreateProductPayload, UpdateProductPayload } from "@/types/ProductPayload";

export const useProducts = (lang: string) => {
  return useQuery({
    queryKey: ["products", lang],
    queryFn: async () => {
      const res = await productService.getAll(lang);
      return res.data;
    },
    enabled: !!lang,
  });
};

export const useProduct = (id?: number, lang?: string) => {
  return useQuery({
    queryKey: ["product", id, lang],
    queryFn: async () => {
      if (!id || !lang) return null;
      const res = await productService.getById(id, lang);
      return res.data;
    },
    enabled: !!id && !!lang,
  });
};

export const useCreateProduct = (): UseMutationResult<Product, unknown, CreateProductPayload, unknown> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useUpdateProduct = (): UseMutationResult<
  Product,
  unknown,
  { id: number; payload: UpdateProductPayload; lang: string },
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload, lang }) => productService.update(id, payload, lang),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["products-by-category"] });
    },
  });
};

export const useDeleteProduct = (): UseMutationResult<void, unknown, number, unknown> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["products-by-category"] });
    },
  });
};
