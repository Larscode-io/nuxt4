import { Agent } from 'undici' // To allow insecure HTTPS requests
import { useRuntimeConfig, defineEventHandler, createError } from '#imports'

// https://github.com/unjs/ofetch?tab=readme-ov-file : Allow self-signed certificates

const unsecureFetch = $fetch.create({
  dispatcher: new Agent({
    connect: { rejectUnauthorized: false },
  }),
})

export default defineEventHandler(async () => {
  const { auServername } = useRuntimeConfig()

  if (!auServername) {
    console.error('auServername is not defined in the runtime configuration.')
    throw createError({
      statusCode: 500,
      message: 'Server configuration error.',
    })
  }

  const url = `https://${auServername}/fmi/data/vLatest/productInfo`

  // Helper function to handle fetch and return consistent format
  async function fetchData(fetchFn) {
    try {
      await fetchFn(url, {
        method: 'GET',
        timeout: 5000,
      })

      return {
        status: 'success',
        code: 200,
        message: 'Data fetched successfully',
        // data: response,
      }
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
      // Log the detailed error
      console.error('Detailed error:', error)
      return {
        status: 'error',
        code: 500,
        message: 'Failed to connect to FileMaker database',
        data: null,
        error,
      }
    }
  }

  // First try using $fetch
  let result = await fetchData($fetch)
  // If $fetch fails due to a certificate issue, fallback to unsecureFetch
  if (result.status === 'error' && result.message.includes('certificate')) {
    console.error('Fallback to unsecureFetch due to SSL error')
    result = await fetchData(unsecureFetch)
  }

  return result
})
