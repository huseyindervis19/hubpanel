export interface Links {
  self: string;
  edit: string;
  delete: string;
}

export interface Translated {
  title: string;
  subTitle: string;
  ctaText: string;
}

export interface HomeSlider {
  id: number;
  imageUrl: string;
  ctaLink?: string;
  createdAt: string;
  updatedAt: string
  translated: Translated;
  _links?: Links,
}
