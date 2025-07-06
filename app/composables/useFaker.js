// composables/useFaker.js

export async function useFaker(locale) {
  const localeImportMap = {
    nl: 'fakerNL_BE',
    fr: 'fakerFR',
    de: 'fakerDE',
    en: 'fakerEN',
  }

  const { [localeImportMap[locale] || 'faker']: faker } = await import('@faker-js/faker')

  return faker
}
