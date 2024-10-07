import { jwtDecode } from 'jwt-decode'
import { defineEventHandler } from '#imports'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const query = getQuery(event)

  if (!query.code || !query.scope || !query.iss || !query.state || !query.client_id) {
    console.error(`Missing query parameters: ${JSON.stringify(query)}`)
  }
  try {
    const auth = btoa(`${config.public.csamUser}:${config.csamPass}`)

    interface AuthResponse {
      access_token: string
      refresh_token: string
      scope: string
      id_token: string
      token_type: string
      expires_in: number
      nonce: string
    }

    const response = await $fetch<AuthResponse>(`${config.public.accessTokenUri}`, {
      method: 'POST',
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: String(query.code),
        redirect_uri: `${config.public.redirectUri}`,
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'Authorization': 'Basic ' + auth,
      },
    })

    const userInfo = await $fetch<Blob>(`${config.public.userinfoUri}`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + response.access_token,
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

    return decodedUserInfo
  }
  catch (error) {
    console.error(error)
    return {
      statusCode: 500,
      body: error instanceof Error ? error.message : 'An unknown error occurred',
    }
  }
})

