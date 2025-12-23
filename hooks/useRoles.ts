"use client";

import { useQuery, useMutation, useQueryClient, UseMutationResult } from "@tanstack/react-query";
import { roleService } from "@/services/roleService";
import { Role, CreateRolePayload, UpdateRolePayload } from "@/types/Role";

export const useRoles = (lang: string) => {
  return useQuery({
    queryKey: ["roles", lang],
    queryFn: async () => {
      const res = await roleService.getAll(lang);
      return res.data;
    },
    enabled: !!lang,
  });
};

export const useRole = (id?: number, lang?: string) => {
  return useQuery({
    queryKey: ["role", id, lang],
    queryFn: async () => {
      if (!id || !lang) return null;
      const res = await roleService.getById(id, lang);
      return res.data;
    },
    enabled: !!id && !!lang,
  });
};

export const useCreateRole = (): UseMutationResult<Role, unknown, { payload: CreateRolePayload; lang: string }, unknown> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ payload, lang }) => roleService.create(payload, lang),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
};

export const useUpdateRole = (): UseMutationResult<
  Role,
  unknown,
  { id: number; payload: UpdateRolePayload; lang: string },
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload, lang }) => roleService.update(id, payload, lang),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
};

export const useDeleteRole = (): UseMutationResult<void, unknown, number, unknown> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: roleService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
};
