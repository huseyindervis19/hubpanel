export interface ContactInformationTranslated {
  address: string;
}

export interface ContactInformationTranslations {
  [language: string]: ContactInformationTranslated;
}

export interface ContactInformation {
  id: number;
  phone: string;
  whatsapp: string;
  email: string;
  latitude: number;
  longitude: number;
  translated?: ContactInformationTranslated;
  translations?: ContactInformationTranslations;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateContactInformationData {
  phone: string;
  whatsapp: string;
  email: string;
  latitude: number;
  longitude: number;
  address: string;
}

export interface UpdateContactInformationData {
  phone?: string;
  whatsapp?: string;
  email?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
}

