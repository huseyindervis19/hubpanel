import apiClient from "@/lib/axios";
import { Translation } from "@/types/Translation";
import { ApiResponse } from "@/types/ApiResponse";

// جلب كل الترجمات
export const getTranslations = async (): Promise<Translation[]> => {
  const response = await apiClient.get<ApiResponse<Translation[]>>("/translations");
  return response.data.data;
};

// تحديث ترجمة
export const updateTranslation = async (
  id: number,
  data: Partial<Translation>
): Promise<Translation> => {
  const response = await apiClient.patch<ApiResponse<Translation>>(
    `/translations/${id}`,
    data
  );
  return response.data.data;
};
