// http://localhost:3000/nuxt/api/sqltest/affzak
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

  const d = new Date()
  d.setHours(0, 0, 0, 0)
  const curDate = d.toISOString()

  const records = await db('xaffzak')
    .select([
      'id_role as idRole',
      db.raw('DATE_FORMAT(d_pron_fixe,\'%Y-%m-%d\') as dPronFixe'),
    ])
    .where('d_pron_fixe', '>=', curDate)
    .whereNotNull('d_pron_fixe')

  return records
})
