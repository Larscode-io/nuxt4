import { defineEventHandler } from '#imports'

export default defineEventHandler(async (event) => {
  const { filemakerToken: token, filemakerTokenExpiration: tokenExpiration }
    = event.context

  try {
    const { fetchPublications } = useFileMakerPublications(
      token,
      tokenExpiration,
    )
    return (await fetchPublications('studies')).fmdata
  }
  catch (error) {
    if (error instanceof Error) {
      console.error(error.message || 'Error in studies API')
    }
    else {
      console.error('Error in studies API')
    }
    return {
      status: 'error',
      code: 401,
      message:
        (error instanceof Error ? error.message : 'An error occurred while processing the request'),
    }
  }
})
