import axiosInstance from "@/lib/axios";
import { Permission } from "@/types/Permission";
import { ApiResponse } from "@/types/ApiResponse";

export const permissionService = {
  getAll: async (lang: string): Promise<ApiResponse<Permission[]>> => {
    const { data } = await axiosInstance.get<ApiResponse<Permission[]>>("/permissions", {
      params: { lang },
    });
    return data;
  },
};
