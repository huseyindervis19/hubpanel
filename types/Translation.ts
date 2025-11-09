import { Language } from "./Language";
import { TranslationKey } from "./TranslationKey";

export interface Translation {
  id: number;
  translationKeyId: number;
  languageId: number;
  value: string;
  TranslationKey?: TranslationKey;
  Language?: Language;
  _links?: {
    self: string;
    edit: string;
    delete: string;
  };
}
