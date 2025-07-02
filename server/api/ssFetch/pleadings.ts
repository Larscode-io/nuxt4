// Hiermee kunnen we de legacy API gebruiken zonder CORS-problemen.
// Tijdens development fungeert ApiUrl.pressPleadings als proxy naar de legacy API.
// Dit is een test voor de proxy naar de legacy API.
// en een voorbeeld hoe we meestal een API endpoint opzetten in Nuxt 4.

import { ApiUrl } from '@/core/constants'

export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBaseUrl
  console.log(`Fetching pleadings from ${ApiUrl.pressPleadings} with language ${getQuery(event).lang }`)

  const lang = getQuery(event).lang || 'nl'
  return $fetch(`${ApiUrl.pressPleadings}?lang=${lang}`)
})
