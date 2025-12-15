import axiosInstance from "@/lib/axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Category } from "@/types/Category";
import { Product } from "@/types/Product";


// fetch categories by language ID
export const fetchAllCategories = async (lang: string): Promise<ApiResponse<Category[]>> => {
  const response = await axiosInstance.get<ApiResponse<Category[]>>(`/categories?lang=${lang}`);
  return response.data;
};


export const createCategory = async (formData: FormData): Promise<Category> => {
  const response = await axiosInstance.post<Category>("/categories", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};


export const updateCategory = async (
  id: number,
  data: FormData | Partial<Category>,
  lang: string
): Promise<Category> => {
  const isFormData = data instanceof FormData;
  
  const response = await axiosInstance.patch<ApiResponse<Category>>(
    `/categories/${id}`,
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

export const deleteCategory = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/categories/${id}`);
};

// fetch products by category ID
export const productsByCategoryId = async (
  categoryId: number,
  lang: string
): Promise<ApiResponse<Product[]>> => {
  const response = await axiosInstance.get<ApiResponse<Product[]>>(
    `/categories/${categoryId}/products?lang=${lang}`
  );
  return response.data;
};

// fetch category by ID
export const fetchCategoryById = async (
  id: number,
  lang: string
): Promise<ApiResponse<Category>> => {
  const response = await axiosInstance.get<ApiResponse<Category>>(
    `/categories/${id}?lang=${lang}`
  );
  return response.data;
};