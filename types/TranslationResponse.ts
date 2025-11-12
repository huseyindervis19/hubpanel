import { Language } from "./Language";

export interface TranslationsMap {
  [key: string]: string;
}

export interface TranslationResponse {
  language: Language;
  translations: TranslationsMap;
  message: string;
  statusCode: number;
}
