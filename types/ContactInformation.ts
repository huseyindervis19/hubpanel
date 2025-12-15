export interface Links {
  self: string;
  edit: string;
  delete: string;
}


export interface Translated {
  address: string;
}

export interface ContactInformation {
  id: number;
  phone: string;
  whatsapp: string;
  email: string;
  latitude: number;
  longitude: number;
  createdAt?: string;
  updatedAt?: string;
  translated?: Translated;
  _links: Links;
}

//need to look
export interface UpdateContactInformationData {
  phone?: string;
  whatsapp?: string;
  email?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  _links: Links;
}

