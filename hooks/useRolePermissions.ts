import { useQuery, useMutation, useQueryClient, UseMutationResult } from "@tanstack/react-query";
import { rolePermissionService } from "@/services/rolePermissionService";
import { Permission } from "@/types/Permission";

export const useRolePermissions = (roleId: number) => {
  const { data = [], isLoading, isError, refetch } = useQuery<Permission[], Error>({
    queryKey: ["rolePermissions", roleId],
    queryFn: () => rolePermissionService.getRolePermissions(roleId),
    enabled: !!roleId,
    staleTime: 1000 * 60 * 5,
  });

  return { permissions: data, isLoading, isError, refetch };
};

export const useUpdateRolePermissions = (): UseMutationResult<
  Permission[],
  Error,
  { roleId: number; permissionIds: number[] }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roleId, permissionIds }) =>
      rolePermissionService.updateRolePermissions(roleId, permissionIds),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["rolePermissions", variables.roleId] });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};
