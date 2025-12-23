import { ApiLinks } from "./ApiResponse";

export interface UserRole {
  id: number;
  userId: number;
  roleId: number;
  createdAt: string;
  role: {
    id: number;
    name: string,
    description?: string;
    translated?: {
      name: string;
      description?: string;
    };
    createdAt: string;
    updatedAt: string;
    _links?: ApiLinks;
  }; 
}
