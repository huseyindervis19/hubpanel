"use client";

import { useQuery, useQueryClient, useMutation, UseMutationResult } from "@tanstack/react-query";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "@/services/userService";
import { User } from "@/types/User";

export const useUsers = (lang: string) => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await getUsers(lang);
      return res.data;
    },
    enabled: !!lang,
  });
};

export function useUser(id: number) {
  return useQuery<User, Error>({
    queryKey: ["users", id],
    queryFn: () => getUserById(id),
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });
}

export function useCreateUser(): UseMutationResult<User, Error, Partial<User>> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<User>) => createUser(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
}

export function useUpdateUser(): UseMutationResult<User, Error, { id: number; data: Partial<User> }> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateUser(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users", variables.id] });
    },
  });
}

export function useDeleteUser(): UseMutationResult<void, Error, number> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
}
