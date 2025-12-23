import apiClient from "@/lib/axios";
import { ApiResponse } from "@/types/ApiResponse";
import { DashboardStats } from "@/types/DashboardStats";

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await apiClient.get<ApiResponse<DashboardStats>>(
    "/dashboard/stats"
  );

  return response.data.data;
};
