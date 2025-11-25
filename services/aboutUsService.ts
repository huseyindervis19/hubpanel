import axiosInstance from "@/lib/axios";
import { ApiResponse } from "@/types/ApiResponse";
import { AboutUs, CreateAboutUsData, UpdateAboutUsData } from "@/types/AboutUs";

// fetch about us by language
export const fetchAboutUs = async (lang: string): Promise<ApiResponse<AboutUs>> => {
  const response = await axiosInstance.get<ApiResponse<AboutUs>>(`/about-us?lang=${lang}`);
  return response.data;
};

// create about us
export const createAboutUs = async (
  data: CreateAboutUsData
): Promise<AboutUs> => {
  const response = await axiosInstance.post<ApiResponse<AboutUs>>(
    `/about-us`,
    data
  );
  return response.data.data;
};

// update about us
export const updateAboutUs = async (
  id: number,
  data: UpdateAboutUsData,
  lang: string
): Promise<AboutUs> => {
  const response = await axiosInstance.patch<ApiResponse<AboutUs>>(
    `/about-us/${id}?lang=${lang}`,
    data
  );
  return response.data.data;
};

// delete about us
export const deleteAboutUs = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/about-us/${id}`);
};
