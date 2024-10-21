import { useI18n, useSwitchLocalePath } from "#imports";
import type { MessageSchema } from "~~/types/i18n"; // ~~ is an alias for the src directory
import { useRouter } from 'vue-router';

export enum Languages {
  ENGLISH = "en",
  FRENCH = "fr",
  DUTCH = "nl",
  GERMAN = "de",
}

export const languageLabels: Record<Languages, string> = {
  [Languages.DUTCH]: "Nederlands",
  [Languages.FRENCH]: "Français",
  [Languages.GERMAN]: "Deutsch",
  [Languages.ENGLISH]: "English",
};

export const defaultListLang: Record<string, string> = {
  [Languages.DUTCH]: "info_nl",
  [Languages.FRENCH]: "info_fr",
  [Languages.GERMAN]: "pdf_de",
};


export function useLanguage() {
  const router = useRouter();
  
  const { t, locales, locale, setLocale } = useI18n<
    [MessageSchema],
    Languages.DUTCH | Languages.FRENCH | Languages.ENGLISH | Languages.GERMAN
  >();
  const switchLocalePath = useSwitchLocalePath();
  const localePath = useLocalePath();

  const availableLocales = computed(() => {
    return locales.value.filter(i => i.code !== locale.value)
  })

const switchLanguage = (lang: any) => {
  router.push({ path: `${switchLocalePath(lang)}` });
};
  return {
    t,
    locale,
    switchLocalePath,
    localePath,
    setLocale,
    availableLocales,
    switchLanguage,
  };
}

