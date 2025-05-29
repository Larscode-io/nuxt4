import type { H3Event } from 'h3'
import { defineEventHandler } from '#imports'

export default defineEventHandler(async (event: H3Event) => {
  const config = useRuntimeConfig(event)

  interface authCodeResponse {
    code: string
    scope: string
    iss: string
    state: string
    client_id: string
  }

  const query: authCodeResponse = getQuery(event)

  if (!('code' in query && 'state' in query)) {
    console.error(`Missing query parameters: ${JSON.stringify(query)}`)
    return {
      statusCode: 400,
      body: 'Invalid request',
    }
  }
  const { intendedDestination } = JSON.parse(atob(query.state))

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
    const { access_token } = response
    return { statusCode: 200, body: { access_token, intendedDestination } }
  }
  catch (error) {
    console.error(error)
    return {
      statusCode: 500,
      body: error instanceof Error ? error.message : 'An unknown error occurred',
    }
  }
})
