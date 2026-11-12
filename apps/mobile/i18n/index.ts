import { es } from "./es";

type Leaves<T> = {
  [K in keyof T & string]: T[K] extends string ? K : `${K}.${Leaves<T[K]>}`;
}[keyof T & string];

export type TranslationKey = Leaves<typeof es>;

export type TranslationParams = Record<string, string | number>;

const messages = es;

export const t = (key: TranslationKey, params?: TranslationParams): string => {
  const text = key.split(".").reduce<unknown>((node, part) => (node as Record<string, unknown>)[part], messages);
  if (typeof text !== "string") return key;
  if (!params) return text;
  return text.replace(/\{\{(\w+)\}\}/g, (_match, name: string) => String(params[name] ?? ""));
};
