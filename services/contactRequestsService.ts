import axiosInstance from "@/lib/axios";
import { ApiResponse } from "@/types/ApiResponse";
import {
  ContactRequest,
  CreateContactRequestData,
  UpdateContactRequestStatusData,
  PaginatedContactRequestsResponse,
} from "@/types/ContactRequest";

// fetch all contact requests
export const fetchAllContactRequests = async (): Promise<PaginatedContactRequestsResponse> => {
  const response = await axiosInstance.get<ApiResponse<ContactRequest[]>>(`/contact-requests`);
  return {
    data: response.data.data,
  };
};

// create contact request
export const createContactRequest = async (
  data: CreateContactRequestData
): Promise<ContactRequest> => {
  const response = await axiosInstance.post<ApiResponse<ContactRequest>>(
    `/contact-requests`,
    data
  );
  return response.data.data;
};

// update contact request status
export const updateContactRequestStatus = async (
  id: number,
  data: UpdateContactRequestStatusData
): Promise<ContactRequest> => {
  const response = await axiosInstance.patch<ApiResponse<ContactRequest>>(
    `/contact-requests/${id}/status`,
    data
  );
  return response.data.data;
};

// delete contact request
export const deleteContactRequest = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/contact-requests/${id}`);
};

