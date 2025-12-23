export interface ApiLinks {
  self: string;
  edit?: string;
  delete?: string;
}

export interface ApiMeta {
  total: number;
  count: number;
}

export type ApiResponse<T> = {
  data: T;
  meta?: ApiMeta;
  links?: {
    next?: string;
    prev?: string;
    self: string;
  };
  message?: string;
  statusCode?: number;
};
