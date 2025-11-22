"use client";

import { useQuery, useQueryClient, useMutation, UseMutationResult } from "@tanstack/react-query";
import { createCategory, deleteCategory, fetchAllCategories, updateCategory} from "@/services/categoryService";
import { Category } from "@/types/Category";
import { ApiResponse } from "@/types/ApiResponse";

// fetch category by language ID
export const useAllCategories = (language: string) => {
  return useQuery<ApiResponse<Category[]>>({
    queryKey: ["categories", language],
    queryFn: () => fetchAllCategories(language),
  });
};

export const useCreateCategory = () => {
  return useMutation<Category, Error, FormData>({
    mutationFn: (formData: FormData) => createCategory(formData),
  });
};


export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
      lang
    }: {
      id: number;
      data: FormData | Partial<Category>;
      lang: string;
    }) => updateCategory(id, data, lang),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({
        queryKey: ["category", variables.id]
      });
    }
  });
};



export const useDeleteCategory = (): UseMutationResult<void, Error, number> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });
};
