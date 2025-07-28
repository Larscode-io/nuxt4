// server/routes/robots.txt.ts
export default defineEventHandler((event) => {
  const host = getRequestURL(event).host
  const isStaging = host.includes('nuxt.const-court.be')

  const sitemap = `Sitemap: https://${host}/sitemap.xml`

  const production = `
User-agent: *
Disallow: /public/
${sitemap}
  `.trim()

  const staging = `
User-agent: *
Disallow: /
  `.trim()

  setHeader(event, 'Content-Type', 'text/plain')
  return isStaging ? staging : production
})
