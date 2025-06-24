// we demonstrate Nuxt’s $fetch server-side: no CORS issues, hide sensitive backend URLs from the client

import { ApiUrl } from '../../../app/core/constants'

export default defineEventHandler((event) => {

  console.log(`Fetching pleadings from ${ApiUrl.pressPleadings} with language ${getQuery(event).lang }`)

  const lang = getQuery(event).lang || 'nl'
  return $fetch(`https://node04.const-court.be/api/v1/press/pleadings?lang=${lang}`)
  // return $fetch(`https://node04.const-court.be${ApiUrl.pressPleadings}?lang=${lang}`)
})
