import { jwtDecode } from 'jwt-decode'
import type { H3Event } from 'h3'
// import { defineEventHandler } from '#imports'

export default defineEventHandler(async (event: H3Event) => {
  const config = useRuntimeConfig(event)

  const query = getQuery(event)
  const { access_token } = query

  if (!('access_token' in query)) {
    console.error(`Missing query parameters: ${JSON.stringify(query)}`)
    return {
      statusCode: 400,
      body: 'Invalid request',
    }
  }

  try {
    const userInfo = await $fetch<Blob>(`${config.public.userinfoUri}`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + access_token,
      },
    })
    const userInfoString = await (userInfo).text()
    interface DecodedUserInfo {
      aud: string
      sub: string
      prefLanguage: string
      mail: string
      surname: string
      givenName: string
      roles: string
      subname: string
      iss: string
      egovNRN: string
      fedid: string
      assurance_level: string
    }

    const decodedUserInfo = jwtDecode<DecodedUserInfo>(userInfoString)
    return { statusCode: 200, body: { ...decodedUserInfo } }
  }
  catch (error) {
    console.error(error)
    return {
      statusCode: 500,
      body: error instanceof Error ? error.message : 'An unknown error occurred',
    }
  }
})
