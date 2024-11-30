import knex from 'knex'
import type { PbcpWebsite } from '../../pages.type'
import { Languages } from '~/core/constants'
import { useRuntimeConfig, defineEventHandler } from '#imports'

export default defineEventHandler(async (event) => {
  const { lang, withArchive } = getQuery(event)
  const config = useRuntimeConfig()

  const titleByLang = {
    [Languages.DUTCH]: 'title_n',
    [Languages.FRENCH]: 'title_f',
    [Languages.ENGLISH]: 'title_e',
    [Languages.GERMAN]: 'title_d',
  }
  const titleDbKey = titleByLang[lang]

  const introByLang = {
    [Languages.DUTCH]: 'intro_n',
    [Languages.FRENCH]: 'intro_f',
    [Languages.ENGLISH]: 'intro_e',
    [Languages.GERMAN]: 'intro_d',
  }
  const introDbKey = introByLang[lang]

  const fileExtensionByLang = {
    [Languages.DUTCH]: 'n.pdf',
    [Languages.FRENCH]: 'f.pdf',
    [Languages.ENGLISH]: 'e.pdf',
    [Languages.GERMAN]: 'd.pdf',
  }

  const db = knex({
    client: 'mysql2',
    connection: {
      host: config.dbHost,
      user: config.dbUser,
      password: config.dbPassword,
      database: config.dbName,
    },
  })

  const records = await db('pbcp_website')
  const views = records?.map((record: PbcpWebsite) => {
    return {
      id: record._k1_pbcp_id,
      title: record[titleDbKey],
      description: record[introDbKey],
      filename: record.filename,
      fileName: record.filename.replace('.pdf', fileExtensionByLang[lang]),
      filePath: getPublicPathPDFFileGeneralPressRelease(lang, record.filename),
      archived: withArchive !== 'false',
    }
  })
  return views
})
