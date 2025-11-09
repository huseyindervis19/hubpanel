import axiosInstance from "@/lib/axios";
import { Permission } from "@/types/Permission";
import { ApiResponse } from "@/types/ApiResponse";

export const permissionService = {
  getPermissions: async (): Promise<Permission[]> => {
    const response = await axiosInstance.get<ApiResponse<Permission[]>>("/permissions");
    return response.data.data; 
  },
};
