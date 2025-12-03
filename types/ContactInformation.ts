export interface ContactInformationTranslated {
  address: string;
}

export interface ContactInformation {
  id: number;
  phone: string;
  whatsapp: string;
  email: string;
  latitude: number;
  longitude: number;
  translated?: ContactInformationTranslated;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateContactInformationData {
  phone?: string;
  whatsapp?: string;
  email?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
}

