import { Permission } from "./Permission";
import { Role } from "./Role";

export interface RolePermissionLinks {
  self: string;
  role: string;
  permission: string;
  delete: string;
}

export interface RolePermission {
  id: number;
  role: Role;
  permission: Permission;
  createdAt: string;
  _links?: RolePermissionLinks;
}

export interface RolePermissionResponse {
  data: RolePermission[];
  message: string;
  statusCode: number;
}
