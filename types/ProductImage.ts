export interface ProductImage {
  id: number;
  productId: number;
  url: string;
  isMain: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductImagePayload {
  productId: number;
  isMain?: boolean;
}

export interface UpdateProductImagePayload {
  isMain?: boolean;
}
