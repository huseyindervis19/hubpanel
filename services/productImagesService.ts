import axiosInstance from "@/lib/axios";
import { ApiResponse } from "@/types/ApiResponse";
import { ProductImage } from "@/types/ProductImage";

// fetch all product images by product ID
export const getProductImagesByProductId = async (
  productId: number
): Promise<ApiResponse<ProductImage[]>> => {
  const response = await axiosInstance.get<ApiResponse<ProductImage[]>>(
    `/product-images/product/${productId}`
  );
  return response.data;
};

// create product image
export interface CreateProductImageData {
  productId: number;
  isMain?: boolean;
}

export const createProductImage = async (
  data: CreateProductImageData,
  file: File
): Promise<ProductImage> => {
  const formData = new FormData();
  formData.append("url", file);
  formData.append("productId", data.productId.toString());
  if (data.isMain) {
    formData.append("isMain", "true");
  }

  const response = await axiosInstance.post<ApiResponse<ProductImage>>(
    "/product-images",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data.data;
};

// update product image
export interface UpdateProductImageData {
  isMain?: boolean;
}

export const updateProductImage = async (
  id: number,
  data: UpdateProductImageData
): Promise<ProductImage> => {
  const response = await axiosInstance.patch<ApiResponse<ProductImage>>(
    `/product-images/${id}`,
    data
  );
  return response.data.data;
};

// delete product image
export const deleteProductImage = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/product-images/${id}`);
};

