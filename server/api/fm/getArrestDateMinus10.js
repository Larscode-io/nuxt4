// http://localhost:3000/nuxt/api/fm/getArrestDateMinus10
import { useRuntimeConfig } from '#nitro'
import { fetchWithFallback, defineEventHandler } from '#imports'

export default defineEventHandler(async (event) => {
  // #####
  // for testing, to be removed in production
  // #####
  let howManyDaysLastVerdictFromWebsiteNode04 = null
  let lastVerdictDate = null
  try {
    const x = await $fetch(
      'https://node04.const-court.be/api/v1/juris/judgments?lang=nl&year=2024&limit=1',
    )
    const dates = x.map(record => record.judmentDate)
    const uniqueDates = [...new Set(dates)]
    uniqueDates.sort((a, b) => new Date(b) - new Date(a))
    const mostRecentDate = new Date(uniqueDates[0])
    lastVerdictDate = mostRecentDate
    const today = new Date()
    const diffTime = Math.abs(today - mostRecentDate)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    howManyDaysLastVerdictFromWebsiteNode04 = diffDays
  }
  catch (error) {
    console.error(
      'Error finding the most recent arrest date from the website',
      error,
    )
    return {
      status: 'error',
      code: 500,
      message: 'Error finding the most recent arrest date from the website',
      error: error.message,
    }
  }

  const token = event.context.filemakerToken
  const tokenExpiration = event.context.filemakerTokenExpiration

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

  // #####
  // for testing, to be removed in production
  // #####
  function formatISOToLocalDDMMYYYY(isoDateString) {
    const dateObject = new Date(isoDateString)

    // getDate(): Gives the date in local time zone
    const day = String(dateObject.getDate()).padStart(2, '0')
    const month = String(dateObject.getMonth() + 1).padStart(2, '0') // Months are 0-indexed
    const year = dateObject.getFullYear()

    return `${day}/${month}/${year}`
  }

  function getMaxArrestDateMinus10_cu(data) {
    // Helper function to validate date in MM/DD/YYYY format
    const isValidDate = (dateString) => {
      const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/
      return regex.test(dateString)
    }

    // Helper function to convert date string to JS Date object
    const toDate = (dateString) => {
      const [month, day, year] = dateString.split('/')
      return new Date(year, month - 1, day)
    }

    // Return early if data is missing or invalid
    if (!data?.[0]?.fieldData) {
      console.error('No data found in response to getArrestDateMinus10')
      return null
    }

    const maxArrestDate = data[0].fieldData.MaxArrestDateMinus10_cu

    // Handle empty string case
    if (!maxArrestDate) {
      console.info(
        'Empty date string in response to getArrestDateMinus10, 10 days ago there were no arrests',
      )
      return null
    }

    // Validate and convert date
    if (!isValidDate(maxArrestDate)) {
      console.error('Invalid date format in response to getArrestDateMinus10')
      return null
    }

    console.info(`We have a valid date: ${maxArrestDate} for 10 days ago`)
    return toDate(maxArrestDate)
  }

  const config = useRuntimeConfig()
  const FileMakerAPI = new FileMakerAPI(config, fetchWithFallback)

  try {
    const {
      response: { data },
    } = await FileMakerAPI.getArrestDateMinus10(token)
    const ArrestDateMinus10 = getMaxArrestDateMinus10_cu(data)
    // ArrestDateMinus10 will be a string date in format MM/DD/YYYY or '' if no records are found !
    return {
      expires: tokenExpiration,
      ArrestDateMinus10,
      // ###
      // for testing, to be removed in production
      // ###
      howManyDaysLastVerdictFromWebsiteNode04,
      lastVerdictDate: formatISOToLocalDDMMYYYY(lastVerdictDate),
    }
  }
  catch (error) {
    console.error('Error fetching data from FileMaker:', error)
    return {
      status: 'error',
      code: 500,
      message: 'Error fetching data from FileMaker',
      error: error.message,
    }
  }
})
