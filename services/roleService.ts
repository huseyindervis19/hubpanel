import axiosInstance from "@/lib/axios";
import { Role } from "@/types/Role";
import { ApiResponse } from "@/types/ApiResponse";

export const getRoles = async (): Promise<Role[]> => {
  const response = await axiosInstance.get<ApiResponse<Role[]>>("/roles");
  return response.data.data;
};

export const getRoleById = async (id: number): Promise<Role> => {
  const response = await axiosInstance.get<ApiResponse<Role>>(`/roles/${id}`);
  return response.data.data;
};

export const createRole = async (data: Partial<Role>): Promise<Role> => {
  const response = await axiosInstance.post<ApiResponse<Role>>("/roles", data);
  return response.data.data;
};

export const updateRole = async (id: number, data: Partial<Role>): Promise<Role> => {
  const response = await axiosInstance.patch<ApiResponse<Role>>(`/roles/${id}`, data);
  return response.data.data;
};

export const deleteRole = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/roles/${id}`);
};
