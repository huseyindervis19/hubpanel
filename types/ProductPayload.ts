export interface CreateProductPayload {
  name: string;
  slug?: string;
  description?: string;
  stockQuantity?: number;
  priority?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  categoryId?: number | null;
}

export interface UpdateProductPayload extends Partial<CreateProductPayload> {}
