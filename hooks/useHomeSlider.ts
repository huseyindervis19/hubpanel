"use client";

import { useQuery, useQueryClient, useMutation, UseMutationResult } from "@tanstack/react-query";
import { fetchHomeSliders, createHomeSlider, updateHomeSlider, deleteHomeSlider } from "@/services/homeSliderService";
import { HomeSlider } from "@/types/HomeSlider";
import { ApiResponse } from "@/types/ApiResponse";

export const useHomeSlider = (language: string) => {
  return useQuery<ApiResponse<HomeSlider[]>>({
	queryKey: ["home-slider", language],
	queryFn: () => fetchHomeSliders(language),
  });
};

export const useCreateHomeSlider = () => {
  return useMutation<HomeSlider, Error, FormData>({
	mutationFn: (formData: FormData) => createHomeSlider(formData),
  });
};

export const useUpdateHomeSlider = () => {
  const queryClient = useQueryClient();

  return useMutation({
	mutationFn: ({
	  id,
	  data,
	  lang
	}: {
	  id: number;
	  data: FormData | Partial<HomeSlider>;
	  lang: string;
	}) => updateHomeSlider(id, data, lang),

	onSuccess: (_, variables) => {
	  queryClient.invalidateQueries({ queryKey: ["home-slider"] });
	  queryClient.invalidateQueries({
		queryKey: ["home-slider", variables.id]
	  });
	}
  });
};

export const useDeleteHomeSlider = (): UseMutationResult<void, Error, number> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteHomeSlider(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["home-slider"] }),
  });
};