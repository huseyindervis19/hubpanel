export type ApiResponse<T> = {
  data: T;
  meta: {
    total: number;
    count: number;
  };
  links: { next?: string; prev?: string; self: string };
  message: string;
  statusCode: number;
};
