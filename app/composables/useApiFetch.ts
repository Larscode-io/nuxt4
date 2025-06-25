import { H3Event, getQuery } from 'h3'
import type { EventHandler } from 'h3'

export function useApiFetch(apiUrl: string): EventHandler {

  return eventHandler(async (event: H3Event) => {
    const config = useRuntimeConfig()
    const baseURL = config.public.apiBaseUrl
    const lang = getQuery(event).lang || 'nl'
    return await $fetch(`${baseURL}${apiUrl}?lang=${lang}`)
  })
}
