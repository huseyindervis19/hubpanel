export interface Links {
  self: string;
  edit: string;
  delete: string;
}

export interface RolePermission {
  id: number;
  roleId: number;
  permissionId: number;
  createdAt: string;
  _links?: Links;
}
