import { useI18n } from 'vue-i18n'
import { useRoute, useHead, useSeoMeta, useNuxtApp } from '#imports'

export function useSeoSetup(options: {
  baseUrl: string
  imageUrl?: string
  titleKey: string
  descriptionKey: string
  namesByLocale: Record<string, string>
}) {
  const { locales, locale, t } = useI18n()
  const route = useRoute()

  const { baseUrl, imageUrl, titleKey, descriptionKey, namesByLocale } = options

  const ogUrl = `${baseUrl}${route.fullPath}`

  // title & description in actieve taal
  const title = t(titleKey)
  const description = t(descriptionKey)

  // Alle andere namen behalve actieve
  const alternateNames = Object.entries(namesByLocale)
    .filter(([code]) => code !== locale.value)
    .map(([, name]) => name)

  // hreflang links (gefilterd op unieke URL's per taal)
  const hreflangLinks = locales.value.map(l => ({
    rel: 'alternate',
    hreflang: l.code,
    href: `${baseUrl}/${l.code}${route.fullPath.replace(`/${locale.value}`, '')}`,
  }))

  // Structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'GovernmentOrganization',
    'name': namesByLocale[locale.value],
    'alternateName': alternateNames,
    'url': ogUrl,
    'address': {
      '@type': 'PostalAddress',
      'addressCountry': 'BE',
    },
    'inLanguage': locale.value,
  }

  // Open Graph & SEO
  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogType: 'website',
    ogImage: imageUrl,
    ogLocale: locale.value,
    ogLocaleAlternate: locales.value
      .map(l => l.code)
      .filter(code => code !== locale.value),
    ogUrl,
  })

  useHead({
    htmlAttrs: { lang: locale.value },
    link: [
      ...hreflangLinks,
      { rel: 'alternate', hreflang: 'x-default', href: `${baseUrl}/` },
      { rel: 'canonical', href: ogUrl },
    ],
    script: [
      {
        type: 'application/ld+json',
        children: JSON.stringify(structuredData),
      },
    ],
  })
}
