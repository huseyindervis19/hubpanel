"use client";

import { useQuery, useQueryClient, useMutation, UseMutationResult } from "@tanstack/react-query";
import { getLanguages, createLanguage, updateLanguage, deleteLanguage } from "@/services/languageService";
import { Language } from "@/types/Language";

export const useLanguages = () => {
  const { data = [], isLoading, isError, refetch } = useQuery<Language[], Error>({
    queryKey: ["languages"],
    queryFn: getLanguages,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  return {
    languages: data,
    isLoading,
    isError,
    refetch,
  };
};

export const useCreateLanguage = (): UseMutationResult<Language, Error, Partial<Language>> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Language>) => createLanguage(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["languages"] }),
  });
};

export const useUpdateLanguage = (): UseMutationResult<
  Language,
  Error,
  { id: number; data: Partial<Language> }
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateLanguage(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["languages"] });
      queryClient.invalidateQueries({ queryKey: ["languages", variables.id] });
    },
  });
};

export const useDeleteLanguage = (): UseMutationResult<void, Error, number> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteLanguage(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["languages"] }),
  });
};
