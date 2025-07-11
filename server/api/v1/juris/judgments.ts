import { ApiUrl } from '@/core/constants'

function useApiFetch(apiUrl: string): EventHandler {
  return eventHandler(async (event: H3Event) => {
    const config = useRuntimeConfig()
    const baseURL = config.public.apiBaseUrl

    // Get all query parameters from the incoming request
    const incomingQuery = getQuery(event)
    // Set defaults if not present
    const year = incomingQuery.year || new Date().getFullYear()
    const lang = incomingQuery.lang || 'nl'

    // Merge defaults with all incoming query params
    const query = new URLSearchParams({ ...incomingQuery, lang, year }).toString()
    const separator = apiUrl.includes('?') ? '&' : '?'

    try {
      return await $fetch(`${baseURL}${apiUrl}${separator}${query}`)
    } catch (err) {
      throw createError({ statusCode: 502, statusMessage: 'Legacy API error', cause: err })
    }
  })
}

export default useApiFetch(ApiUrl.judgments)
