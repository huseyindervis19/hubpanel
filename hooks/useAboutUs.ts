"use client";

import { useQuery, useMutation, useQueryClient, UseMutationResult } from "@tanstack/react-query";
import {
  fetchAboutUs,
  createAboutUs,
  updateAboutUs,
  deleteAboutUs,
} from "@/services/aboutUsService";
import { AboutUs, CreateAboutUsData, UpdateAboutUsData } from "@/types/AboutUs";
import { ApiResponse } from "@/types/ApiResponse";

// fetch about us by language
export const useAboutUs = (language?: string) => {
  const queryClient = useQueryClient();
  const lang = language || "en";

  const { data, isLoading, error, refetch } = useQuery<ApiResponse<AboutUs>>({
    queryKey: ["about-us", lang],
    queryFn: () => fetchAboutUs(lang),
    enabled: !!lang,
  });

  const create = useMutation<AboutUs, Error, CreateAboutUsData>({
    mutationFn: (data) => createAboutUs(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["about-us"] });
    },
  });

  const update = useMutation<
    AboutUs,
    Error,
    { id: number; data: UpdateAboutUsData; lang: string }
  >({
    mutationFn: ({ id, data, lang }) => updateAboutUs(id, data, lang),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["about-us"] });
    },
  });

  const remove = useMutation<void, Error, number>({
    mutationFn: (id) => deleteAboutUs(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["about-us"] });
    },
  });

  return {
    aboutUs: data?.data,
    loading: isLoading,
    error: error as Error | null,
    refetch,
    create: create.mutate,
    update: async (id: number, data: UpdateAboutUsData, lang: string = "en") => {
      return update.mutateAsync({ id, data, lang });
    },
    remove: remove.mutate,
    creating: create.isPending,
    updating: update.isPending,
    deleting: remove.isPending,
  };
};

