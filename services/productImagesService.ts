import axiosInstance from "@/lib/axios";
import { ApiResponse } from "@/types/ApiResponse";
import {
  ProductImage,
  CreateProductImagePayload,
  UpdateProductImagePayload,
} from "@/types/ProductImage";

export const productImageService = {
  getByProductId: async (
    productId: number
  ): Promise<ApiResponse<ProductImage[]>> => {
    const { data } = await axiosInstance.get<ApiResponse<ProductImage[]>>(
      `/product-images/product/${productId}`
    );
    return data;
  },

  create: async (
    payload: CreateProductImagePayload,
    file: File
  ): Promise<ProductImage> => {
    const formData = new FormData();
    formData.append("url", file);
    formData.append("productId", payload.productId.toString());

    if (payload.isMain) {
      formData.append("isMain", "true");
    }

    const { data } = await axiosInstance.post<ApiResponse<ProductImage>>(
      "/product-images",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    return data.data;
  },

  update: async (
    id: number,
    payload: UpdateProductImagePayload
  ): Promise<ProductImage> => {
    const { data } = await axiosInstance.patch<ApiResponse<ProductImage>>(
      `/product-images/${id}`,
      payload
    );
    return data.data;
  },

  remove: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/product-images/${id}`);
  },
};
