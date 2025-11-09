"use client";

import { useQuery, useQueryClient, useMutation, UseMutationResult } from "@tanstack/react-query";
import { getTranslations, updateTranslation } from "@/services/translationService";
import { Translation } from "@/types/Translation";

// جلب جميع الترجمات
export const useTranslations = () => {
  const { data = [], isLoading, isError, refetch } = useQuery<Translation[], Error>({
    queryKey: ["translations"],
    queryFn: getTranslations,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  return {
    translations: data,
    isLoading,
    isError,
    refetch,
  };
};

// تحديث ترجمة واحدة
export const useUpdateTranslation = (): UseMutationResult<
  Translation,
  Error,
  { id: number; data: Partial<Translation> }
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateTranslation(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["translations"] });
      queryClient.invalidateQueries({ queryKey: ["translations", variables.id] });
    },
  });
};
