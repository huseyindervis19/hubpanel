export interface HomeSlider {
  id: number;
  imageUrl: string;
  ctaLink?: string | null;
  createdAt: string;
  updatedAt: string;

  translated: {
    title: string;
    subTitle: string;
    ctaText: string;
  };

  _links?: {
    self?: string;
    edit?: string;
    delete?: string;
  };
}
