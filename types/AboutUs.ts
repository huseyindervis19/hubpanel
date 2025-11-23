export interface AboutUsLinks {
  self: string;
  edit: string;
  delete: string;
}

export interface AboutUsTranslated {
  story: string;
  mission: string;
  vision: string;
  values: string;
}

export interface AboutUsTranslations {
  [key: string]: AboutUsTranslated;
}

export interface AboutUs {
  id: number;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  translated?: AboutUsTranslated;
  translations?: AboutUsTranslations;
  _links: AboutUsLinks;
}

export interface CreateAboutUsData {
  imageUrl?: string;
  story: string;
  mission: string;
  vision: string;
  values: string;
}

export interface UpdateAboutUsData {
  imageUrl?: string;
  story?: string;
  mission?: string;
  vision?: string;
  values?: string;
}

