import { Agent } from 'undici' // To allow insecure HTTPS requests

export async function fetchWithFallback(url, options) {
  try {
    return await $fetch(url, options)
  }
  catch (error) {
    if (
      error.cause?.cause?.code === 'CERT_HAS_EXPIRED'
      || error.cause?.cause?.message === 'certificate has expired'
    ) {
      console.warn('Fallback to unsecureFetch due to SSL error')
      try {
        const unsecureFetch = $fetch.create({
          dispatcher: new Agent({
            connect: { rejectUnauthorized: false },
          }),
        })
        const res = await unsecureFetch(url, options)
        return handleResponse(res)
      }
      catch (innerError) {
        // in some cases a "no records found" makes fetch return a FetchError
        // we handle this case:
        return handleError(innerError)
      }
    }
    // If the error is not due to an expired SSL certificate, rethrow it
    throw error
  }
}

function handleResponse(response) {
  const {
    //    response: { dataInfo, data },
    messages,
  } = response

  if (messages && messages[0]) {
    const { code, message } = messages[0]

    if (code === '0' && message === 'OK') {
      return response
    }

    console.error(`Unexpected message from FileMaker: ${code}: ${message}`)
  }

  return response
}

function handleError(error) {
  if (error.response) {
    const { code } = error.data.messages[0] || {}

    switch (code) {
      case '401':
        console.info('No records found (FileMaker 401 error)')
        return {
          response: { dataInfo: null, data: [] },
          messages: error.data.messages,
        }
      case '400':
        console.info(
          'The request is invalid, for example the find criteria is empty (FileMaker 400 error)',
        )
        return {
          response: { dataInfo: null, data: [] },
          messages: error.data.messages,
        }
      default:
        console.error(`Unexpected error code: ${code}`)
        break
    }
  }
  else {
    console.error('Error with this request:', error.request)
    console.error('Error setting up request:', error.message)
  }

  return error
}
