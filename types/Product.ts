export interface ProductImage {
  url: string;
}

export interface ProductTranslated {
  name: string;
  slug: string;
  description: string;
}

export interface ProductLinks {
  self: string;
  edit: string;
  delete: string;
}

export interface Product {
  id: number;
  categoryId: number;
  stockQuantity: number;
  isActive: boolean;
  isFeatured: boolean;
  priority: number;
  createdAt: string;
  updatedAt: string;
  Images: ProductImage[];
  translated: ProductTranslated;
  mainImage?: string;
  _links: ProductLinks;
}

export interface ProductData {
  name: string;
  slug?: string;
  description?: string;
  stockQuantity?: number;
  priority?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  categoryId: number;
}
