import { ApiLinks } from "./ApiResponse";

export interface Translated {
  name: string;
  description?: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string | null;
  priority: number;
  createdAt: string;
  updatedAt: string;
  translated?: Translated;
  _links?: ApiLinks;
}
