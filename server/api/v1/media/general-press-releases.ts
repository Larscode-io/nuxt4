import knex from 'knex'
import type { PbcpWebsite } from '../../pages.type'
import { DEFAULT_LANGUAGE } from '../../../constants'
import { Languages } from '~/core/constants'
import { useRuntimeConfig, defineEventHandler } from '#imports'

export default defineEventHandler(async (event) => {
  const { lang = DEFAULT_LANGUAGE, withArchive = true } = getQuery(event) as { lang: Languages, withArchive: boolean }
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
  let query = db <PbcpWebsite>('pbcp_website')
    .whereNotNull(titleDbKey)
    .whereNull('offline')

  if (withArchive === false) {
    query = query.whereNull('archive')
  }

  const records = await query.orderBy('_k1_pbcp_id', 'desc')

  const views = records?.map((record: PbcpWebsite) => {
    const fileName = record.filename.replace('.pdf', fileExtensionByLang[lang])
    return {
      id: record._k1_pbcp_id,
      title: record[titleDbKey],
      description: record[introDbKey],
      fileName,
      fileName2: fileName,
      filePath: getPublicPathPDFFileGeneralPressRelease(lang, fileName),
      archived: withArchive !== false,
    }
  })
  return views
})
