// http://localhost:3000/nuxt/api/fm/getJuportalData
import { useRuntimeConfig } from '#nitro'
import { fetchWithFallback, defineEventHandler, createError } from '#imports'

const mapJuportalData = data =>
  data.map(({ recordId, fieldData: { Arrest_xml: xml } }) => ({
    recordId,
    xml,
  }))

export default defineEventHandler(async (event) => {
  const { filemakerToken: token, filemakerTokenExpiration: tokenExpiration }
    = event.context

  if (!token) {
    console.error(
      'No token found in the event context, don\'t forget to include this api url in the middleware in server/middleware/fm.js.',
    )
    return {
      status: 'error',
      code: 401,
      message: 'No token found in the event context...',
    }
  }

  const config = useRuntimeConfig()
  const FileMakerAPI = new FileMakerAPI(config, fetchWithFallback)

  try {
    let ArrestDateMinus10 = null
    try {
      // #####
      // TODO: the url should be placed in a config file, we don't to limit the amount of files for these demo files
      // #####
      ({ ArrestDateMinus10 } = await $fetch('/api/fm/getArrestDateMinus10'))
    }
    catch (error) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Internal Server Error',
        message: 'Failed to fetch getArrestDateMinus10',
        error: error.message,
      })
    }

    // response has this signature: { dataInfo: { foundCount, returnedCount, layout }, data: [ { recordId, fieldData: { Arrest_xml: xml } } ] }
    const {
      response: { dataInfo, data },
    } = await FileMakerAPI.findJuportalData(token, ArrestDateMinus10)
    const arresten = mapJuportalData(data)

    const result = {
      expires: tokenExpiration,
      ...dataInfo,
      arresten,
    }

    if (!ArrestDateMinus10) {
      console.warn(
        'No arrest 10 date ago because no date in data, returning demo data',
      )
      result.warning = 'NO DATE PROVIDED, RETURNING DEMO DATA'
    }

    return result
  }
  catch (error) {
    console.error('Error fetching data from FileMaker:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Failed to fetch data from FileMaker',
      error: error.message,
    })
  }
})
