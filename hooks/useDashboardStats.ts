"use client";

import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "@/services/dashboardService";
import { DashboardStats } from "@/types/DashboardStats";

export const useDashboardStats = () => {
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery<DashboardStats, Error>({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
    staleTime: 1000 * 60 * 2, 
    retry: 2,
  });

  return {
    stats: data,
    isLoading,
    isError,
    refetch,
  };
};
