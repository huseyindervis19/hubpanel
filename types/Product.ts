import { ApiLinks } from "./ApiResponse";
import { ProductImage } from "./ProductImage";

export interface ProductTranslated {
  name: string;
  slug: string;
  description?: string;
}

export interface Product {
  id: number;
  categoryId?: number | null;
  stockQuantity: number;
  isActive: boolean;
  isFeatured: boolean;
  priority: number;
  createdAt: string;
  updatedAt: string;
  images?: ProductImage[];
  translated?: ProductTranslated;
  mainImage?: string | null;
  _links?: ApiLinks;
}
