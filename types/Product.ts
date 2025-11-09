import { Category } from "./Category";

export interface Product {
  id: number;
  name: string;
  slug?: string;
  description: string;
  stock_quantity: number;
  is_active: boolean;
  is_featured:boolean;
  category_id?: string;
  category?: Category;
}
