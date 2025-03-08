import { defineCollection, defineContentConfig } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    pages_nl: defineCollection({
      source: 'nl/**', // Load content from /content/nl/
      type: 'page'
    }),
    pages_fr: defineCollection({
      source: 'fr/**', // Load content from /content/fr/
      type: 'page'
    }),
    pages_en: defineCollection({
      source: 'en/**', // Load content from /content/en/
      type: 'page'
    }),
    pages_de: defineCollection({
      source: 'de/**', // Load content from /content/de/
      type: 'page'
    }),
    // collection of json in the root and exclude the other collections
    // todo: move to a separate folder
    json: defineCollection({
      pattern: '**/*.json',
      type: 'json',
      exclude: ['pages_nl', 'pages_fr', 'pages_en', 'pages_de']
    })
  }
})
