// api/brochures.js
import { useFileMakerPublications } from './useFileMakerPublications'
import { defineEventHandler } from '#imports'

export default defineEventHandler(async (event) => {
  const { filemakerToken: token, filemakerTokenExpiration: tokenExpiration }
    = event.context

  try {
    const { fetchPublications } = useFileMakerPublications(
      token,
      tokenExpiration,
    )
    const result = await fetchPublications('brochures')

    return result.fmdata
  }
  catch (error) {
    console.error(error.message || 'Error in brochures API')
    return {
      status: 'error',
      code: 401,
      message:
        error.message || 'An error occurred while processing the request',
    }
  }
})