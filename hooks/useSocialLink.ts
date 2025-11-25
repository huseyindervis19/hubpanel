"use client";

import {
  fetchSocialLinks,
  createSocialLink,
  updateSocialLink,
  deleteSocialLink,
} from "@/services/socialLinkService";
import {
  SocialLink,
  CreateSocialLinkData,
  UpdateSocialLinkData,
} from "@/types/SocialLink";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useSocialLink = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["social-links"],
    queryFn: fetchSocialLinks,
  });

  const createMutation = useMutation<SocialLink, Error, CreateSocialLinkData>({
    mutationFn: createSocialLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social-links"] });
    },
  });

  const updateMutation = useMutation<
    SocialLink,
    Error,
    { id: number; data: UpdateSocialLinkData }
  >({
    mutationFn: ({ id, data }) => updateSocialLink(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social-links"] });
    },
  });

  const deleteMutation = useMutation<void, Error, number>({
    mutationFn: deleteSocialLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social-links"] });
    },
  });

  return {
    socialLinks: data || [],
    loading: isLoading,
    error: error as Error | null,
    refetch,
    create: (payload: CreateSocialLinkData) => createMutation.mutateAsync(payload),
    update: (id: number, payload: UpdateSocialLinkData) =>
      updateMutation.mutateAsync({ id, data: payload }),
    remove: (id: number) => deleteMutation.mutateAsync(id),
    creating: createMutation.isPending,
    updating: updateMutation.isPending,
    deleting: deleteMutation.isPending,
  };
};

