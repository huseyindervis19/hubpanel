import axiosInstance from "@/lib/axios";
import { SocialLink } from "@/types/SocialLink";
import { ApiResponse } from "@/types/ApiResponse";

export const getSocialLinks = async (): Promise<ApiResponse<SocialLink[]>> => {
  const response = await axiosInstance.get<ApiResponse<SocialLink[]>>("/social-links");
  return response.data;
};

export const getSocialLinkById = async (id: number): Promise<ApiResponse<SocialLink>> => {
  const response = await axiosInstance.get<ApiResponse<SocialLink>>(`/social-links/${id}`);
  return response.data;
};

export const createSocialLink = async (data: Partial<SocialLink>): Promise<ApiResponse<SocialLink>> => {
  const response = await axiosInstance.post<ApiResponse<SocialLink>>("/social-links", data);
  return response.data;
};

export const updateSocialLink = async (id: number, data: Partial<SocialLink>): Promise<ApiResponse<SocialLink>> => {
  const response = await axiosInstance.patch<ApiResponse<SocialLink>>(`/social-links/${id}`, data);
  return response.data;
};

export const deleteSocialLink = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/social-links/${id}`);
};
