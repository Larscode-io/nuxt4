// server/routes/robots.txt.ts

export default defineEventHandler((event) => {
  const url = getRequestURL(event)
  const host = url.host

  const isStaging = host === 'nuxt.const-court.be'

  const productionRobots = `
User-agent: *
Disallow:

Sitemap: https://www.const-court.be/sitemap.xml
  `.trim()

  const stagingRobots = `
User-agent: *
Disallow: /
  `.trim()

  setHeader(event, 'Content-Type', 'text/plain')
  return isStaging ? stagingRobots : productionRobots
})
