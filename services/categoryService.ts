import axiosInstance from "@/lib/axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Category } from "@/types/Category";
import { Product } from "@/types/Product";

export const categoryService = {
  getAll: async (lang: string): Promise<ApiResponse<Category[]>> => {
    const { data } = await axiosInstance.get<ApiResponse<Category[]>>(
      "/categories",
      { params: { lang } }
    );
    return data;
  },

  getById: async (id: number, lang: string): Promise<ApiResponse<Category>> => {
    const { data } = await axiosInstance.get<ApiResponse<Category>>(
      `/categories/${id}`,
      { params: { lang } }
    );
    return data;
  },

  create: async (formData: FormData): Promise<Category> => {
    const { data } = await axiosInstance.post<Category>(
      "/categories",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return data;
  },

  update: async (
    id: number,
    payload: FormData | Partial<Category>,
    lang?: string
  ): Promise<Category> => {
    const isFormData = payload instanceof FormData;

    const { data } = await axiosInstance.patch<ApiResponse<Category>>(
      `/categories/${id}`,
      payload,
      {
        params: lang ? { lang } : undefined,
        headers: isFormData
          ? { "Content-Type": "multipart/form-data" }
          : undefined,
      }
    );

    return data.data;
  },

  remove: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/categories/${id}`);
  },

  getProducts: async (
    categoryId: number,
    lang: string
  ): Promise<ApiResponse<Product[]>> => {
    const { data } = await axiosInstance.get<ApiResponse<Product[]>>(
      `/categories/${categoryId}/products`,
      { params: { lang } }
    );
    return data;
  },
};
