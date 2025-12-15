export interface Links {
  self: string;
  edit: string;
  delete: string;
}

export interface Language {
  id: number;
  code: string;       
  name: string;   
  isDefault?: boolean;   
  createdAt?: string;
  updatedAt?: string;
  _links?: Links; 
}
