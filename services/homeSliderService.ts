import axiosInstance from "@/lib/axios";
import { ApiResponse } from "@/types/ApiResponse";
import { HomeSlider } from "@/types/HomeSlider";

// Fetch home sliders by language
export const fetchHomeSliders = async (lang: string): Promise<ApiResponse<HomeSlider[]>> => {
	const response = await axiosInstance.get<ApiResponse<HomeSlider[]>>(`/home-slider?lang=${lang}`);
	return response.data;
};

// Create a new home slider (expects FormData - multipart)
export const createHomeSlider = async (formData: FormData): Promise<HomeSlider> => {
	const response = await axiosInstance.post<ApiResponse<HomeSlider>>(`/home-slider`, formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});

	return response.data.data;
};

// Update an existing home slider (partial fields). lang param is appended as query.
export const updateHomeSlider = async (
	id: number,
	data: Partial<{ title: string; subTitle: string; ctaText: string; ctaLink: string }>,
	lang: string
): Promise<HomeSlider> => {
	const response = await axiosInstance.patch<ApiResponse<HomeSlider>>(`/home-slider/${id}?lang=${lang}`, data);
	return response.data.data;
};

// Delete a home slider by id
export const deleteHomeSlider = async (id: number): Promise<void> => {
	await axiosInstance.delete(`/home-slider/${id}`);
};
