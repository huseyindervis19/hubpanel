export interface LanguageLinks {
  self: string;
  edit: string;
  delete: string;
}

export interface Language {
  id: number;
  code: string;       
  name: string;      
  createdAt: string;
  updatedAt: string;
  _links?: LanguageLinks; 
}
