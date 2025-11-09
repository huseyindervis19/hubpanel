export interface RoleLinks {
  self: string;
  edit: string;
  delete: string;
}

export interface Permission {
  id: number;
  name: string;      
  endpoint: string;       
  createdAt: string;
  updatedAt: string;
  _links?: RoleLinks; 
}
