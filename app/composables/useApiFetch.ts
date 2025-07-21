// file: app/composables/useApiFetch.ts

// todo: enforcing clear boundaries between client and server
// because this is a server-only composable, it should not be used in client code
// and because it is server-only, it should not use any client-side features
// and it should not import any client-side code
// ❌ Remove or replace @/ imports with relative paths or ~/server/...
// ❌ Never use useAppConfig() or useNuxtApp() in these files
// ✅ Move anything shared but not client-bound to server/utils/ or shared/


// export function useApiFetch(apiUrl: string) {

//   return eventHandler(async () => {
//     const config = useRuntimeConfig()
//     const baseURL = config.public.apiBaseUrl
//     console.info(`Fetching from API: ${baseURL}${apiUrl}`)
//     try {
//       return await $fetch(`${baseURL}${apiUrl}`)
//     } catch (err) {
//       throw createError({ statusCode: 502, statusMessage: 'Legacy API error', cause: err })
//     }
//   })
// }

export function useApiFetch(apiUrl: string): EventHandler {
  return eventHandler(async (event: H3Event) => {
    const config = useRuntimeConfig()
    const baseURL = config.public.apiBaseUrl

    // Get all query parameters from the incoming request
    const incomingQuery = getQuery(event)
    // Set defaults if not present
    const year = incomingQuery.year || new Date().getFullYear()
    const lang = incomingQuery.lang || 'xx'

    // Merge defaults with all incoming query params
    const query = new URLSearchParams({ ...incomingQuery, lang, year }).toString()
    const separator = apiUrl.includes('?') ? '&' : '?'
    // console.info that we forward the request to the legacy API
    console.info(`Forwarding request to legacy API: ${baseURL}${apiUrl}${separator}${query}`)
    try {
      return await $fetch(`${baseURL}${apiUrl}${separator}${query}`)
    } catch (err) {
      throw createError({ statusCode: 502, statusMessage: 'Legacy API error', cause: err })
    }
  })
}
