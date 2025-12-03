"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchContactInformation, updateContactInformation } from "@/services/contactInformationsService";
import { ContactInformation, UpdateContactInformationData } from "@/types/ContactInformation";

export const useContactInfo = (lang: string) => {
  return useQuery<ContactInformation>({
    queryKey: ["contactInfo", lang],
    queryFn: () => fetchContactInformation(lang),
    enabled: !!lang,
  });
};

export const useUpdateContactInfo = () => {
  const queryClient = useQueryClient();
  return useMutation<UpdateContactInformationData, Error, { id: number; data: UpdateContactInformationData; lang: string }>({
    mutationFn: ({ id, data, lang }) => updateContactInformation(id, data, lang),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-information"] });
    },
  });
};
