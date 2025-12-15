import axiosInstance from "@/lib/axios";
import { ApiResponse } from "@/types/ApiResponse";
import { AboutUs } from "@/types/AboutUs";


export const fetchAboutUs = async (lang: string): Promise<ApiResponse<AboutUs>> => {
  const response = await axiosInstance.get<ApiResponse<AboutUs>>(`/about-us?lang=${lang}`);
  return response.data;
};

export const updateAboutUs = async (
  id: number,
  data: FormData | Partial<AboutUs>,
  lang: string
): Promise<AboutUs> => {
  const isFormData = data instanceof FormData;

  const response = await axiosInstance.patch<ApiResponse<AboutUs>>(
    `/about-us/${id}`,
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
