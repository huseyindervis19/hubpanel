export interface CategoryTranslated {
  name: string;
  description: string;
}

export interface CategoryLinks {
  self: string;
  edit: string;
  delete: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  imageUrl?: string | null;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  translated?: CategoryTranslated;
}
