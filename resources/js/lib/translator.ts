import { usePage } from '@inertiajs/react'
import { useMemo } from 'react'

/**
 * Type for translation replacements
 */
type Replacements = Record<string, string | number>

/**
 * Type for the translations object structure
 */
type Translations = Record<string, unknown>

/**
 * Applies replacements to a translation string
 * @param text - The text to process
 * @param replacements - Object with replacement values
 * @returns The processed string with replacements applied
 */
function applyReplacements(text: string, replacements?: Replacements): string {
  if (!replacements || Object.keys(replacements).length === 0) {
    return text
  }

  return Object.entries(replacements).reduce(
    (result, [key, value]) => result.replace(new RegExp(`:${key}(?![a-zA-Z0-9_])`, 'g'), String(value)),
    text
  )
}

/**
 * Gets translation value from translations object
 */
function getTranslationValue(translations: Translations, key: string): string | undefined {
  // Handle root level translations
  if (key in translations && typeof translations[key] === 'string') {
    return translations[key] as string
  }

  // Handle nested translations (dot notation)
  return key.split('.').reduce<unknown>((obj, k) => {
    if (obj && typeof obj === 'object' && k in (obj as object)) {
      return (obj as Record<string, unknown>)[k]
    }
    return undefined
  }, translations) as string | undefined
}

/**
 * Hook to use translations in React components
 * @param namespace - Optional namespace for translations
 * @returns Translation function and current locale
 */
export function useTranslations(namespace?: string) {
  const { translations, locale } = usePage().props as {
    translations?: Translations
    locale?: string
  }

  const t = useMemo(() => {
    return (key: string | undefined, fallback = '', replacements?: Replacements): string => {
      if (!translations || !key) {
        return fallback
      }

      try {
        const fullKey = namespace ? `${namespace}.${key}` : key
        const translation = getTranslationValue(translations, fullKey)

        if (typeof translation === 'string') {
          return applyReplacements(translation, replacements)
        }

        return fallback || key
      } catch (error) {
        return fallback || key
      }
    }
  }, [translations, namespace])

  return { t, locale }
}
