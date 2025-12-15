export interface Links {
  self: string;
  edit: string;
  delete: string;
}

export interface SocialLink {
  id: number;
  platform: string;
  icon: string;
  url: string;
  order: number;
  createdAt?: string;
  updatedAt?: string;
  _links?: Links; 
}

