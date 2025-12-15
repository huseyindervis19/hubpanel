import { Language } from "./Language";
import { TranslationKey } from "./TranslationKey";

export interface Links {
  self: string;
  edit: string;
  delete: string;
}

export interface Translation {
  id: number;
  translationKeyId: number;
  languageId: number;
  value: string;
  TranslationKey?: TranslationKey;
  Language?: Language;
  _links: Links;
}
