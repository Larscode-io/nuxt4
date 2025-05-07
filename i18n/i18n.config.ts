export default defineI18nConfig(() => ({
  legacy: false,
  globalInjection: true,
  locale: 'nl',
  fallbackLocale: 'fr',
  silentTranslationWarn: false,
  langDir: 'i18n/locales', // must match actual folder
}))
