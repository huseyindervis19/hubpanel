import axiosInstance from "@/lib/axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Product, ProductData } from "@/types/Product";

// fetch all products by language
export const fetchAllProducts = async (lang: string): Promise<ApiResponse<Product[]>> => {
  const response = await axiosInstance.get<ApiResponse<Product[]>>(`/products?lang=${lang}`);
  return response.data;
};

// create product
export const createProduct = async (
  data: ProductData
): Promise<Product> => {
  const response = await axiosInstance.post<ApiResponse<Product>>(
    `/products`,
    data
  );
  return response.data.data;
};

// update product
export const updateProduct = async (
  id: number,
  data: ProductData,
  lang: string
): Promise<Product> => {
  const response = await axiosInstance.patch<ApiResponse<Product>>(
    `/products/${id}?lang=${lang}`,
    data
  );
  return response.data.data;
};

// delete product
export const deleteProduct = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/products/${id}`);
};

// fetch product by ID
export const fetchProductById = async (
  id: number,
  lang: string
): Promise<ApiResponse<Product>> => {
  const response = await axiosInstance.get<ApiResponse<Product>>(
    `/products/${id}?lang=${lang}`
  );
  return response.data;
};

