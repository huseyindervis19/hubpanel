import { ApiLinks } from "./ApiResponse";

export interface Translated {
  name: string;
}

export interface Permission {
  id: number;
  translated?: Translated;   
  endpoint: string;       
  createdAt: string;
  updatedAt: string;
  _links?: ApiLinks;
}
