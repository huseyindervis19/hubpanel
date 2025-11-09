"use client";

import { useQuery, useQueryClient, useMutation, UseMutationResult } from "@tanstack/react-query";
import { getRoles, createRole, updateRole, deleteRole } from "@/services/roleService";
import { Role } from "@/types/Role";

export const useRoles = () => {
  const { data = [], isLoading, isError, refetch } = useQuery<Role[], Error>({
    queryKey: ["roles"],
    queryFn: getRoles,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  return {
    roles: data,
    isLoading,
    isError,
    refetch,
  };
};

export const useCreateRole = (): UseMutationResult<Role, Error, Partial<Role>> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Role>) => createRole(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["roles"] }),
  });
};

export const useUpdateRole = (): UseMutationResult<Role, Error, { id: number; data: Partial<Role> }> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateRole(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      queryClient.invalidateQueries({ queryKey: ["roles", variables.id] });
    },
  });
};

export const useDeleteRole = (): UseMutationResult<void, Error, number> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteRole(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["roles"] }),
  });
};
