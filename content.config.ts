import { defineCollection, defineContentConfig } from '@nuxt/content'
import { z } from 'zod'

export default defineContentConfig({
  collections: {
    collection_dutch: defineCollection({
      source: 'nl/**/*.md',
      type: 'page',
    }),
    collection_french: defineCollection({
      source: 'fr/**/*.md',
      type: 'page',
    }),
    collection_german: defineCollection({
      source: 'de/**/*.md',
      type: 'page',
    }),
    collection_english: defineCollection({
      source: 'en/**/*.md',
      type: 'page',
    }),
    collection_member: defineCollection({
      source: 'members/active/**/*.json',
      type: 'data',
      schema: z.object({
        name: z.string(),
        slug: z.string().optional(),
        role: z.string().optional(),
        isAlive: z.boolean().optional(),
        startDate: z.string().nullable(),
        endDate: z.string().nullable(),
        lang: z.string(),
        picture: z.string().optional(),
        femaleTitle: z.boolean().optional(),
        alt: z.object({
          en: z.string().optional(),
          fr: z.string().optional(),
          nl: z.string().optional(),
          de: z.string().optional(),
        }).optional(),
        infos: z.object({
          en: z.array(z.string()).optional(),
          fr: z.array(z.string()).optional(),
          nl: z.array(z.string()).optional(),
          de: z.array(z.string()).optional(),
        }).optional(),
        roles: z.array(
          z.object({
            role: z.string(),
            startDate: z.string().nullable(),
            endDate: z.string().nullable(),
          }),
        ).optional(),
      }),
    }),
  },
})
