import knex from 'knex'
import { useRuntimeConfig, defineEventHandler } from '#imports'

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()

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
    .select(['._k1_pbcp_id', 'filename', 'title_n', 'title_f', 'title_d', 'title_e', 'intro_n', 'intro_f', 'intro_d', 'intro_e', 'type', 'archive', 'offline'])
    .orderBy('_k1_pbcp_id', 'desc')
  console.log(records)
  return records
})
