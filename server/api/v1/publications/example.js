// This is an example of how to fetch data from FileMaker and return it as JSON.

// all the Publicaties_Brochures, Publicaties_Jaarverslagen, Publicaties_Persberichten and Publicaties_Studies are
// refactored with a composable useFileMakerPublicaties

import { createError } from 'h3'
import { FileMakerService } from '../../../services/fileMakerService'
import { useRuntimeConfig } from '#nitro'
import { fetchWithFallback, defineEventHandler } from '#imports'

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
  const config = useRuntimeConfig()
  const fileMakerService = new FileMakerService(config, fetchWithFallback)

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
    } = await fileMakerService.getPublicaties_Brochures(token)

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
