import axiosInstance from "@/lib/axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Product } from "@/types/Product";
import { CreateProductPayload, UpdateProductPayload } from "@/types/ProductPayload";

export const productService = {
  getAll: async (lang: string): Promise<ApiResponse<Product[]>> => {
    const { data } = await axiosInstance.get<ApiResponse<Product[]>>(
      "/products",
      { params: { lang } }
    );
    return data;
  },

  getById: async (id: number, lang: string): Promise<ApiResponse<Product>> => {
    const { data } = await axiosInstance.get<ApiResponse<Product>>(
      `/products/${id}`,
      { params: { lang } }
    );
    return data;
  },

  create: async (payload: CreateProductPayload): Promise<Product> => {
    const { data } = await axiosInstance.post<ApiResponse<Product>>(
      "/products",
      payload
    );
    return data.data;
  },

  update: async (
    id: number,
    payload: UpdateProductPayload,
    lang: string
  ): Promise<Product> => {
    const { data } = await axiosInstance.patch<ApiResponse<Product>>(
      `/products/${id}`,
      payload,
      { params: { lang } }
    );
    return data.data;
  },

  remove: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/products/${id}`);
  },
};
