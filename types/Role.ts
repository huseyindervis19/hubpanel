import { ApiLinks } from "./ApiResponse";

export interface Translated {
  name: string;
  description?: string;
}

export interface Role {
  id: number;
  translated?: Translated;
  createdAt: string;
  updatedAt: string;
  _links?: ApiLinks;
}

export interface CreateRolePayload {
  name: string;
  description?: string;
}

export interface UpdateRolePayload {
  name?: string;
  description?: string;
}