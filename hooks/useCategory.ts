"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "@/services/categoryService";
import { Category } from "@/types/Category";

export const useCategories = (lang: string) => {
  return useQuery({
    queryKey: ["categories", lang],
    queryFn: async () => {
      const res = await categoryService.getAll(lang);
      return res.data;
    },
    enabled: !!lang,
  });
};

export const useCategory = (id?: number, lang?: string) => {
  return useQuery({
    queryKey: ["category", id, lang],
    queryFn: async () => {
      if (!id || !lang) return null;
      const res = await categoryService.getById(id, lang);
      return res.data;
    },
    enabled: !!id && !!lang,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
      lang,
    }: {
      id: number;
      payload: FormData | Partial<Category>;
      lang?: string;
    }) => categoryService.update(id, payload, lang),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({
        queryKey: ["category", variables.id],
      });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export const useProductsByCategory = (categoryId?: number, lang?: string) => {
  return useQuery({
    queryKey: ["products-by-category", categoryId, lang],
    queryFn: async () => {
      if (!categoryId || !lang) return [];
      const res = await categoryService.getProducts(categoryId, lang);
      return res.data;
    },
    enabled: !!categoryId && !!lang,
  });
};
