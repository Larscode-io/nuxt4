export default defineNuxtPlugin((nuxtApp) => {
  const route = useRoute()
  const defaultLocale = useRuntimeConfig().public.i18n.defaultLocale || 'en'
  const safeLocale = route.params.locale || defaultLocale
  nuxtApp.provide('safeLocale', safeLocale)
})
