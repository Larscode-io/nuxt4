import { ApiUrl } from '@/core/constants'

export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBaseUrl
  console.log(`Fetching pleadings from ${ApiUrl.pressPleadings} with language ${getQuery(event).lang }`)

  const lang = getQuery(event).lang || 'nl'
  return $fetch(`${baseURL}${ApiUrl.pressPleadings}?lang=${lang}`)
})
