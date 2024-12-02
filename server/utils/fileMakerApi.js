// Handles the low-level details of making API requests to the FileMaker server.
// It manages the construction of requests, communication, and initial error handling.

export class FilemakerApi {
  constructor(config, fetchFn) {
    this.config = config
    this.fetch = fetchFn
    this.makeRequest = this.makeRequest.bind(this)
    this.baseUrl = `https://${this.config.auServername}/fmi/data/v1/databases/${this.config.auDatabase}/layouts`
  }

  async getArrestDateMinus10(token) {
    const url = `${this.baseUrl}/popup_XML_FOD_Justitie_Arrest/records?_offset=1&_limit=1`

    try {
      const response = await this.fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-nuxt-client': 'nuxt-app',
        },
      })
      return response
    }
    catch (error) {
      console.log(error)
    }
  }

  async makeRequest(layout, token, query, sort, additionalParams = {}) {
    const url = `${this.baseUrl}/${layout}/_find`
    const body = {
      query,
      sort,
      'layout.response': layout,
      ...additionalParams,
    }

    try {
      return await this.fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-nuxt-client': 'nuxt-app',
        },
        body: JSON.stringify(body),
      })
    }
    catch (error) {
      console.error(`Error in ${layout} request:`, error)
      throw error
    }
  }

  async getPublicaties_Jaarverslagen(token) {
    return this.makeRequest(
      'Publicaties_Jaarverslagen',
      token,
      [{ 'Jaarverslagen::offline': '==' }],
      [{ fieldName: 'Jaarverslagen::_k1_Jaarverslag_id', sortOrder: 'descend' }],
    )
  }

  async getPublicaties_Persberichten(token, lang, descriptionValue) {
    return this.makeRequest(
      'Publicaties_Persberichten',
      token,
      [
        {
          'Persberichten::offline': '==',
          [lang]: descriptionValue,
          'Persberichten::type': 'AG',
        },
      ],
      [{ fieldName: 'Persberichten::_k1_Persbericht_id', sortOrder: 'descend' }],
    )
  }

  async getPublicaties_Studies(token, lang, descriptionValue) {
    return this.makeRequest(
      'Publicaties_Studies',
      token,
      [
        {
          'Studies::offline': '==',
          [lang]: descriptionValue,
        },
      ],
      [{ fieldName: 'Studies::_k1_Studie_id', sortOrder: 'descend' }],
    )
  }

  async findJuportalData(token, arrestDate) {
    arrestDate = arrestDate ?? '09/19/2024' // default date is demo data
    return this.makeRequest(
      'popup_XML_FOD_Justitie_Arrest',
      token,
      [{ Arrest_Datum: arrestDate }],
      [
        { fieldName: 'Arrest_Datum', sortOrder: 'descend' },
        { fieldName: 'Arrest_Sorteernummer', sortOrder: 'descend' },
      ],
      { limit: '200' },
    )
  }

  async getPublicaties_Brochures(token) {
    return this.makeRequest(
      'Publicaties_Brochures',
      token,
      [{ 'Brochures::offline': '==' }],
      [{ fieldName: 'Brochures::_k1_Brochure_id', sortOrder: 'descend' }],
    )
  }
}
