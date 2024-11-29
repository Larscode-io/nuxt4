// composable for FileMaker API calls to fetch publications

import { FileMakerService } from '../../../services/fileMakerService'
import { useRuntimeConfig } from '#nitro'
import { fetchWithFallback } from '#imports'

const fieldMappings = {
  brochures: [
    'filename',
    'new_filename_cu',
    '_k1_Brochure_id',
    'title_n',
    'title_f',
    'title_e',
    'title_d',
    'offline',
  ],
  studies: [
    'filename',
    'new_filename_cu',
    '_k1_Studie_id',
    'title_n',
    'title_f',
    'title_e',
    'title_d',
    'offline',
  ],
  annualReports: [
    'filename',
    'new_filename_cu',
    '_k1_Jaarverslag_id',
    'title_n',
    'title_f',
    'title_e',
    'title_d',
    'offline',
  ],
  persberichten: [
    'filename',
    'new_filename_cu',
    'type',
    '_k1_Persbericht_id',
    'title_n',
    'title_f',
    'title_e',
    'title_d',
    'intro_n',
    'intro_f',
    'intro_e',
    'intro_d',
    'offline',
  ],
}

const mapFields = (data, type) =>
  data.map(({ fieldData }) =>
    Object.fromEntries(
      fieldMappings[type].map(field => [field, fieldData[field]]),
    ),
  )

export function useFileMakerPublications(token, tokenExpiration) {
  const config = useRuntimeConfig()
  const fileMakerService = new FileMakerService(config, fetchWithFallback)

  if (!token) {
    throw new Error(
      'No token found. Ensure the API URL includes the middleware to set the token.',
    )
  }

  const fetchPublications = async (type) => {
    if (!fieldMappings[type]) {
      throw new Error(`Invalid publication type: ${type}`)
    }

    try {
      const serviceMethodMap = {
        brochures:
          fileMakerService.getPublicaties_Brochures.bind(fileMakerService),
        studies: fileMakerService.getPublicaties_Studies.bind(fileMakerService),
        annualReports:
          fileMakerService.getPublicaties_Jaarverslagen.bind(fileMakerService),
        persberichten:
          fileMakerService.getPublicaties_Persberichten.bind(fileMakerService),
      }

      const {
        response: { dataInfo, data },
      } = await serviceMethodMap[type](token)

      return {
        expires: tokenExpiration,
        ...dataInfo,
        fmdata: mapFields(data, type),
      }
    }
    catch (error) {
      console.error(`Error fetching ${type} from FileMaker:`, error)
      throw error
    }
  }

  return {
    fetchPublications,
  }
}
