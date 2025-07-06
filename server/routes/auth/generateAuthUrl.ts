// import { defineEventHandler, getQuery } from '#imports'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const { intendedDestination } = getQuery(event)
  function generateRandomState() {
    return Math.random().toString(36).substring(2)
  }

  try {
    const state = btoa(JSON.stringify({ id: generateRandomState(), intendedDestination }))
    const authorizationUrl = `${config.public.authorizeUri}?client_id=${config.public.clientId}`
      + `&scope=openid profile egovnrn roles enterprise`
      + `&response_type=code`
      + `&redirect_uri=${config.public.redirectUri}`
      + `&acr_values=urn:be:fedict:iam:fas:citizen:Level300`
      + `&state=${state}`
      + `&nonce=1244546`
    return authorizationUrl
  }
  catch (error) {
    console.error(error)
    return {
      statusCode: 500,
      body: error instanceof Error ? error.message : 'An unknown error occurred',
    }
  }
})
