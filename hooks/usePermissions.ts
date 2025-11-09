"use client";

import { useQuery} from "@tanstack/react-query";
import { permissionService } from "@/services/permissionService";
import { Permission } from "@/types/Permission";

export const usePermissions = () => {
  const { data = [], isLoading, isError, refetch } = useQuery<Permission[], Error>({
    queryKey: ["permissions"],
    queryFn: permissionService.getPermissions,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  return {
    permissions: data,
    isLoading,
    isError,
    refetch,
  };
};