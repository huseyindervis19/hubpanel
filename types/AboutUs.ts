export interface Links {
  self: string;
  edit: string;
  delete: string;
}

export interface Translated {
  story: string;
  mission: string;
  vision: string;
  values: string;
}

export interface AboutUs {
  id: number;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  translated?: Translated;
  _links: Links;
}
