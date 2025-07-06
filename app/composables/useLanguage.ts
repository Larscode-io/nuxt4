import { nlBE, fr, de, enGB } from 'date-fns/locale'
import { computed } from 'vue'
import type { Ref } from 'vue'
// import type { MessageSchema } from '@/types/i18n' // ~~ is an alias for the src directory
import type { MessageSchema } from '../../models/i18n'

type MaybeComputedRefOrFalsy<T> = T | false | null | undefined | Ref<T>

export enum Languages {
  ENGLISH = 'en',
  FRENCH = 'fr',
  DUTCH = 'nl',
  GERMAN = 'de',
}

export const languageLabels: Record<Languages, string> = {
  [Languages.DUTCH]: 'Nederlands',
  [Languages.FRENCH]: 'Français',
  [Languages.GERMAN]: 'Deutsch',
  [Languages.ENGLISH]: 'English',
}

export const defaultListLang: Record<string, string> = {
  [Languages.DUTCH]: 'info_nl',
  [Languages.FRENCH]: 'info_fr',
  [Languages.GERMAN]: 'pdf_de',
}

const langCollection = {
  [Languages.DUTCH]: 'collection_dutch',
  [Languages.FRENCH]: 'collection_french',
  [Languages.GERMAN]: 'collection_german',
  [Languages.ENGLISH]: 'collection_english',
} as const satisfies Record<Languages, string>

export function useLanguage() {
  const { t, locales, locale, setLocale, defaultLocale } = useI18n<
    [MessageSchema],
    Languages.DUTCH | Languages.FRENCH | Languages.ENGLISH | Languages.GERMAN
  >()
  const switchLocalePath = useSwitchLocalePath()
  const availableLocales = computed(() => {
    return locales.value.filter(i => i.code !== locale.value)
  })

  const ogLocaleAlternate: MaybeComputedRefOrFalsy<string[]> = locales.value
    .map(el => el.language)
    .filter((lang): lang is string => typeof lang === 'string')

  const ogLocale: MaybeComputedRefOrFalsy<string | null | undefined> = locales.value
    .filter(i => i.code === locale.value)
    .map(el => el.language)[0] || null

  const switchLanguage = (lang: Languages): string => {
    return switchLocalePath(lang)
  }

  const activeLocale = (locale: Languages) => {
    switch (locale) {
      case Languages.DUTCH:
        return nlBE
      case Languages.FRENCH:
        return fr
      case Languages.GERMAN:
        return de
      default:
        return enGB
    }
  }

  function getLocalizedPath(contentPath: string): string {
    return `${locale.value}/${contentPath}`
  }

  const alternateLocale = computed(() =>
    locales.value
      .filter(i => i.code !== locale.value)
      .map (i => i.code),
  )

  return {
    t,
    locale,
    switchLanguage,
    setLocale,
    availableLocales,
    ogLocale,
    ogLocaleAlternate,
    defaultLocale,
    activeLocale,
    getLocalizedPath,
    langCollection,
    alternateLocale,
    switchLocalePath,
  }
}
