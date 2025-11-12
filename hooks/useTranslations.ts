"use client";

import { useQuery, useQueryClient, useMutation, UseMutationResult } from "@tanstack/react-query";
import { getTranslations, updateTranslation } from "@/services/translationService";
import { Translation } from "@/types/Translation";
import { getTranslationsByLanguage } from "@/services/translationService";
import { TranslationResponse } from "@/types/TranslationResponse";

// fetch all translations
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

// fetch translations by language ID
export const useTranslationsByLanguage = (languageId?: number) => {
  const { data, isLoading, isError, refetch } = useQuery<TranslationResponse, Error>({
    queryKey: ["translationsByLanguage", languageId],
    queryFn: () => getTranslationsByLanguage(languageId!),
    enabled: !!languageId,
    staleTime: 1000 * 60 * 5, 
    retry: 2,
  });

  return {
    translationsByLanguage: data,
    isLoading,
    isError,
    refetch,
  };
};

// update translation
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
