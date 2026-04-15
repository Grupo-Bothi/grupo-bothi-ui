// src/lib/api-i18n.ts
import es from "../../messages/es.json";
import en from "../../messages/en.json";

const messages = { es, en } as const;
type Locale = keyof typeof messages;
type ApiMessages = typeof es.api;

const LOCALES: Locale[] = ["es", "en"];
const DEFAULT_LOCALE: Locale = "es";

function getLocale(): Locale {
  const match = window.location.pathname.match(/^\/(es|en)/);
  const detected = match?.[1] as Locale | undefined;
  return detected && LOCALES.includes(detected) ? detected : DEFAULT_LOCALE;
}

export function getApiT(): ApiMessages {
  return messages[getLocale()].api;
}
