// file: app/composables/useApiFetch.ts

// todo: enforcing clear boundaries between client and server
// because this is a server-only composable, it should not be used in client code
// and because it is server-only, it should not use any client-side features
// and it should not import any client-side code
// ❌ Remove or replace @/ imports with relative paths or ~/server/...
// ❌ Never use useAppConfig() or useNuxtApp() in these files
// ✅ Move anything shared but not client-bound to server/utils/ or shared/


export function useApiFetch(apiUrl: string){

  return eventHandler(async () => {
    const config = useRuntimeConfig()
    const baseURL = config.public.apiBaseUrl
    try {
    return await $fetch(`${baseURL}${apiUrl}`)
  } catch (err) {
    throw createError({ statusCode: 502, statusMessage: 'Legacy API error', cause: err })
  }
  })
}
