import { usePage } from "@inertiajs/react";
import { useMemo } from "react";
function applyReplacements(text, replacements) {
  if (!replacements || Object.keys(replacements).length === 0) {
    return text;
  }
  return Object.entries(replacements).reduce(
    (result, [key, value]) => result.replace(new RegExp(`:${key}(?![a-zA-Z0-9_])`, "g"), String(value)),
    text
  );
}
function getTranslationValue(translations, key) {
  if (key in translations && typeof translations[key] === "string") {
    return translations[key];
  }
  return key.split(".").reduce((obj, k) => {
    if (obj && typeof obj === "object" && k in obj) {
      return obj[k];
    }
    return void 0;
  }, translations);
}
function useTranslations(namespace) {
  const { translations, locale } = usePage().props;
  const t = useMemo(() => {
    return (key, fallback = "", replacements) => {
      if (!translations || !key) {
        return fallback;
      }
      try {
        const fullKey = namespace ? `${namespace}.${key}` : key;
        const translation = getTranslationValue(translations, fullKey);
        if (typeof translation === "string") {
          return applyReplacements(translation, replacements);
        }
        return fallback || key;
      } catch (error) {
        return fallback || key;
      }
    };
  }, [translations, namespace]);
  return { t, locale };
}
export {
  useTranslations as u
};
