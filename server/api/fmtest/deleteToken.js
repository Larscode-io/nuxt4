// https://github.com/unjs/ofetch?tab=readme-ov-file : Allow self-signed certificates
import { ofetch } from 'ofetch'
import { Agent } from 'undici' // To allow insecure HTTPS requests
import { useRuntimeConfig, defineEventHandler, createError, getQuery } from '#imports'

const unsecureAgent = new Agent({ connect: { rejectUnauthorized: false } })
const unsecureFetch = ofetch.create({ dispatcher: unsecureAgent })

export default defineEventHandler(async (event) => {
  const { token } = getQuery(event)
  // log that token is received to delete it
  if (!token) {
    throw createError({
      statusCode: 401,
      message: 'No token found.',
    })
  }
  // log token
  const { auServername, auDatabase } = useRuntimeConfig()

  const url = `https://${auServername}/fmi/data/v1/databases/${auDatabase}/sessions/${token}`

  async function fetchData(fetchFn) {
    try {
      // log the url and token
      const response = await fetchFn(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        timeout: 5000,
      })
      return response
    }
    catch (error) {
      if (error.name === 'FetchError') {
        if (
          error.cause?.message === 'This operation was aborted'
          && error.cause?.code === 20
        ) {
          return {
            status: 'error',
            code: 500,
            message: 'Our request timed out',
            data: null,
          }
        }
        else if (
          error.cause?.cause?.code === 'CERT_HAS_EXPIRED'
          && error.cause?.cause?.message === 'certificate has expired'
        ) {
          return {
            status: 'error',
            code: 500,
            message: 'The certificate has expired',
            data: null,
          }
        }
      }
      console.error('Detailed error:', error)
      return {
        status: 'error',
        code: 500,
        message: `Failed to delete FileMaker session with a token: ${error.message}`,
        data: null,
        error,
      }
    }
  }
  try {
    let result = await fetchData($fetch)
    if (result.status === 'error' && result.message.includes('certificate')) {
      console.error('Fallback to unsecureFetch due to SSL error')
      result = await fetchData(unsecureFetch)
    }

    return result
  }
  catch (error) {
    throw createError({
      statusCode: 500,
      message: `Failed to delete token: ${error.message}`,
    })
  }
})
