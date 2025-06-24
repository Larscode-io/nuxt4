import { H3Event, getQuery, EventHandler, createError } from 'h3'
import { ApiUrl } from '@/core/constants'

// Separate handler definition and export to avoid TS7022 and circular dependencies in Nuxt.
// This is a quirk in Nuxt 3 where direct exports can cause issues with type inference and circular dependencies.
// Using a named export allows for better type handling and avoids the circular dependency issue.

const handler: EventHandler = async (event: H3Event) => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBaseUrl
  const lang = getQuery(event).lang || 'nl'

  // todo: during development we use the legacy API
  return await $fetch(`${baseURL}${ApiUrl.pressPleadings}?lang=${lang}`)
}

export default handler
