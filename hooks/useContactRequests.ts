"use client";

import { useQuery, useMutation, useQueryClient, UseMutationResult } from "@tanstack/react-query";
import {
  fetchAllContactRequests,
  createContactRequest,
  updateContactRequestStatus,
  deleteContactRequest,
} from "@/services/contactRequestsService";
import {
  ContactRequest,
  CreateContactRequestData,
  UpdateContactRequestStatusData,
} from "@/types/ContactRequest";

// fetch all contact requests
export const useContactRequests = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["contact-requests"],
    queryFn: fetchAllContactRequests,
  });

  const create = useMutation<ContactRequest, Error, CreateContactRequestData>({
    mutationFn: (data) => createContactRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-requests"] });
    },
  });

  const update = useMutation<
    ContactRequest,
    Error,
    { id: number; data: UpdateContactRequestStatusData }
  >({
    mutationFn: ({ id, data }) => updateContactRequestStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-requests"] });
    },
  });

  const remove = useMutation<void, Error, number>({
    mutationFn: (id) => deleteContactRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-requests"] });
    },
  });

  return {
    requests: data?.data || [],
    loading: isLoading,
    error: error as Error | null,
    refetch,
    create: create.mutate,
    update: (id: number, data: UpdateContactRequestStatusData) =>
      update.mutate({ id, data }),
    remove: remove.mutate,
    creating: create.isPending,
    updating: update.isPending,
    deleting: remove.isPending,
  };
};

