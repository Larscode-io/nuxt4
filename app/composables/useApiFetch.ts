// todo: enforcing clear boundaries between client and server
// because this is a server-only composable, it should not be used in client code
// and because it is server-only, it should not use any client-side features
// and it should not import any client-side code
// ❌ Remove or replace @/ imports with relative paths or ~/server/...
// ❌ Never use useAppConfig() or useNuxtApp() in these files
// ✅ Move anything shared but not client-bound to server/utils/ or shared/

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
    //
    // todo: enable when ready to find all legacy API calls
    // to be sure all legacy API calls are converted to real API calls
    // for now, we want these loggings out of the way because they are too noisy
    //
    // const pageName = event.node.req.url?.split('?')[0] || 'unknown'
    // console.info(`Fetching legacy API: \x1b[32m${event.node.req.url}\x1b[0m for: \x1b[34m${pageName}\x1b[0m`)
    return await $fetch(`${baseURL}${apiUrl}${separator}lang=${lang}`)
  } catch (err) {
    throw createError({ statusCode: 502, statusMessage: 'Legacy API error', cause: err })
  }
  })
}
