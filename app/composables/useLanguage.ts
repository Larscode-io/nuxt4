// import { useRouter } from 'vue-router'
import { nlBE, fr, de, enGB } from 'date-fns/locale'
import { computed } from 'vue'
import type { Ref } from 'vue'
import { useI18n, useSwitchLocalePath } from '#imports'
import type { MessageSchema } from '~~/types/i18n' // ~~ is an alias for the src directory

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

export function useLanguage() {
  // const router = import.meta.client ? useRouter() : null

  const { t, locales, locale, setLocale, defaultLocale } = useI18n<
    [MessageSchema],
    Languages.DUTCH | Languages.FRENCH | Languages.ENGLISH | Languages.GERMAN
  >()
  const switchLocalePath = useSwitchLocalePath()
  const localePath = useLocalePath()
  const availableLocales = computed(() => {
    return locales.value.filter(i => i.code !== locale.value)
  })

  const ogLocaleAlternate: (string | undefined)[] = locales.value.map(el => el.language)
  const ogLocale: MaybeComputedRefOrFalsy<string | null | undefined> = locales.value
    .filter(i => i.code === locale.value)
    .map(el => el.language)[0] || null

  const switchLanguage = (lang: Languages): string => {
    return switchLocalePath(lang)
  }

  const activeLocale = (locale: any) => {
    switch (locale) {
      case 'nl':
        return nlBE
      case 'fr':
        return fr
      case 'de':
        return de
      default:
        return enGB
    }
  }

  function getLocalizedPath(contentPath: string): string {
    return `${locale.value}/${contentPath}`
  }

  return {
    t,
    locale,
    switchLocalePath,
    switchLanguage,
    localePath,
    setLocale,
    availableLocales,
    ogLocale,
    ogLocaleAlternate,
    defaultLocale,
    activeLocale,
    getLocalizedPath,
  }
}
