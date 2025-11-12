import apiClient from "@/lib/axios";
import { Translation } from "@/types/Translation";
import { ApiResponse } from "@/types/ApiResponse";
import { TranslationResponse } from "@/types/TranslationResponse";

// fetch all data Translations
export const getTranslations = async (): Promise<Translation[]> => {
  const response = await apiClient.get<ApiResponse<Translation[]>>("/translations");
  return response.data.data;
};

// fetch data By Language ID 
export const getTranslationsByLanguage = async (
  languageId: number
): Promise<TranslationResponse> => {
  const response = await apiClient.get<TranslationResponse>(
    `/translations/language/${languageId}`
  );
  return response.data;
};

// update Translation
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
