import axiosInstance from "@/lib/axios";
import { Role, CreateRolePayload, UpdateRolePayload } from "@/types/Role";
import { ApiResponse } from "@/types/ApiResponse";

export const roleService = {
  getAll: async (lang: string): Promise<ApiResponse<Role[]>> => {
    const { data } = await axiosInstance.get<ApiResponse<Role[]>>("/roles", {
      params: { lang },
    });
    return data;
  },

  getById: async (id: number, lang: string): Promise<ApiResponse<Role>> => {
    const { data } = await axiosInstance.get<ApiResponse<Role>>(
      `/roles/${id}`,
      { params: { lang } }
    );
    return data;
  },

  create: async (payload: CreateRolePayload, lang: string): Promise<Role> => {
    const { data } = await axiosInstance.post<ApiResponse<Role>>(
      "/roles",
      payload,
      { params: { lang } }
    );
    return data.data;
  },

  update: async (
    id: number,
    payload: UpdateRolePayload,
    lang: string
  ): Promise<Role> => {
    const { data } = await axiosInstance.patch<ApiResponse<Role>>(
      `/roles/${id}`,
      payload,
      { params: { lang } }
    );
    return data.data;
  },

  remove: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/roles/${id}`);
  },
};
