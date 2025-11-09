import { Translation } from "./Translation";

export interface TranslationKey {
  id: number;
  key: string;
  description?: string;
  translations?: Translation[];
}
