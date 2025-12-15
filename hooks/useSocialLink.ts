"use client";

import { useQuery, useQueryClient, useMutation, UseMutationResult } from "@tanstack/react-query";
import { getSocialLinks, getSocialLinkById, createSocialLink, updateSocialLink, deleteSocialLink } from "@/services/socialLinkService";
import { SocialLink } from "@/types/SocialLink";
import { ApiResponse } from "@/types/ApiResponse";

export const useSocialLinks = () => {
  return useQuery<ApiResponse<SocialLink[]>, Error>({
    queryKey: ["social-links"],
    queryFn: getSocialLinks,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};

export function useSocialLink(id: number) {
  return useQuery<ApiResponse<SocialLink>, Error>({
    queryKey: ["social-links", id],
    queryFn: () => getSocialLinkById(id),
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });
}

export function useCreateSocialLink(): UseMutationResult<ApiResponse<SocialLink>, Error, Partial<SocialLink>> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SocialLink>) => createSocialLink(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["social-links"] }),
  });
}

export function useUpdateSocialLink(): UseMutationResult<ApiResponse<SocialLink>, Error, { id: number; data: Partial<SocialLink> }> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateSocialLink(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["social-links"] });
      queryClient.invalidateQueries({ queryKey: ["social-links", variables.id] });
    },
  });
}

export function useDeleteSocialLink(): UseMutationResult<void, Error, number> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteSocialLink(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["social-links"] }),
  });
}
