export interface Links {
  self: string;
  edit: string;
  delete: string;
}

export interface Translated {
  name: string;
  description: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  imageUrl?: string | null;
  priority: number;
  createdAt: string;
  updatedAt: string;
  translated?: Translated;
  _links: Links;
}
