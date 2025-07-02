// server/utils/useServerCache.ts

// todo: gebruiken zodra we geen proxy meer nodig hebben voor de legacy API
// via de composable useApiFetch.ts

/**
 * Tijdgebaseerde cache rond een async functie.
 *
 * @param key       Unieke sleutel voor deze cache-entry
 * @param maxAgeMs  Cache-vervaltijd in milliseconden
 * @param computeFn Functie die nieuwe data genereert als er geen geldige cache is
 */
export async function useServerCache<T>(
  key: string,
  maxAgeMs: number,
  computeFn: () => Promise<T>
): Promise<T> {
  const storage = useStorage('cache')
  const cached = await storage.getItem<{ data: T; timestamp: number }>(key)
  const now = Date.now()

  if (cached && now - cached.timestamp < maxAgeMs) {
    return cached.data
  }

  const data = await computeFn()
  await storage.setItem(key, { data, timestamp: now })
  return data
}

// voorbeeld gebruik:
// server/api/news.ts
// import { defineEventHandler, getQuery } from 'h3'
// import { useApiFetch } from '@/server/utils/useApiFetch'
// import { useServerCache } from '@/server/utils/useServerCache'

// export default defineEventHandler(async (event) => {
//   const lang = getQuery(event).lang || 'nl'
//   const key = `news-${lang}`
//   const maxAge = 5 * 60 * 1000 // 5 minuten

//   return await useServerCache(key, maxAge, () =>
//     useApiFetch(event, '/api/v1/news')
//   )
// })

// ✅ Goede versie van useApiFetch.ts
// import { getQuery, H3Event } from 'h3'

// export async function useApiFetch<T = unknown>(event: H3Event, apiUrl: string): Promise<T> {
//   const config = useRuntimeConfig()
//   const baseURL = config.public.apiBaseUrl
//   const lang = getQuery(event).lang || 'nl'
//   const separator = apiUrl.includes('?') ? '&' : '?'

//   try {
//     return await $fetch<T>(`${baseURL}${apiUrl}${separator}lang=${lang}`)
//   } catch (err) {
//     throw createError({
//       statusCode: 502,
//       statusMessage: 'Legacy API error',
//       cause: err
//     })
//   }
// }
