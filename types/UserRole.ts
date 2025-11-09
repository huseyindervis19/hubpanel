import { Role } from "./Role";

export interface UserRole {
  id: number;
  userId: number;
  roleId: number;
  createdAt: string;
  role: Role; 
}
