"use client";

import { useQuery, useMutation, useQueryClient, UseMutationResult } from "@tanstack/react-query";
import { fetchAboutUs, updateAboutUs } from "@/services/aboutUsService";
import { AboutUs } from "@/types/AboutUs";
import { ApiResponse } from "@/types/ApiResponse";

// ----------------------------
// Hook: fetch About Us
// ----------------------------
export const useAboutUs = (language: string) => {
  return useQuery<ApiResponse<AboutUs>, Error>({
    queryKey: ["about-us", language],
    queryFn: () => fetchAboutUs(language),
  });
};

// ----------------------------
// Hook: update About Us
// ----------------------------

export const useUpdateAboutUs = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data, lang }: {
      id: number;
      data: FormData | Partial<AboutUs>;
      lang: string;
    }) => updateAboutUs(id, data, lang),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["about-us"] });
      queryClient.invalidateQueries({ queryKey: ["about-us", variables.id] });
    },
  });
};
