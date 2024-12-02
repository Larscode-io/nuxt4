// This is an example of how to fetch data from FileMaker and return it as JSON.
// http://localhost:3000/nuxt/api/v1/publications/example

// all the Publicaties_Brochures, Publicaties_Jaarverslagen, Publicaties_Persberichten and Publicaties_Studies are
// refactored with a useFileMakerPublicaties

import { createError } from 'h3'
import { useRuntimeConfig } from '#nitro'
import { fetchWithFallback, defineEventHandler } from '#imports'

const config = useRuntimeConfig()
const FileMaker = new FilemakerApi(config, fetchWithFallback)

const fieldNames = [
  'filename',
  'new_filename_cu',
  '_k1_Brochure_id',
  'title_n',
  'title_f',
  'title_e',
  'title_d',
  'offline',
]

const mapFields = data =>
  data.map(({ fieldData }) =>
    Object.fromEntries(fieldNames.map(field => [field, fieldData[field]])),
  )

export default defineEventHandler(async (event) => {
  const token = event.context.filemakerToken
  const tokenExpiration = event.context.filemakerTokenExpiration

  if (!token) {
    console.error(
      'No token found in the event context, don\'t forget to include this api url in the middleware in server/middleware/fm.js.',
    )
    throw createError({
      statusCode: 503,
      message: 'The database seems currently unavailable. Please try again later.',
      fatal: true,
    })
  }

  try {
    const {
      response: { dataInfo, data },
      // messages,
    } = await FileMaker.getPublicaties_Brochures(token)

    return {
      expires: tokenExpiration,
      ...dataInfo,
      brochures: mapFields(data), // mapFields filters out the fields we don't need
    }
  }

  catch (error) {
    console.error('Error fetching data from FileMaker:', error)
    throw createError({ statusCode: 503, message: 'The database seems currently unavailable. Please try again later.' })
  }
})
