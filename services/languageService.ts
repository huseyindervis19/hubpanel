import apiClient from "@/lib/axios";
import { Language } from "@/types/Language";
import { ApiResponse } from "@/types/ApiResponse";

export const getLanguages = async (): Promise<Language[]> => {
  const response = await apiClient.get<ApiResponse<Language[]>>("/languages");
  return response.data.data;
};

export const getLanguageById = async (id: number): Promise<Language> => {
  const response = await apiClient.get<ApiResponse<Language>>(`/languages/${id}`);
  return response.data.data;
};

export const createLanguage = async (data: Partial<Language>): Promise<Language> => {
  const response = await apiClient.post<ApiResponse<Language>>("/languages", data);
  return response.data.data;
};

export const updateLanguage = async (id: number, data: Partial<Language>): Promise<Language> => {
  const response = await apiClient.patch<ApiResponse<Language>>(`/languages/${id}`, data);
  return response.data.data;
};

export const deleteLanguage = async (id: number): Promise<void> => {
  await apiClient.delete(`/languages/${id}`);
};
