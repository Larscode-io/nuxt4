// api/getToken.js

import { Agent } from 'undici'
import { useRuntimeConfig, defineEventHandler, createError } from '#imports'

const unsecureFetch = $fetch.create({
  dispatcher: new Agent({
    connect: { rejectUnauthorized: false },
  }),
})
export default defineEventHandler(async (event) => {
  const { auServername, auDatabase, auUsername, auPassword }
    = useRuntimeConfig()

  if (!auServername || !auDatabase || !auUsername || !auPassword) {
    console.error(
      '/api/getToken: FileMaker environment variables are not set.',
    )
    throw createError({
      statusCode: 500,
      message: 'FileMaker environment variables are not set.',
    })
  }
  const url = `https://${auServername}/fmi/data/v1/databases/${auDatabase}/sessions`

  //  async function fetchData(fetchFn) {
  async function fetchData() {
    try {
      const response = await unsecureFetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${btoa(`${auUsername}:${auPassword}`)}`,
        },
        timeout: 5000,
      })
      return {
        status: 'success',
        code: 200,
        message: 'Data fetched successfully',
        data: response,
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
            code: 408,
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
            code: 400,
            message: 'The certificate has expired',
            data: null,
          }
        }
      }
      // Log the detailed error
      console.error('Detailed error:', error)
      return {
        status: 'error',
        code: 502,
        message: 'Failed to connect to FileMaker database',
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

    // Set CORS headers
    event.res.setHeader('Access-Control-Allow-Origin', '*') // Allow requests from any origin (adjust for production)
    event.res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS') // Allow specific HTTP methods
    event.res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization',
    )

    return result
  }
  catch (error) {
    throw createError({
      statusCode: 500,
      message: `Failed to get token: ${error.message}`,
    })
  }
})
