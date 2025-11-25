import axiosInstance from "@/lib/axios";
import { ApiResponse } from "@/types/ApiResponse";
import {
  SocialLink,
  CreateSocialLinkData,
  UpdateSocialLinkData,
} from "@/types/SocialLink";

export const fetchSocialLinks = async (): Promise<SocialLink[]> => {
  const response = await axiosInstance.get<ApiResponse<SocialLink[]>>(
    `/social-links`
  );
  return response.data.data;
};

export const createSocialLink = async (
  data: CreateSocialLinkData
): Promise<SocialLink> => {
  const response = await axiosInstance.post<ApiResponse<SocialLink>>(
    `/social-links`,
    data
  );
  return response.data.data;
};

export const updateSocialLink = async (
  id: number,
  data: UpdateSocialLinkData
): Promise<SocialLink> => {
  const response = await axiosInstance.patch<ApiResponse<SocialLink>>(
    `/social-links/${id}`,
    data
  );
  return response.data.data;
};

export const deleteSocialLink = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/social-links/${id}`);
};

