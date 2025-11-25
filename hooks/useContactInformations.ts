"use client";

import {
  fetchContactInformation,
  createContactInformation,
  updateContactInformation,
  deleteContactInformation,
} from "@/services/contactInformationsService";
import {
  ContactInformation,
  CreateContactInformationData,
  UpdateContactInformationData,
} from "@/types/ContactInformation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useContactInformations = (language?: string) => {
  const queryClient = useQueryClient();
  const lang = language || "en";

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["contact-information", lang],
    queryFn: () => fetchContactInformation(lang),
    enabled: !!lang,
  });

  const createMutation = useMutation<ContactInformation, Error, CreateContactInformationData>(
    {
      mutationFn: createContactInformation,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["contact-information"] });
      },
    }
  );

  const updateMutation = useMutation<
    ContactInformation,
    Error,
    { id: number; data: UpdateContactInformationData; lang: string }
  >({
    mutationFn: ({ id, data, lang }) => updateContactInformation(id, data, lang),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-information"] });
    },
  });

  const deleteMutation = useMutation<void, Error, number>({
    mutationFn: deleteContactInformation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-information"] });
    },
  });

  return {
    contactInformation: data,
    loading: isLoading,
    error: error as Error | null,
    refetch,
    create: (payload: CreateContactInformationData) =>
      createMutation.mutateAsync(payload),
    update: (
      id: number,
      payload: UpdateContactInformationData,
      langOverride?: string
    ) => updateMutation.mutateAsync({ id, data: payload, lang: langOverride || lang }),
    remove: (id: number) => deleteMutation.mutateAsync(id),
    creating: createMutation.isPending,
    updating: updateMutation.isPending,
    deleting: deleteMutation.isPending,
  };
};

