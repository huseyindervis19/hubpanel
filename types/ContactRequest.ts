export type RequestStatus = "pending" | "in_progress" | "completed";

export interface ContactRequest {
  id: number;
  name: string;
  phone: string;
  email: string;
  status: RequestStatus;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContactRequestData {
  name: string;
  phone: string;
  email: string;
  message: string;
}

export interface UpdateContactRequestStatusData {
  status: RequestStatus;
}

export interface PaginatedContactRequestsResponse {
  data: ContactRequest[];
}

