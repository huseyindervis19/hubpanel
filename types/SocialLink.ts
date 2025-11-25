export interface SocialLink {
  id: number;
  platform: string;
  icon: string;
  url: string;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSocialLinkData {
  platform: string;
  icon: string;
  url: string;
  order: number;
}

export interface UpdateSocialLinkData {
  platform?: string;
  icon?: string;
  url?: string;
  order?: number;
}

