import axiosInstance from "@/lib/axios";
import { ApiResponse } from "@/types/ApiResponse";
import {
  ContactInformation,
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

