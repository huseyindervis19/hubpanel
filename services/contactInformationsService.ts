import axiosInstance from "@/lib/axios";
import { ApiResponse } from "@/types/ApiResponse";
import {
  ContactInformation,
  CreateContactInformationData,
  UpdateContactInformationData,
} from "@/types/ContactInformation";

export const fetchContactInformation = async (
  lang: string
): Promise<ContactInformation> => {
  const response = await axiosInstance.get<ApiResponse<ContactInformation>>(
    `/contact-info?lang=${lang}`
  );
  return response.data.data;
};

export const createContactInformation = async (
  data: CreateContactInformationData
): Promise<ContactInformation> => {
  const response = await axiosInstance.post<ApiResponse<ContactInformation>>(
    `/contact-info`,
    data
  );
  return response.data.data;
};

export const updateContactInformation = async (
  id: number,
  data: UpdateContactInformationData,
  lang: string
): Promise<ContactInformation> => {
  const response = await axiosInstance.patch<ApiResponse<ContactInformation>>(
    `/contact-info/${id}?lang=${lang}`,
    data
  );
  return response.data.data;
};

export const deleteContactInformation = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/contact-info/${id}`);
};

