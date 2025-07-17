// i18n/i18n.config.ts
export default defineI18nConfig(() => ({
  legacy: false,
  // If we disable globalInjection,
  // you must use useI18n() to get t.
  // todo: test the above
  globalInjection: true,
  locale: 'nl',
  fallbackLocale: 'fr',
  langDir: 'i18n/locales', // must match actual folder
}))
