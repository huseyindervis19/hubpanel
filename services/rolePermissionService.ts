import axiosInstance from "@/lib/axios";
import { Permission } from "@/types/Permission";
import { ApiResponse } from "@/types/ApiResponse";

export const rolePermissionService = {
  getRolePermissions: async (roleId: number): Promise<Permission[]> => {
    const response = await axiosInstance.get<ApiResponse<{ roleId: number; permissions: Permission[] }>>(
      `/roles/${roleId}/permissions`
    );
    return response.data.data.permissions;
  },

  updateRolePermissions: async (roleId: number, permissionIds: number[]): Promise<Permission[]> => {
    const response = await axiosInstance.patch<ApiResponse<{ roleId: number; permissions: Permission[] }>>(
      `/roles/${roleId}/permissions`,
      { permissionIds }
    );
    return response.data.data.permissions;
  },
};
