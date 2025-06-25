import { H3Event, getQuery } from 'h3'
import type { EventHandler } from 'h3'

export function useApiFetch(apiUrl: string): EventHandler {

  return eventHandler(async (event: H3Event) => {
    const config = useRuntimeConfig()
    const baseURL = config.public.apiBaseUrl
    const lang = getQuery(event).lang || 'nl'
    // Prevent duplicate ?lang=... if apiUrl already has query parameters
    const separator = apiUrl.includes('?') ? '&' : '?'
    try {
    const pageName = event.node.req.url?.split('?')[0] || 'unknown'
    console.info(`Fetching legacy API: \x1b[32m${event.node.req.url}\x1b[0m for: \x1b[34m${pageName}\x1b[0m`)
    return await $fetch(`${baseURL}${apiUrl}${separator}lang=${lang}`)
  } catch (err) {
    throw createError({ statusCode: 502, statusMessage: 'Legacy API error', cause: err })
  }
  })
}
