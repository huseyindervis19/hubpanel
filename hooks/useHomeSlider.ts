"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchHomeSliders, createHomeSlider, updateHomeSlider, deleteHomeSlider } from "@/services/homeSliderService";
import { HomeSlider } from "@/types/HomeSlider";
import { ApiResponse } from "@/types/ApiResponse";

export const useHomeSlider = (language: string) => {
	const queryClient = useQueryClient();
	const lang = language || "en";

	const query = useQuery<ApiResponse<HomeSlider[]>>({
		queryKey: ["home-slider", lang],
		queryFn: () => fetchHomeSliders(lang),
	});

	const create = useMutation<HomeSlider, Error, FormData>({
		mutationFn: (data) => createHomeSlider(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["home-slider"] });
			queryClient.invalidateQueries({ queryKey: ["home-slider", lang] });
		},
	});

	const update = useMutation<HomeSlider, Error, { id: number; data: Partial<{ title: string; subTitle: string; ctaText: string }>; lang: string }>(
		{
			mutationFn: ({ id, data, lang }) => updateHomeSlider(id, data, lang),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ["home-slider"] });
				queryClient.invalidateQueries({ queryKey: ["home-slider", lang] });
			},
		}
	);

	const remove = useMutation<void, Error, number>({
		mutationFn: (id) => deleteHomeSlider(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["home-slider"] });
			queryClient.invalidateQueries({ queryKey: ["home-slider", lang] });
		},
	});

	return {
		homeSlider: query.data?.data ?? [],
		loading: query.isLoading,
		error: query.error,
		refetch: query.refetch,
		create: create.mutateAsync,
		creating: create.isPending,
		update: update.mutateAsync,
		updating: update.isPending,
		remove: remove.mutateAsync,
		removing: remove.isPending,
	};
};
