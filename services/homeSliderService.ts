import axiosInstance from "@/lib/axios";
import { ApiResponse } from "@/types/ApiResponse";
import { HomeSlider } from "@/types/HomeSlider";

export const fetchHomeSliders = async (lang: string): Promise<ApiResponse<HomeSlider[]>> => {
	const response = await axiosInstance.get<ApiResponse<HomeSlider[]>>(`/home-slider?lang=${lang}`);
	return response.data;
};

export const createHomeSlider = async (formData: FormData): Promise<HomeSlider> => {
	const response = await axiosInstance.post<HomeSlider>("/home-slider", formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
	return response.data;
};

export const updateHomeSlider = async (
	id: number,
	data: FormData | Partial<HomeSlider>,
	lang: string
): Promise<HomeSlider> => {
	const isFormData = data instanceof FormData;

	const response = await axiosInstance.patch<ApiResponse<HomeSlider>>(
		`/home-slider/${id}`,
		data,
		{
			params: { lang },
			headers: isFormData ? {
				"Content-Type": "multipart/form-data",
			} : undefined
		}
	);
	return response.data.data;
};

export const deleteHomeSlider = async (id: number): Promise<void> => {
	await axiosInstance.delete(`/home-slider/${id}`);
};