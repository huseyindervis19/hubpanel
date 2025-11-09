export interface RoleLinks {
  self: string;
  edit: string;
  delete: string;
}

export interface Role {
  id: number;
  name: string;      
  description: string;       
  createdAt: string;
  updatedAt: string;
  _links?: RoleLinks; 
}
